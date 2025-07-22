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

let gestures = ["gesture #1", "gesture #2"];
let counts = { "gesture #1": 0, "gesture #2": 0 };

let state = "collecting";
let currGesture = gestures[0]; // Set currGesture to gesture 1 by default
let predGesture = "";

function preload() {
  // Load the handPose model
  // Set options to have data points flipped
  handPose = ml5.handPose({ flipHorizontal: true });

  // Setup the neural network using sequenceClassification
  let options = {
    outputs: ["label"],
    task: "sequenceClassificationWithCNN",
    debug: "true",
    learningRate: 0.001, // The default learning rate of 0.01 didn't converge for this usecase, thus a learning rate of 0.001 is used (make smaller steps of parameters each update)
  };
  model = ml5.neuralNetwork(options);
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("canvasDiv");

  // Setup video capture
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  // Setup the UI buttons for training
  UI();

  // Use handpose model on video
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Draw video on frame
  image(video, 0, 0, width, height);

  // If hand is detected in the frame, start recording gesture
  if (hands.length > 0) {
    handpoints = drawPoints();
    sequence.push(handpoints);

    // Helpful text to signify recording
    textSize(20);
    stroke(255);
    fill(0);
    if (state == "collecting") {
      text(
        state + " : " + currGesture + ", put hand down once done with gesture",
        50,
        50
      );
    } else if (state == "prediction") {
      text("predicting... put hand down once done with gesture", 50, 50);
    }

    // Add collected data to model once the hand is gone and state is collecting
  } else if (hands.length <= 0 && sequence.length > 0) {
    if (state == "collecting") {
      // Pad the length of the coordinates to targetLength
      let inputData = model.setFixedLength(sequence, targetLength);
      let outputData = { label: currGesture };

      // Add data to the model
      model.addData(inputData, outputData);

      // Update the counts for the UI
      counts[currGesture]++;
      updateDataCountUI();

      // Pad the data and use for prediction if state is prediction
    } else if (state == "prediction") {
      let predictData = model.setFixedLength(sequence, targetLength);
      model.classify(predictData, gotResults);
    }

    // Reset the sequence
    sequence = [];

    // Tell users to put hand up to start recording
  } else {
    textSize(20);
    stroke(255);
    fill(0);
    if (state == "collecting") {
      text(
        "put hand up in screen to start collecting for: " + currGesture,
        50,
        50
      );
    } else if (state == "prediction") {
      if (!predGesture) {
        text("do one of the trained gestures to predict", 50, 50);
      } else {
        text(
          "prediction: " + predGesture + ", try again with another gesture!",
          50,
          50
        );
      }
    }
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

// Callback for predict
function gotResults(results) {
  predGesture = results[0].label;
}

// Callback function for when handPose outputs data
function gotHands(results) {
  hands = results;
}

// Draw visuals for hand points and flatten values into an array
function drawPoints() {
  let handpoints = [];
  // Iterate through both hands
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      // Access the keypoints in the hand
      let keypoint = hand.keypoints[j];
      handpoints.push(keypoint.x, keypoint.y);

      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
    }
  }

  // Assign to a different variable before clearing
  let output = handpoints;
  handpoints = [];

  return output;
}

// UI Elements
function UI() {
  dataCountsP = createP(
    "Gesture 1 data: " +
      counts[gestures[0]] +
      "<br>Gesture 2 data: " +
      counts[gestures[0]]
  );
  rockButton = createButton("Record Gesture #1");
  rockButton.mousePressed(addGesture1);
  paperButton = createButton("Record Gesture #2");
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
