/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * Sequential next-hour weather forecast:
 * - Static 30-day hourly data for 4 cities (weather_data.json)
 * - Stacked LSTM via the weatherForecast preset in ml5.createSeqLayers
 * - Each click predicts one next hour autoregressively
 * - Save trained model to files; reload later to skip retraining
 */

// ── City config ───────────────────────────────────────────────
const CITIES = {
  new_york:  { name: "New York",  emoji: "🗽", lat: 40.7128,  lon: -74.0060  },
  abu_dhabi: { name: "Abu Dhabi", emoji: "🕌", lat: 24.4539,  lon:  54.3773  },
  shanghai:  { name: "Shanghai",  emoji: "🏙️", lat: 31.2304,  lon: 121.4737  },
  london:    { name: "London",    emoji: "🎡", lat: 51.5074,  lon:  -0.1278  },
};

// ── Model / training ──────────────────────────────────────────
const sequenceLength    = 24;   // hours of context fed as one input window
const trainSplitRatio   = 0.8;
const trainingEpochs    = 30;
const trainingBatchSize = 32;
const maxTrainWindows   = 250;

// ── Features ──────────────────────────────────────────────────
const inputFeatures = [
  "temperature", "humidity", "wind_speed", "pressure", "precipitation",
  "hour_sin",  "hour_cos",   // 1st harmonic: 24 h cycle
  "hour_sin2", "hour_cos2",  // 2nd harmonic: 12 h cycle
  "day_sin",   "day_cos",    // day-of-week cycle
  "doy_sin",   "doy_cos",    // day-of-year seasonal cycle
];

const outputFeatures = ["temperature", "humidity", "wind_speed", "precipitation"];

// ── Chart config ──────────────────────────────────────────────
const metricConfig = {
  precipitation: { label: "Precip",   unit: "mm",  color: [27,  91,  186] },
  temperature:   { label: "Temp",     unit: "°C",  color: [214, 85,  44]  },
  humidity:      { label: "Humidity", unit: "%",   color: [43,  120, 120] },
  wind_speed:    { label: "Wind",     unit: "m/s", color: [90,  90,  90]  },
};
const MAX_CHART_POINTS = 7;

// ── State ─────────────────────────────────────────────────────
let model;
let hourlyData        = [];
let forecastSequence  = [];
let forecastHistory   = [];

let selectedCity      = null;
let selectedMetric    = "precipitation";
let state             = "idle";   // idle | loading | training | predicting | error
let statusMessage     = "";
let latestPrediction  = null;
let forecastStepCounter = 0;
let isPredictingNow   = false;

let trainingEpoch   = 0;
let trainingLoss    = null;
let trainingStartMs = 0;

// ─────────────────────────────────────────────────────────────
// p5 lifecycle
// ─────────────────────────────────────────────────────────────

function setup() {
  const canvas = createCanvas(980, 580);
  canvas.parent("canvasDiv");

  // Predict
  select("#predictBtn").mouseClicked(() => predictNextHour());
  select("#predictBtn").attribute("disabled", "true");

  // Save — downloads 3 files: name.json, name.weights.bin, name_meta.json
  select("#saveBtn").mouseClicked(async () => {
    if (!model || state !== "predicting") return;
    statusMessage = "Saving model files…";
    await model.save(`${selectedCity}_model`);
    statusMessage = `Saved ✓  —  select all 3 downloaded files to reload later`;
  });

  // Load — opens file picker; student selects the 3 saved files
  select("#loadBtn").mouseClicked(() => {
    document.getElementById("loadInput").click();
  });
  document.getElementById("loadInput").addEventListener("change", async (e) => {
    if (!e.target.files.length) return;
    if (!hourlyData.length) {
      statusMessage = "Select a city first, then load a model.";
      return;
    }
    await loadSavedModel(e.target.files);
    e.target.value = "";
  });

  // Retrain
  select("#retrainBtn").mouseClicked(() => {
    if (selectedCity) init(selectedCity);
  });

  // City dropdown (switch after initial city picker)
  document.getElementById("citySelect").addEventListener("change", async (e) => {
    const newCity = e.target.value;
    e.target.value = ""; // reset to placeholder
    if (!newCity || newCity === selectedCity) return;
    state         = "loading";
    statusMessage = `Switching to ${CITIES[newCity].name}…`;
    await init(newCity);
  });

  // Metric toggle buttons
  [
    ["#metricPrecip",   "precipitation"],
    ["#metricTemp",     "temperature"],
    ["#metricHumidity", "humidity"],
    ["#metricWind",     "wind_speed"],
  ].forEach(([id, metric]) => {
    const btn = select(id);
    if (btn) btn.mouseClicked(() => { selectedMetric = metric; });
  });

  // If city was chosen before p5 finished setting up, start now
  if (window._pendingCity) {
    init(window._pendingCity);
    window._pendingCity = null;
  }
}

