let sentiment;
let statusEl; // to display model loading status
let submitBtn;
let inputBox;
let sentimentResult;

function setup() {
  noCanvas();
  // initialize sentiment analysis model
  sentiment = ml5.sentiment("movieReviews", modelReady);

  // setup the html environment
  statusEl = createP("Loading Model...");
  inputBox = createInput("Today is the happiest day and is full of rainbows!");
  inputBox.attribute("size", "75");
  submitBtn = createButton("submit");
  sentimentResult = createP("Sentiment score:");

  // predicting the sentiment on mousePressed()
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

function modelReady() {
  // model is ready
  statusEl.html("Model loaded");
}

// predicting the sentiment when 'Enter' key is pressed
function keyPressed() {
  if (keyCode == ENTER) {
    getSentiment();
  }
}
