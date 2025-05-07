/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates Training a Stock Price Predictor through ml5.TimeSeries.
 */

let model;
let data;
let data_index;

let seq = [];
let targetLength = 5;

// load JSON data with same formatting from the internet, this means
// loadData() cannot yet be used as it is formatted differently
function preload() {
  json_data = loadJSON("weather_data.json");

  // set the options to initialize timeSeries Neural Network
  let options = {
    task: "regression",
    dataMode: "linear",
    debug: "true",
    learningRate: 0.01,
    output: ["label"],
  };
  model = ml5.timeSeries(options);
}

function setup() {
  data = json_data.data;
  createCanvas(640, 400);
  background(220);

  // iterate through data using simple sliding window algorithm
  data_index = targetLength - 1;
  while (data_index < data.length - 1) {
    // get the values [targetLength] steps before current index, collect and add
    for (let x = targetLength - 1; x >= 0; x--) {
      let curr = data[data_index - x];
      // choose from the raw data what you want to to feed to the model
      let inputs = {
        temperature: curr.temperature,
        humidity: curr.humidity,
        windSpeed: curr.wind_speed,
        pressure: curr.pressure,
        precipitation: curr.precipitation,
      };

      // once collected all data into an array to make it into a sequence
      // the format of the sequence is like this [{},{},...,{}]
      // this is the X value
      seq.push(inputs);
    }

    // the Y value to train is the value that comes after the sequence
    let target = data[data_index + 1];

    // select the outputs you want to get, multiple outputs are possible, we want to predict all values
    let output = {
      temperature: target.temperature,
      humidity: target.humidity,
      windSpeed: target.wind_speed,
      pressure: target.pressure,
      precipitation: target.precipitation,
    };

    // feed data into the model
    model.addData(seq, output);

    // reset the sequence so new values can be added
    seq = [];

    // iterate through the whole dataset moving the sliding window in each iteration
    data_index++;
  }
  // normalize the data after adding everything
  model.normalizeData();

  // put a button to train and predict
  trainAndPredictButtons();
}

// train data
function trainData() {
  model.normalizeData();
  let options = {
    epochs: 100,
  };
  model.train(options, finishedTraining);
}

function finishedTraining() {
  console.log("Training Done!");
}

// predict data
function predictData() {
  // set the seq to empty
  seq = [];

  // choose the most recent sequences
  let latest = data.slice(-targetLength);
  for (let x = 0; x < targetLength; x++) {
    let curr = latest[x];
    // select the same properties for inputs
    let inputs = {
      temperature: curr.temperature,
      humidity: curr.humidity,
      windSpeed: curr.wind_speed,
      pressure: curr.pressure,
      precipitation: curr.precipitation,
    };
    // add them to one array to make them a sequence
    seq.push(inputs);
  }

  // use the sequence to predict
  model.predict(seq, gotResults);
}

// put the new data in the dataset so this will be considered for any new predictions
function gotResults(results) {
  console.log(results);
  addNewData(results); //optional but will be helpful in using new prediction as part of dataset
}

// code for adding new data to the dataset to be used for future prediction
function addNewData(results) {
  (new_values = {
    date: "  for the next hour",
    temperature: parseFloat(results[0].value.toFixed(2)), // get string convert to float and round to 2 decimal points
    humidity: parseFloat(results[1].value.toFixed(2)),
    wind_speed: parseFloat(results[2].value.toFixed(2)),
    pressure: parseFloat(results[3].value.toFixed(2)),
    precipitation: parseFloat(results[4].value.toFixed(2)),
  }),
    data.push(new_values);
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(16);

  // Draw the table headers
  let headers = [
    "Date",
    "Temperature",
    "Humidity",
    "Wind Speed",
    "Pressure",
    "Precipitation",
  ];
  let xOffset = 70;
  let yOffset = 100;
  for (let i = 0; i < headers.length; i++) {
    text(headers[i], xOffset + i * 100, yOffset);
  }

  // Display the last 5 entries from the dataset
  let latest = data.slice(-targetLength);
  for (let i = 0; i < latest.length; i++) {
    let entry = latest[i];
    text(entry.date.slice(5), xOffset, yOffset + (i + 1) * 30);
    text(entry.temperature, xOffset + 100, yOffset + (i + 1) * 30);
    text(entry.humidity, xOffset + 200, yOffset + (i + 1) * 30);
    text(entry.wind_speed, xOffset + 300, yOffset + (i + 1) * 30);
    text(entry.pressure, xOffset + 400, yOffset + (i + 1) * 30);
    text(entry.precipitation, xOffset + 500, yOffset + (i + 1) * 30);
  }
}

// get buttons and assign functions (UI)
function trainAndPredictButtons() {
  train_but = select("#train_but");
  train_but.mouseClicked(trainData);

  pred_but = select("#pred_but");
  pred_but.mouseClicked(predictData);
}