function draw() {
  background(245);
  if (state === "idle") return;

  drawHeader();
  drawStatus();

  if (state === "loading") {
    drawCenteredMessage("Loading…", 36);
    return;
  }
  if (state === "error") {
    drawCenteredMessage(statusMessage, 18, color(160, 30, 30));
    return;
  }
  if (state === "training") {
    drawTrainingPanel();
    return;
  }

  // predicting
  drawWeatherDisplay();
  drawLineChart();
}

// ─────────────────────────────────────────────────────────────
// Initialisation / city loading
// ─────────────────────────────────────────────────────────────

async function init(cityKey) {
  // Reset shared state
  if (model) { try { model.dispose(); } catch (_) {} }
  model               = null;
  hourlyData          = [];
  forecastSequence    = [];
  forecastHistory     = [];
  latestPrediction    = null;
  forecastStepCounter = 0;
  trainingEpoch       = 0;
  trainingLoss        = null;

  selectedCity  = cityKey;
  state         = "loading";
  statusMessage = "Loading weather data…";

  select("#predictBtn").attribute("disabled", "true");
  select("#saveBtn").style("display", "none");
  select("#retrainBtn").style("display", "none");

  try {
    // Backend
    try {
      await ml5.tf.setBackend("webgl");
    } catch (_) {
      await ml5.tf.setBackend("cpu");
    }
    await ml5.tf.ready();

    // Data
    statusMessage = `Loading ${CITIES[cityKey].name} data…`;
    hourlyData = await loadCityData(cityKey);
    if (hourlyData.length < sequenceLength + 10) {
      throw new Error("Not enough rows in weather_data.json for this city.");
    }

    // Sliding windows
    const windows    = buildOneStepWindows(hourlyData, sequenceLength);
    const splitIndex = Math.floor(windows.length * trainSplitRatio);
    let trainWindows = windows.slice(0, splitIndex);
    if (trainWindows.length > maxTrainWindows) {
      trainWindows = trainWindows.slice(-maxTrainWindows);
    }

    // Build model
    statusMessage = "Building model…";
    model = buildModel();
    await model.ready;

    trainWindows.forEach(s => model.addData(s.inputs, s.outputs));
    model.normalizeData();

    // Train
    state           = "training";
    trainingStartMs = performance.now();
    statusMessage   = `Training on ${trainWindows.length} windows…`;

    await model.train(
      { epochs: trainingEpochs, batchSize: trainingBatchSize, validationSplit: 0.1 },
      whileTraining,
      () => {}
    );

    onModelReady("Ready — click Predict Next Hour");

  } catch (err) {
    console.error(err);
    state         = "error";
    statusMessage = `Error: ${err.message}`;
  }
}

async function loadSavedModel(fileList) {
  // Build a shell model so load() has a target
  if (!model) {
    model = buildModel();
    await model.ready;
  }

  state         = "loading";
  statusMessage = "Loading saved model…";

  try {
    await model.load(fileList);

    onModelReady("Model loaded — click Predict Next Hour");

  } catch (err) {
    console.error(err);
    state         = "error";
    statusMessage = `Load failed: ${err.message}`;
  }
}

function onModelReady(message) {
  state               = "predicting";
  statusMessage       = message;
  forecastSequence    = hourlyData.slice(-sequenceLength).map(r => ({ ...r }));
  forecastHistory     = [];
  latestPrediction    = null;
  forecastStepCounter = 0;
  select("#predictBtn").removeAttribute("disabled");
  select("#saveBtn").style("display", "inline-block");
  select("#retrainBtn").style("display", "inline-block");
}

