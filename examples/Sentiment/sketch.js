// Copyright (c) 2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let sentiment;
let statusEl; // to display model loading status
let submitBtn;
let inputBox;
let sentimentResult;

function setup() {
  noCanvas();
  // initialize sentiment analysis model
  sentiment = ml5.sentiment("movieReviews", modelReady);

  // setup the html dom elements
  statusEl = createP("Loading Model...");
  inputBox = createInput("Today is the happiest day and is full of rainbows!");
  inputBox.attribute("size", "75");
  submitBtn = createButton("submit");
  sentimentResult = createP("Sentiment score:");

  // predicting the sentiment when submit button is pressed
  submitBtn.mousePressed(getSentiment);
}

function getSentiment() {
  // get the values from the input
  let text = inputBox.value();

  // make the prediction
  let prediction = sentiment.predict(text);

  // display sentiment result on html page
  sentimentResult.html("Sentiment score: " + prediction.score);
}

// a callback function that is called when model is ready
function modelReady() {
  statusEl.html("Model loaded");
}

// predicting the sentiment when 'Enter' key is pressed
function keyPressed() {
  if (keyCode == ENTER) {
    getSentiment();
  }
}
