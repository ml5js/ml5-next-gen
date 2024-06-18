/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates sentiment analysis with ml5.sentiment.
 */

let sentiment;
let submitBtn;
let inputBox;
let sentimentResult;

function preload() {
  sentiment = ml5.sentiment("MovieReviews");
}

function setup() {
  noCanvas();
  // initialize sentiment analysis model

  // setup the html dom elements
  inputBox = createInput("Today is the happiest day and is full of rainbows!");
  inputBox.attribute("size", "75");
  submitBtn = createButton("submit");
  sentimentResult = createP("Sentiment confidence:");

  // predicting the sentiment when submit button is pressed
  submitBtn.mousePressed(getSentiment);
}

function getSentiment() {
  // get the values from the input
  let text = inputBox.value();

  // make the prediction
  sentiment.predict(text, gotResult);
}

function gotResult(prediction) {
  // display sentiment result on html page
  sentimentResult.html("Sentiment confidence: " + prediction.confidence);
}

// predicting the sentiment when 'Enter' key is pressed
function keyPressed() {
  if (keyCode == ENTER) {
    getSentiment();
  }
}
