/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * Sequential next-hour weather forecast:
 * - train on real historical weather data once
 * - each click predicts one next hour
 * - synthetic predictions roll forward autoregressively
 */

let model;
let hourlyData = [];
let forecastSequence = [];
let forecastHistory = [];
let trainWindows = [];
let testWindows = [];

const locationConfig = {
  name: "New York City",
  lat: 40.7128,
  lon: -74.006,
};

const sequenceLength = 24;
const trainSplitRatio = 0.8;
const historyDays = 70;

const trainingEpochs = 60;
const trainingBatchSize = 64;
const maxTrainWindows = 600;
const maxEvalWindows = 80;
const maxHistoryRows = 12;

const inputFeatures = [
  "temperature",
  "humidity",
  "wind_speed",
  "pressure",
  "precipitation",
  "hour_sin",
  "hour_cos",
  "day_sin",
  "day_cos",
];

const outputFeatures = [
  "temperature",
  "humidity",
  "wind_speed",
  "precipitation",
];

const metricConfig = {
  precipitation: { label: "Precip", unit: "mm", color: [27, 91, 186] },
  temperature: { label: "Temp", unit: "C", color: [214, 85, 44] },
  humidity: { label: "Humidity", unit: "%", color: [43, 120, 120] },
  wind_speed: { label: "Wind", unit: "m/s", color: [90, 90, 90] },
};

let selectedMetric = "precipitation";

let state = "loading";
let statusMessage = "Loading weather observations...";
let latestPrediction = null;
let testMAE = null;

let trainingEpoch = 0;
let trainingLoss = null;
let trainingStartMs = 0;
let lastEpochMs = 0;
let avgEpochMs = 0;

let lastObservedTimestamp = "n/a";
let dataRangeLabel = "n/a";
let isPredictingNow = false;
let forecastStepCounter = 0;
let activeBackend = "unknown";

function setup() {
  const canvas = createCanvas(980, 640);
  canvas.parent("canvasDiv");

  const predictBtn = select("#predictBtn");
  predictBtn.mouseClicked(() => predictNextHour());
  predictBtn.attribute("disabled", "true");

  bindMetricButtons();
  init();
}

function bindMetricButtons() {
  const mapping = [
    ["#metricPrecip", "precipitation"],
    ["#metricTemp", "temperature"],
    ["#metricHumidity", "humidity"],
    ["#metricWind", "wind_speed"],
  ];

  mapping.forEach(([id, metric]) => {
    const btn = select(id);
    if (btn) {
      btn.mouseClicked(() => {
        selectedMetric = metric;
      });
    }
  });
}

async function init() {
  try {
    statusMessage = "Configuring backend...";

    try {
      await ml5.tf.setBackend("webgl");
    } catch (backendErr) {
      console.warn("WebGL backend unavailable, falling back to CPU.", backendErr);
      await ml5.tf.setBackend("cpu");
    }
    await ml5.tf.ready();
    activeBackend = ml5.tf.getBackend ? ml5.tf.getBackend() : "unknown";

    statusMessage = "Fetching real meteorological data from Open-Meteo...";
    hourlyData = await fetchOpenMeteoHistory();
    if (hourlyData.length < sequenceLength + 80) {
      throw new Error("Not enough cleaned weather rows to train reliably.");
    }

    lastObservedTimestamp = hourlyData[hourlyData.length - 1].date;
    dataRangeLabel = `${hourlyData[0].date} to ${lastObservedTimestamp}`;

    const windows = buildOneStepWindows(hourlyData, sequenceLength);
    const splitIndex = Math.floor(windows.length * trainSplitRatio);
    trainWindows = windows.slice(0, splitIndex);
    testWindows = windows.slice(splitIndex);

    if (trainWindows.length > maxTrainWindows) {
      trainWindows = trainWindows.slice(-maxTrainWindows);
    }

    statusMessage = "Building sequence model...";
    model = buildModel();
    await model.ready;

    trainWindows.forEach((sample) => {
      model.addData(sample.inputs, sample.outputs);
    });
    model.normalizeData();

    state = "training";
    trainingEpoch = 0;
    trainingLoss = null;
    trainingStartMs = performance.now();
    lastEpochMs = trainingStartMs;
    avgEpochMs = 0;

    statusMessage = `Quality mode training with ${trainWindows.length} windows...`;
    await model.train(
      {
        epochs: trainingEpochs,
        batchSize: trainingBatchSize,
        validationSplit: 0.1,
      },
      whileTraining,
      () => {}
    );

    state = "predicting";
    statusMessage = "Training complete. Click Predict Next Hour to forecast forward.";

    forecastSequence = hourlyData.slice(-sequenceLength).map((row) => ({ ...row }));
    forecastHistory = [];
    latestPrediction = null;
    forecastStepCounter = 0;

    select("#predictBtn").removeAttribute("disabled");

    setTimeout(async () => {
      try {
        testMAE = await evaluateOnTestSet(testWindows);
      } catch (evalErr) {
        console.warn("Evaluation failed:", evalErr);
      }
    }, 0);
  } catch (err) {
    console.error(err);
    state = "error";
    statusMessage = `Error: ${err.message}`;
  }
}