// ─────────────────────────────────────────────────────────────
// Model
// ─────────────────────────────────────────────────────────────

function buildModel() {
  // Use the weatherForecast preset from ml5.createSeqLayers:
  //   LSTM(48, tanh, returnSeq=true) → LSTM(24, tanh) → Dense(32, relu) → Dense(4, linear)
  const seriesShape = [sequenceLength, inputFeatures.length]; // [24, 13]
  const layers = ml5.createSeqLayers(seriesShape, 16, outputFeatures.length).weatherForecast;

  return ml5.neuralNetwork({
    task: "sequenceRegression",
    debug: false,
    learningRate: 0.002,
    inputs: inputFeatures,
    outputs: outputFeatures,
    layers,
  });
}

function whileTraining(epoch, logs) {
  trainingEpoch = epoch + 1;
  trainingLoss  = (logs && typeof logs.loss === "number") ? logs.loss : null;
  const lossLabel = trainingLoss === null ? "n/a" : trainingLoss.toFixed(5);
  statusMessage = `Epoch ${trainingEpoch} / ${trainingEpochs} — loss: ${lossLabel}`;
}

// ─────────────────────────────────────────────────────────────
// Prediction
// ─────────────────────────────────────────────────────────────

async function predictNextHour() {
  if (!model || state !== "predicting" || isPredictingNow) return;

  isPredictingNow = true;
  select("#predictBtn").attribute("disabled", "true");

  try {
    statusMessage = "Predicting…";

    const modelInput = buildInputSequence(forecastSequence);
    const results    = await model.predict(modelInput);
    const nextValues = buildOutputObject(results);

    const lastRow  = forecastSequence[forecastSequence.length - 1];
    const nextDate = computeNextHourTimestamp(lastRow.date);

    const syntheticRow = addTimeFeatures({
      date:          nextDate,
      temperature:   nextValues.temperature,
      humidity:      nextValues.humidity,
      wind_speed:    nextValues.wind_speed,
      precipitation: nextValues.precipitation,
      pressure:      lastRow.pressure, // persistence baseline
    });

    forecastSequence.push(syntheticRow);
    if (forecastSequence.length > sequenceLength) forecastSequence.shift();

    forecastStepCounter++;
    latestPrediction = { step: forecastStepCounter, ...syntheticRow };

    forecastHistory.push(latestPrediction);
    if (forecastHistory.length > MAX_CHART_POINTS) {
      forecastHistory = forecastHistory.slice(-MAX_CHART_POINTS);
    }

    statusMessage = `+${forecastStepCounter}h  ·  ${formatDateTime(syntheticRow.date)}`;

  } catch (err) {
    console.error(err);
    statusMessage = `Prediction failed: ${err.message}`;
  } finally {
    isPredictingNow = false;
    select("#predictBtn").removeAttribute("disabled");
  }
}

// ─────────────────────────────────────────────────────────────
// Data helpers
// ─────────────────────────────────────────────────────────────

async function loadCityData(cityKey) {
  const response = await fetch("weather_data.json");
  if (!response.ok) throw new Error(`Could not load weather_data.json: ${response.status}`);
  const allData = await response.json();
  if (!allData[cityKey]) throw new Error(`No data for city "${cityKey}" in weather_data.json`);

  const rows = [];
  for (const row of allData[cityKey]) {
    if (Object.values(row).some(v => v === null || (typeof v === "number" && isNaN(v)))) continue;
    rows.push(addTimeFeatures(row));
  }
  return rows;
}

function addTimeFeatures(row) {
  const dateObj   = new Date(row.date);
  const hour      = dateObj.getUTCHours();
  const dayOfWeek = dateObj.getUTCDay();

  // Time-of-day: 1st harmonic (24 h period) + 2nd harmonic (12 h period).
  // Two harmonics let the model reconstruct a sharper daily temperature curve —
  // cooler before dawn, peak in early afternoon, drop at sunset — rather than
  // a single smooth sine wave that produces only ~2 °C of diurnal swing.
  const h1 = (2 * Math.PI * hour) / 24;       // fundamental  (24 h)
  const h2 = (2 * Math.PI * 2 * hour) / 24;   // 2nd harmonic (12 h)

  // Day-of-week cycle (7 days)
  const dayAngle = (2 * Math.PI * dayOfWeek) / 7;

  // Day-of-year seasonal cycle (365 days)
  const startOfYear = new Date(Date.UTC(dateObj.getUTCFullYear(), 0, 1));
  const dayOfYear   = Math.floor((dateObj - startOfYear) / 86400000) + 1;
  const doyAngle    = (2 * Math.PI * dayOfYear) / 365;

  return {
    ...row,
    hour_sin:  Math.sin(h1),
    hour_cos:  Math.cos(h1),
    hour_sin2: Math.sin(h2),
    hour_cos2: Math.cos(h2),
    day_sin:   Math.sin(dayAngle),
    day_cos:   Math.cos(dayAngle),
    doy_sin:   Math.sin(doyAngle),
    doy_cos:   Math.cos(doyAngle),
  };
}

