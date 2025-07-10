/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates Loading JSON data and Training a Weather Predictor through ml5.neuralNetwork with sequeceRegression Task.
 */

let model;
let data;
let graphValues = [];

let state = "training";
let precipitation = "";

let features = [
  "temperature",
  "humidity",
  "wind_speed",
  "pressure",
  "precipitation",
];

let targets = features; // Must be the same to add predicted values back to data
let windowLength = 10; // Optional: define the size of the window for batch

// Load JSON data with same formatting from the internet, this means
// LoadData() cannot yet be used as it is formatted differently
function preload() {
  json_data = loadJSON("weather_data.json");

  // Set the options to initialize Neural Network wit sequenceRegression Task
  let options = {
    task: "sequenceRegression",
    debug: "true",
    learningRate: 0.0075, // A smaller learning rate used for more stable training
    inputs: features,
    outputs: targets,
  };
  model = ml5.neuralNetwork(options);
}

function setup() {
  data = json_data.data;
  createCanvas(640, 400);
  background(220);

  // Run a sliding window algorithm for time based data
  let batchData = model.slidingWindow(data, features, targets, windowLength);
  let inputs = batchData.sequences;
  let outputs = batchData.targets;

  // Feed data into the model
  for (let i = 0; i < inputs.length; i++) {
    model.addData(inputs[i], outputs[i]);
  }
  // Normalize the data after adding everything
  model.normalizeData();

  let options = {
    epochs: 70,
  };
  model.train(options, finishedTraining);

  UI();
}

function draw() {
  background(220);
  textSize(20);
  if (state == "training") {
    text("Training", 320, 200);
  } else if (state == "prediction") {
    text("Predicted Precipitation", 320, 200);
    text(precipitation, 320, 250);

    // Helpful visual based on predicted value
    push();
    textSize(precipitation * 5 + 10);
    text("🌧️", 320, 150);
    pop();
  }
  drawBarGraph();
}

// Predict data
function predictData() {
  seq = model.sampleWindow(data); //Helper function paired with the slidingWindow to get sample from data
  model.predict(seq, gotResults);
}

// Put the new data in the dataset so this will be considered for any new predictions
function gotResults(results) {
  precipitation = results[4].value;
  addNewData(results); // Optional but will be helpful in using new prediction as part of dataset
}

// Code for adding new data to the dataset to be used for future prediction
function addNewData(newResults) {
  (new_values = {
    date: " for the next hour",
    temperature: newResults[0].value, // Get string convert to float and round to 2 decimal points
    humidity: newResults[1].value,
    wind_speed: newResults[2].value,
    pressure: newResults[3].value,
    precipitation: newResults[4].value,
  }),
    data.push(new_values);

  // Add data to the bar graph
  graphValues.push(newResults[4].value);
  if (graphValues.length > maxBars) {
    graphValues.shift(); // Remove first element
  }
}

function finishedTraining() {
  state = "prediction";
}

// Get buttons and assign functions (UI)
function UI() {
  pred_but = select("#pred_but");
  pred_but.mouseClicked(predictData);

  textAlign(CENTER);

  maxBars = 12;
  barWidth = width / maxBars;
  maxDataValue = 35;
}

function drawBarGraph() {
  for (let i = 0; i < graphValues.length && i < maxBars; i++) {
    let barHeight = map(graphValues[i], 0, maxDataValue, 0, height - 180);
    let x = i * barWidth;
    let y = height - barHeight - 20;

    // Bar color gradient based on value
    let barColor = map(graphValues[i], 0, maxDataValue, 0, 255);
    fill(barColor, 100, 255 - barColor);
    stroke(100);

    // Draw bar
    rect(x + 5, y, barWidth - 10, barHeight);
  }
}