function buildModel() {
  const options = {
    task: "sequenceRegression",
    debug: false,
    learningRate: 0.0015,
    inputs: inputFeatures,
    outputs: outputFeatures,
    layers: [
      {
        type: "lstm",
        units: 48,
        activation: "tanh",
        kernelInitializer: "glorotUniform",
        recurrentInitializer: "glorotUniform",
        inputShape: [sequenceLength, inputFeatures.length],
        returnSequences: true,
        dropout: 0.1,
        recurrentDropout: 0.1,
      },
      {
        type: "lstm",
        units: 24,
        activation: "tanh",
        kernelInitializer: "glorotUniform",
        recurrentInitializer: "glorotUniform",
        returnSequences: false,
        dropout: 0.1,
        recurrentDropout: 0.1,
      },
      {
        type: "dense",
        units: 24,
        activation: "relu",
        kernelInitializer: "glorotUniform",
      },
      {
        type: "dense",
        activation: "linear",
        kernelInitializer: "glorotUniform",
      },
    ],
  };

  return ml5.neuralNetwork(options);
}

function whileTraining(epoch, logs) {
  const now = performance.now();
  const epochTime = now - lastEpochMs;

  trainingEpoch = epoch + 1;
  const lossValue = logs && typeof logs.loss === "number" ? logs.loss : null;
  trainingLoss = lossValue;
  avgEpochMs = trainingEpoch === 1 ? epochTime : avgEpochMs * 0.8 + epochTime * 0.2;
  lastEpochMs = now;

  const lossLabel = lossValue === null ? "n/a" : lossValue.toFixed(5);
  statusMessage = `Quality mode epoch ${trainingEpoch}/${trainingEpochs} - loss: ${lossLabel}`;
}

async function predictNextHour() {
  if (!model || state !== "predicting") {
    statusMessage = "Model is not ready for prediction yet.";
    return;
  }

  if (isPredictingNow) {
    return;
  }

  isPredictingNow = true;
  const predictBtn = select("#predictBtn");
  if (predictBtn) {
    predictBtn.attribute("disabled", "true");
  }

  try {
    statusMessage = "Predicting next hour...";

    const modelInput = buildInputSequence(forecastSequence);
    const results = await model.predict(modelInput);
    const nextValues = buildOutputObject(results);

    const lastRow = forecastSequence[forecastSequence.length - 1];
    const nextDate = computeNextHourTimestamp(lastRow.date);

    const syntheticRow = addTimeFeatures({
      date: nextDate,
      temperature: nextValues.temperature,
      humidity: nextValues.humidity,
      wind_speed: nextValues.wind_speed,
      precipitation: nextValues.precipitation,
      // pressure as input-only feature: persistence baseline
      pressure: lastRow.pressure,
    });

    forecastSequence.push(syntheticRow);
    if (forecastSequence.length > sequenceLength) {
      forecastSequence.shift();
    }

    forecastStepCounter += 1;
    latestPrediction = {
      step: forecastStepCounter,
      ...syntheticRow,
    };

    forecastHistory.push(latestPrediction);
    if (forecastHistory.length > maxHistoryRows) {
      forecastHistory = forecastHistory.slice(-maxHistoryRows);
    }

    statusMessage = `Predicted +${forecastStepCounter}h at ${syntheticRow.date}`;
  } catch (predictErr) {
    console.error(predictErr);
    statusMessage = `Prediction failed: ${predictErr.message}`;
  } finally {
    isPredictingNow = false;
    if (predictBtn) {
      predictBtn.removeAttribute("disabled");
    }
  }
}