function buildOneStepWindows(rows, seqLen) {
  const windows = [];
  for (let i = 0; i <= rows.length - seqLen - 1; i++) {
    const inputRows = rows.slice(i, i + seqLen);
    windows.push({
      inputs:  buildInputSequence(inputRows),
      outputs: buildOutputRow(rows[i + seqLen]),
    });
  }
  return windows;
}

function buildInputSequence(rows) {
  return rows.map(row => Object.fromEntries(inputFeatures.map(f => [f, row[f]])));
}

function buildOutputRow(row) {
  return Object.fromEntries(outputFeatures.map(f => [f, row[f]]));
}

function buildOutputObject(results) {
  const getVal = label => {
    const item = results.find(e => e.label === label);
    return item ? item.value : 0;
  };
  return {
    temperature:   getVal("temperature"),
    humidity:      constrain(getVal("humidity"), 0, 100),
    wind_speed:    max(0, getVal("wind_speed")),
    precipitation: max(0, getVal("precipitation")),
  };
}

function computeNextHourTimestamp(lastTimestamp) {
  const dt = new Date(lastTimestamp);
  dt.setUTCHours(dt.getUTCHours() + 1);
  return dt.toISOString().slice(0, 19) + "Z";
}

function formatDateTime(isoString) {
  const d      = new Date(isoString);
  const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const h      = d.getUTCHours();
  const h12    = h % 12 || 12;
  const ampm   = h >= 12 ? "PM" : "AM";
  return `${DAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}  ·  ${h12} ${ampm} UTC`;
}

// ─────────────────────────────────────────────────────────────
// Weather emoji
// ─────────────────────────────────────────────────────────────

function getWeatherEmoji(prediction) {
  const { temperature, precipitation } = prediction;
  if (temperature < 2  && precipitation > 0.5) return { emoji: "❄️",  label: "Snow"       };
  if (precipitation > 2.0)                      return { emoji: "🌧️",  label: "Heavy Rain" };
  if (precipitation > 0.2)                      return { emoji: "🌦️",  label: "Light Rain" };
  if (temperature > 25 && precipitation < 0.1)  return { emoji: "☀️",  label: "Sunny"      };
  if (precipitation < 0.1)                      return { emoji: "🌤️",  label: "Clear"      };
  return                                                { emoji: "🌥️",  label: "Cloudy"     };
}

// ─────────────────────────────────────────────────────────────
// Drawing
// ─────────────────────────────────────────────────────────────

function drawHeader() {
  noStroke();
  fill(22);
  textAlign(LEFT);
  textSize(20);
  const city = CITIES[selectedCity];
  text(`${city.emoji}  ${city.name} — Next-Hour Weather Forecast`, 18, 34);
}

function drawStatus() {
  noStroke();
  fill(90);
  textAlign(LEFT);
  textSize(12);
  text(statusMessage, 18, 54);
}

function drawCenteredMessage(msg, sz = 32, col = color(40)) {
  noStroke();
  fill(col);
  textAlign(CENTER, CENTER);
  textSize(sz);
  text(msg, width / 2, height / 2);
}

