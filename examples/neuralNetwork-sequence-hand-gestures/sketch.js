/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates training a Hand Gesture classifier through ml5.neuralNetwork with sequeceClassification Task.
 */

let video;
let handPose;
let hands = [];

let sequence = [];
let targetLength = 30;

let gestures = ["Gesture #1", "Gesture #2"];
let counts = { "Gesture #1": 0, "Gesture #2": 0 };

let state = "collection";
let currGesture = gestures[0]; //set currGesture to gesture 1 by default

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();

  // setup the timeseries neural network
  let options = {
    outputs: ["label"],
    task: "sequenceClassificationConv",
    debug: "true",
    learningRate: 0.001, // the default learning rate of 0.01 didn't converge for this usecase, thus a learning rate of 0.001 is used (make smaller steps of parameters each update)
  };
  model = ml5.neuralNetwork(options);
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("canvasDiv");

  // setup video capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Setup the UI buttons for training
  UI();

  // use handpose model on video
  handPose.detectStart(video, gotHands);
}

function draw() {
  // draw video on frame
  image(video, 0, 0, width, height);

  // helpful tooltip to include
  textSize(20);
  stroke(255);
  fill(0);
  text(state + " : " + currGesture, 50, 50);

  // if hand is detected in the frame, start recording gesture
  if (hands.length > 0) {
    handpoints = drawPoints();
    sequence.push(handpoints);

    // add collected data to model once the hand is gone and state is collection
  } else if (hands.length <= 0 && sequence.length > 0) {
    if (state == "collection") {
      // pad the length of the coordinates to targetLength
      let inputData = model.padCoordinates(sequence, targetLength);
      let outputData = { label: currGesture };

      // add data to the model
      model.addData(inputData, outputData);

      // Update the counts for the UI
      counts[currGesture]++;
      updateDataCountUI();

      // pad the data and use for prediction if state is prediction
    } else if (state == "prediction") {
      let predictData = model.padCoordinates(sequence, targetLength);
      model.classify(predictData, gotResults);
    }

    // reset the sequence
    sequence = [];
  }
}

// Train the data when 'Train abd Save Model' button is pressed
function train() {
  // The data should be normalized before training
  model.normalizeData();

  currGesture = "";

  // Train the model
  let trainingOptions = {
    epochs: 50,
  };
  model.train(trainingOptions, finishedTraining);
}

// When the model is trained, save the model
function finishedTraining() {
  state = "prediction";
  model.save();
}

// callback for predict
function gotResults(results) {
  currGesture = results[0].label;
}

// Callback function for when handPose outputs data
function gotHands(results) {
  hands = results;
}

// draw visuals for hand points and flatten values into an array
function drawPoints() {
  let handpoints = [];
  // iterate through both hands
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      // access the keypoints in the hand
      let keypoint = hand.keypoints[j];
      handpoints.push(keypoint.x, keypoint.y);

      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
    }
  }

  // assign to a different variable before clearing
  let output = handpoints;
  handpoints = [];

  return output;
}

////////////// UI Elements ////////////
function UI() {
  dataCountsP = createP(
    "Gesture 1 data: " +
      counts[gestures[0]] +
      "<br>Gesture 2 data: " +
      counts[gestures[0]]
  );
  rockButton = createButton("Add Gesture #1 Data");
  rockButton.mousePressed(addGesture1);
  paperButton = createButton("Add Gesture #2 Data");
  paperButton.mousePressed(addGesture2);
  trainButton = createButton("Train and Save Model");
  trainButton.mousePressed(train);
}

// Set the current handPose data to the model as "Gesture #1"
function addGesture1() {
  currGesture = gestures[0];
}

// Set the current handPose data to the model as "Gesture #2"
function addGesture2() {
  currGesture = gestures[1];
}

// Update the HTML UI with the current data counts
function updateDataCountUI() {
  dataCountsP.html(
    "Gesture 1 data: " +
      counts[gestures[0]] +
      "<br>Gesture 2 data: " +
      counts[gestures[1]]
  );
}