function buildOutputObject(results) {
  const getVal = (label) => {
    const item = results.find((entry) => entry.label === label);
    return item ? item.value : 0;
  };

  return {
    temperature: getVal("temperature"),
    humidity: constrain(getVal("humidity"), 0, 100),
    wind_speed: max(0, getVal("wind_speed")),
    precipitation: max(0, getVal("precipitation")),
  };
}

async function evaluateOnTestSet(testSamples) {
  if (!testSamples.length) {
    return null;
  }

  const evalStep = Math.max(1, Math.floor(testSamples.length / maxEvalWindows));
  const sampled = [];
  for (let i = 0; i < testSamples.length; i += evalStep) {
    sampled.push(testSamples[i]);
    if (sampled.length >= maxEvalWindows) {
      break;
    }
  }

  const absError = {
    temperature: 0,
    humidity: 0,
    wind_speed: 0,
    precipitation: 0,
  };
  let count = 0;

  for (const sample of sampled) {
    const pred = await model.predict(sample.inputs);
    const predObj = buildOutputObject(pred);

    outputFeatures.forEach((k) => {
      absError[k] += Math.abs(predObj[k] - sample.outputs[k]);
    });
    count += 1;
  }

  if (count === 0) {
    return null;
  }

  return {
    temperature: absError.temperature / count,
    humidity: absError.humidity / count,
    wind_speed: absError.wind_speed / count,
    precipitation: absError.precipitation / count,
  };
}

function draw() {
  background(242);

  drawHeader();
  drawStatus();

  if (state === "loading") {
    drawLoadingUI();
    return;
  }

  if (state === "error") {
    drawErrorUI();
    return;
  }

  if (state === "training") {
    drawTrainingPanel();
    return;
  }

  drawPredictionPanel();
  drawForecastHistory();
  drawMetricChart();
}

function drawHeader() {
  noStroke();
  fill(22);
  textAlign(LEFT);
  textSize(22);
  text("Sequential Next-Hour Weather Forecast", 18, 34);

  textSize(13);
  fill(60);
  text(
    `Location: ${locationConfig.name} (${locationConfig.lat.toFixed(4)}, ${locationConfig.lon.toFixed(4)})`,
    18,
    56
  );
  text(`Data range: ${dataRangeLabel}`, 18, 74);
}

function drawStatus() {
  fill(45);
  textAlign(LEFT);
  textSize(13);
  text(`Status: ${statusMessage}`, 18, 98, width - 30);
  text(`Backend: ${String(activeBackend).toUpperCase()}`, 18, 116);

  if (testMAE !== null) {
    text(
      `MAE | Precip: ${nf(testMAE.precipitation, 0, 3)} mm | Temp: ${nf(testMAE.temperature, 0, 3)} C | Humidity: ${nf(testMAE.humidity, 0, 3)}% | Wind: ${nf(testMAE.wind_speed, 0, 3)} m/s`,
      18,
      136,
      width - 30
    );
  }
}

function drawLoadingUI() {
  noStroke();
  textAlign(CENTER);
  fill(40);
  textSize(30);
  text("Loading...", width / 2, height / 2 - 10);
}