function drawTrainingPanel() {
  noStroke();
  textAlign(CENTER);

  fill(22);
  textSize(26);
  text("Training model…", width / 2, 160);

  const lossLabel = typeof trainingLoss === "number" ? trainingLoss.toFixed(5) : "—";
  fill(70);
  textSize(14);
  text(`Epoch ${trainingEpoch} / ${trainingEpochs}   ·   loss: ${lossLabel}`, width / 2, 190);

  // Progress bar
  const progress = constrain(trainingEpoch / trainingEpochs, 0, 1);
  const bw = 500, bh = 12;
  const bx = width / 2 - bw / 2;
  const by = 212;
  noStroke(); fill(210); rect(bx, by, bw, bh, 6);
  fill(37, 112, 214);    rect(bx, by, bw * progress, bh, 6);
}

function drawWeatherDisplay() {
  if (!latestPrediction) {
    noStroke(); fill(130); textAlign(CENTER); textSize(14);
    text("Click  Predict Next Hour  to start", width / 2, 130);
    return;
  }

  const wx = getWeatherEmoji(latestPrediction);

  // Large emoji
  noStroke(); textAlign(CENTER);
  textSize(54);
  text(wx.emoji, width / 2, 108);

  // Condition label
  fill(50); textSize(14);
  text(wx.label, width / 2, 128);

  // Formatted date + time
  fill(140); textSize(11);
  text(formatDateTime(latestPrediction.date), width / 2, 146);

  // Four metric values in a row
  const metrics = [
    { label: "Temp",     value: `${nf(latestPrediction.temperature,   0, 1)} °C`  },
    { label: "Humidity", value: `${nf(latestPrediction.humidity,       0, 1)} %`   },
    { label: "Wind",     value: `${nf(latestPrediction.wind_speed,     0, 1)} m/s` },
    { label: "Precip",   value: `${nf(latestPrediction.precipitation,  0, 2)} mm`  },
  ];
  const colW = width / 4;
  metrics.forEach(({ label, value }, i) => {
    const cx = colW * i + colW / 2;
    fill(130); textSize(11); text(label, cx, 168);
    fill(22);  textSize(16); text(value,  cx, 186);
  });
}

function drawLineChart() {
  if (forecastHistory.length < 2) return;

  const cfg    = metricConfig[selectedMetric];
  const values = forecastHistory.map(p => p[selectedMetric]);
  const [r, g, b] = cfg.color;

  // Chart bounds
  const cx0    = 70;
  const cy0    = 555;
  const chartW = width - 130;
  const chartH = 320;
  const topY   = cy0 - chartH;

  // Y range with padding
  let minV = min(...values);
  let maxV = max(...values);
  if (maxV - minV < 0.001) { minV -= 1; maxV += 1; }
  const pad = (maxV - minV) * 0.18;
  minV -= pad; maxV += pad;

  // Axes
  stroke(195); strokeWeight(1);
  line(cx0, cy0,   cx0,          topY);           // Y axis
  line(cx0, cy0,   cx0 + chartW, cy0);            // X axis

  // Grid lines + Y labels (4 levels)
  for (let i = 0; i <= 3; i++) {
    const v  = minV + (maxV - minV) * (i / 3);
    const py = map(v, minV, maxV, cy0, topY);
    stroke(225); strokeWeight(0.5);
    line(cx0, py, cx0 + chartW, py);
    noStroke(); fill(120); textAlign(RIGHT); textSize(10);
    text(nf(v, 0, 1), cx0 - 6, py + 4);
  }

  // Step labels on X axis
  const n    = values.length;
  const step = chartW / (MAX_CHART_POINTS - 1);

  // Connecting line
  stroke(r, g, b, 210); strokeWeight(2.5); noFill();
  beginShape();
  values.forEach((v, i) => vertex(cx0 + i * step, map(v, minV, maxV, cy0, topY)));
  endShape();

  // Dots + value labels
  values.forEach((v, i) => {
    const px = cx0 + i * step;
    const py = map(v, minV, maxV, cy0, topY);

    fill(r, g, b); noStroke(); circle(px, py, 8);

    // value above dot
    fill(22); noStroke(); textAlign(CENTER); textSize(10);
    text(nf(v, 0, 1), px, py - 11);

    // step label below x axis
    fill(110); textSize(10);
    text(`+${forecastHistory[i].step}h`, px, cy0 + 14);
  });

  // Chart title
  noStroke(); fill(22); textAlign(LEFT); textSize(13);
  text(`${cfg.label} (${cfg.unit}) — last ${n} prediction${n === 1 ? "" : "s"}`, cx0, topY - 10);
}
