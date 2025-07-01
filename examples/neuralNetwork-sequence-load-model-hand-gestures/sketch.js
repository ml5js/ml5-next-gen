/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates loading a Hand Gesture classifier through ml5.neuralNetwork with sequeceClassification Task.
 * This example is trained with the ASL gestures for Hello and Goodbye
 *
 * Reference to sign hello and goodbye in ASL:
 * Hello: https://babysignlanguage.com/dictionary/hello/
 * Goodbye: https://babysignlanguage.com/dictionary/goodbye/
 */

let handPose;
let video;
let hands = [];

let sequence = [];
let targetLength = 50;

let predictedWord = "";

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();

  // Setup the timeseries neural network
  let options = {
    task: "sequenceClassification",
    architecture: "CNN",
  };

  model = ml5.neuralNetwork(options);
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("canvasDiv");

  // Create video capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);

  // Setup the model files to load
  let modelDetails = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };

  // Load the model and call modelLoaded once finished
  model.load(modelDetails, modelLoaded);
}

// Callback for load model
function modelLoaded() {
  console.log("model loaded!");
}

function draw() {
  // Draw video on the canvas
  image(video, 0, 0, width, height);

  // Put the text on screen after a prediction
  placePredictedText();

  // If hands are found then start recording
  if (hands.length > 0) {
    // Get coordinates from hands (21 points)
    handpoints = drawPoints();
    sequence.push(handpoints);

    // Pad the data and use for prediction
  } else if (hands.length <= 0 && sequence.length > 0) {
    let predictData = model.padCoordinates(sequence, targetLength);
    model.classify(predictData, gotResults);

    // Reset the sequence
    sequence = [];
  }
}

// Draw the points on the hands
function drawPoints() {
  let handpoints = [];
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
      handpoints.push(keypoint.x, keypoint.y);
    }
  }
  let output = handpoints;
  handpoints = [];

  return output;
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

// Call back for accessing the results
function gotResults(results) {
  predictedWord = results[0].label;
  text(predictedWord, 100, 100);
}

// For drawing text on screen
function placePredictedText() {
  textSize(20);
  fill(0);
  text("Predicted Gesture : " + predictedWord, 50, 50);
}