function drawErrorUI() {
  noStroke();
  textAlign(CENTER);
  fill(145, 30, 30);
  textSize(26);
  text("Error", width / 2, height / 2 - 8);
  textSize(14);
  fill(70);
  text(statusMessage, width / 2, height / 2 + 18, width - 90);
}

function drawTrainingPanel() {
  noStroke();
  textAlign(CENTER);
  fill(25);
  textSize(34);
  text("Training (Quality Mode)", width / 2, 190);

  const elapsedSeconds = max(0, (performance.now() - trainingStartMs) / 1000);
  const lossLabel = typeof trainingLoss === "number" ? trainingLoss.toFixed(5) : "n/a";
  const avgEpochLabel = Number.isFinite(avgEpochMs) ? avgEpochMs.toFixed(0) : "n/a";

  textSize(16);
  fill(50);
  text(`Epoch ${trainingEpoch}/${trainingEpochs}`, width / 2, 225);
  text(`Loss ${lossLabel}`, width / 2, 248);
  text(`Elapsed ${elapsedSeconds.toFixed(1)}s | Avg ${avgEpochLabel} ms/epoch`, width / 2, 271);

  const progress = constrain(trainingEpoch / trainingEpochs, 0, 1);
  const barWidth = 520;
  const barHeight = 14;
  const barX = width / 2 - barWidth / 2;
  const barY = 300;

  fill(218);
  rect(barX, barY, barWidth, barHeight, 8);
  fill(37, 112, 214);
  rect(barX, barY, barWidth * progress, barHeight, 8);
}

function drawPredictionPanel() {
  const panelX = 18;
  const panelY = 138;
  const panelW = width - 36;
  const panelH = 126;

  noStroke();
  fill(255);
  rect(panelX, panelY, panelW, panelH, 10);

  fill(22);
  textAlign(LEFT);
  textSize(17);
  text("Latest Forecast", panelX + 14, panelY + 26);

  textSize(13);
  fill(70);
  if (!latestPrediction) {
    text("No forecast yet. Click Predict Next Hour.", panelX + 14, panelY + 48);
    return;
  }

  text(`Step: +${latestPrediction.step}h`, panelX + 14, panelY + 48);
  text(`Timestamp: ${latestPrediction.date}`, panelX + 170, panelY + 48);

  fill(15);
  textSize(21);
  text(`Precipitation: ${nf(latestPrediction.precipitation, 0, 2)} mm`, panelX + 14, panelY + 78);

  textSize(13);
  fill(70);
  text(
    `Temp ${nf(latestPrediction.temperature, 0, 1)} C | Humidity ${nf(latestPrediction.humidity, 0, 1)}% | Wind ${nf(latestPrediction.wind_speed, 0, 1)} m/s`,
    panelX + 14,
    panelY + 103
  );
}

function drawForecastHistory() {
  const x = 18;
  const y = 286;

  fill(22);
  textAlign(LEFT);
  textSize(16);
  text("Forecast History", x, y);

  textSize(12);
  fill(65);
  text("Step", x, y + 22);
  text("Timestamp", x + 60, y + 22);
  text("Precip", x + 280, y + 22);
  text("Temp", x + 350, y + 22);
  text("Humidity", x + 410, y + 22);
  text("Wind", x + 500, y + 22);

  const rows = forecastHistory.slice(-maxHistoryRows);
  rows.forEach((row, idx) => {
    const rowY = y + 42 + idx * 18;
    fill(35);
    text(`+${row.step}h`, x, rowY);
    text(row.date, x + 60, rowY);
    text(nf(row.precipitation, 0, 2), x + 280, rowY);
    text(nf(row.temperature, 0, 1), x + 350, rowY);
    text(nf(row.humidity, 0, 1), x + 410, rowY);
    text(nf(row.wind_speed, 0, 1), x + 500, rowY);
  });
}

