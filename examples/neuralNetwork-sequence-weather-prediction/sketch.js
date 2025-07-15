/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates loading JSON data and training a Weather Predictor
 * through ml5.neuralNetwork with the sequeceRegression task.
 * XXX: let us know what this dataset is from/about
 */

let model;
let data;
let features = [
  "temperature",
  "humidity",
  "wind_speed",
  "pressure",
  "precipitation",
];

let state = "training";
let predictedRain = 0;
let maxBars = 12;
let graphValues = [];

function preload() {
  data = loadJSON("weather_data.json");

  let options = {
    task: "sequenceRegression",
    debug: true,
    learningRate: 0.0075, // smaller learning rate helps here
    inputs: features,
    outputs: features,
  };
  model = ml5.neuralNetwork(options);
}

function setup() {
  let canvas = createCanvas(640, 400);
  canvas.parent("container");

  // the JSON file has the actual data in a "data" property
  data = data.data;

  // XXX: the following is quite unclear
  // XXX: - try naming the function with an action word (verb)
  // XXX: - explain why we do this
  // XXX: - the second and the third parameter need to be the same - just pass one then?
  // XXX: - the last parameter is 10, but the result has 14 entries 🤷‍♂️ (data has 24)
  // XXX: - we use the result for inputs and outputs, how about naming those
  // XXX:   properties with those words directly (rather than "sequences", "targets")

  // run a sliding window algorithm for time based data
  let batchData = model.slidingWindow(data, features, features, 10);
  let inputs = batchData.sequences;
  let outputs = batchData.targets;

  // add the training data
  for (let i = 0; i < inputs.length; i++) {
    model.addData(inputs[i], outputs[i]);
  }
  model.normalizeData();

  // train right away
  let options = {
    epochs: 70,
  };
  model.train(options, finishedTraining);

  let predictBtn = select("#predictBtn");
  predictBtn.center();
  predictBtn.mouseClicked(predictData);
}

function draw() {
  background(220);
  noStroke();
  textSize(20);
  textAlign(CENTER);

  if (state == "training") {
    text("Training...", width / 2, 160);
  } else if (state == "prediction") {
    // XXX: let's add the unit here (mm? inches?)
    text("Predicted rain: " + nf(predictedRain, 0, 1) + "", 320, 160);
    push();
    textSize(predictedRain * 5 + 10);
    text("🌧️", width / 2, 100);
    pop();
  }
  drawBarGraph();
}

function finishedTraining() {
  state = "prediction";
}

function predictData() {
  // XXX: the following is similarly unclear
  // XXX: - try naming the function with an action word (verb)
  // XXX: - explain why we do this
  // XXX: - (does this do more than return the last 10 samples from data?)

  // Helper function paired with the slidingWindow to get sample from data
  let inputs = model.sampleWindow(data);
  model.predict(inputs, gotResults);
}

function gotResults(results) {
  predictedRain = results[4].value;

  // add result to the bar graph
  graphValues.push(results[4].value);
  if (graphValues.length > maxBars) {
    graphValues.shift();
  }

  // optional: add predicted result to the dataset, so that it will be
  // considered in further predictions (going forward in time)
  addNewData(results);
}

function addNewData(newValues) {
  data.push({
    date: "One more (synthetic) hour",
    temperature: newValues[0].value,
    humidity: newValues[1].value,
    wind_speed: newValues[2].value,
    pressure: newValues[3].value,
    precipitation: newValues[4].value,
  });
}

function drawBarGraph() {
  let barWidth = width / maxBars;
  let maxDataValue = 35;

  for (let i = 0; i < graphValues.length && i < maxBars; i++) {
    let barHeight = map(graphValues[i], 0, maxDataValue, 0, height - 180);
    let x = i * barWidth;
    let y = height - barHeight - 20;

    // XXX: the colors are a bit unintuitive (blue is normally associated
    // with more rain rather than less) - maybe you could do some research
    // and use lerpColor() here?

    let barColor = map(graphValues[i], 0, maxDataValue, 0, 255);
    push();
    fill(barColor, 100, 255 - barColor);
    stroke(100);
    rect(x + 5, y, barWidth - 10, barHeight);
    pop();
  }
}
