/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates Loading JSON data and Training a Weather Predictor through ml5.TimeSeries.
 */

let model;
let data;

let state = "training";
let precipitation = "";

let features = [
  "temperature",
  "humidity",
  "wind_speed",
  "pressure",
  "precipitation",
];

let targets = features; // must be the same to add predicted to data

// load JSON data with same formatting from the internet, this means
// loadData() cannot yet be used as it is formatted differently
function preload() {
  json_data = loadJSON("weather_data.json");

  // set the options to initialize timeSeries Neural Network
  let options = {
    task: "regression",
    dataMode: "linear",
    debug: "true",
    inputs: features,
    outputs: targets,
  };
  model = ml5.timeSeries(options);
}

function setup() {
  data = json_data.data;
  createCanvas(640, 400);
  background(220);

  //run a sliding window algorithm for time based data
  let batchData = model.slidingWindow(data, features, targets);
  let inputs = batchData.sequences;
  let outputs = batchData.targets;

  // feed data into the model
  for (let i = 0; i < inputs.length; i++) {
    model.addData(inputs[i], outputs[i]);
  }
  // normalize the data after adding everything
  model.normalizeData();

  let options = {
    epochs: 100,
  };
  model.train(options, finishedTraining);

  UI();
}

function draw() {
  background(220);
  textSize(20);
  if (state == "training") text("Training", 200, 200);
  else if (state == "prediction") {
    text("Predicted Precipitation", 200, 200);
    text(precipitation, 200, 250);
  }
}

// predict data
function predictData() {
  seq = model.sampleWindow(data); //helper function to get sample from data
  model.predict(seq, gotResults);
}

// put the new data in the dataset so this will be considered for any new predictions
function gotResults(results) {
  precipitation = results[4].value;
  addNewData(results); //optional but will be helpful in using new prediction as part of dataset
}

// code for adding new data to the dataset to be used for future prediction
function addNewData(results) {
  (new_values = {
    date: "  for the next hour",
    temperature: results[0].value, // get string convert to float and round to 2 decimal points
    humidity: results[1].value,
    wind_speed: results[2].value,
    pressure: results[3].value,
    precipitation: results[4].value,
  }),
    data.push(new_values);
}

function finishedTraining() {
  console.log("Training Done!");
  state = "prediction";
}

// get buttons and assign functions (UI)
function UI() {
  pred_but = select("#pred_but");
  pred_but.mouseClicked(predictData);
}