function drawMetricChart() {
  if (!forecastHistory.length) {
    return;
  }

  const values = forecastHistory.map((item) => item[selectedMetric]);
  const cfg = metricConfig[selectedMetric];

  const x0 = 620;
  const y0 = 612;
  const graphHeight = 190;
  const barWidth = 24;
  const gap = 8;
  const maxDataValue = max(1, ...values);

  fill(22);
  noStroke();
  textAlign(LEFT);
  textSize(16);
  text(`Chart: ${cfg.label} (${cfg.unit})`, x0, 388);

  values.slice(-10).forEach((value, idx) => {
    const barHeight = map(value, 0, maxDataValue, 0, graphHeight);
    const x = x0 + idx * (barWidth + gap);
    const y = y0 - barHeight;
    const fade = constrain(value / maxDataValue, 0.2, 1);

    fill(cfg.color[0] * fade, cfg.color[1] * fade, cfg.color[2] * fade);
    stroke(85);
    rect(x, y, barWidth, barHeight);

    noStroke();
    fill(35);
    textAlign(CENTER);
    textSize(11);
    text(`${idx + 1}`, x + barWidth / 2, y0 + 15);
  });
}

async function fetchOpenMeteoHistory() {
  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() - 1);

  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - historyDays);

  const params = new URLSearchParams({
    latitude: locationConfig.lat,
    longitude: locationConfig.lon,
    start_date: toDateStringUTC(startDate),
    end_date: toDateStringUTC(endDate),
    hourly: "temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m",
    timezone: "UTC",
  });

  const url = `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed: ${response.status}`);
  }

  const payload = await response.json();
  const h = payload.hourly;
  if (!h || !h.time || !h.time.length) {
    throw new Error("Open-Meteo response did not contain hourly data.");
  }

  const rows = [];
  for (let i = 0; i < h.time.length; i++) {
    const row = {
      date: h.time[i],
      temperature: h.temperature_2m[i],
      humidity: h.relative_humidity_2m[i],
      wind_speed: h.wind_speed_10m[i],
      pressure: h.surface_pressure[i],
      precipitation: h.precipitation[i],
    };

    if (Object.values(row).some((v) => v === null || Number.isNaN(v))) {
      continue;
    }

    rows.push(addTimeFeatures(row));
  }

  return rows;
}

function addTimeFeatures(row) {
  const dateObj = new Date(row.date);
  const hour = dateObj.getUTCHours();
  const dayOfWeek = dateObj.getUTCDay();

  const hourAngle = (2 * Math.PI * hour) / 24;
  const dayAngle = (2 * Math.PI * dayOfWeek) / 7;

  return {
    ...row,
    hour_sin: Math.sin(hourAngle),
    hour_cos: Math.cos(hourAngle),
    day_sin: Math.sin(dayAngle),
    day_cos: Math.cos(dayAngle),
  };
}

function buildOneStepWindows(rows, seqLen) {
  const windows = [];
  for (let i = 0; i <= rows.length - seqLen - 1; i++) {
    const inputRows = rows.slice(i, i + seqLen);
    windows.push({
      inputs: buildInputSequence(inputRows),
      outputs: buildOutputRow(rows[i + seqLen]),
    });
  }
  return windows;
}

function buildInputSequence(rows) {
  return rows.map((row) => ({
    temperature: row.temperature,
    humidity: row.humidity,
    wind_speed: row.wind_speed,
    pressure: row.pressure,
    precipitation: row.precipitation,
    hour_sin: row.hour_sin,
    hour_cos: row.hour_cos,
    day_sin: row.day_sin,
    day_cos: row.day_cos,
  }));
}

function buildOutputRow(row) {
  return {
    temperature: row.temperature,
    humidity: row.humidity,
    wind_speed: row.wind_speed,
    precipitation: row.precipitation,
  };
}

function computeNextHourTimestamp(lastTimestamp) {
  const dt = new Date(lastTimestamp);
  dt.setUTCHours(dt.getUTCHours() + 1);
  return dt.toISOString().slice(0, 19) + "Z";
}

function toDateStringUTC(dateObj) {
  const year = dateObj.getUTCFullYear();
  const month = `${dateObj.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${dateObj.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
