/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates loading a hand gesture classifier through
 * ml5.neuralNetwork with the sequenceClassificationWithCNN task.
 * This example has been trained with the ASL gestures for Hello and Goodbye.
 *
 * Reference to sign hello and goodbye in ASL:
 * Hello: https://www.signasl.org/sign/hello
 * Goodbye: https://www.signasl.org/sign/goodbye
 */

let video;
let handPose;
let hands = [];
let model;
let isModelLoaded = false;

let sequence = [];
let sequenceLength = 50;
let curGesture;

function preload() {
  // load the handPose model
  handPose = ml5.handPose({ flipHorizontal: true });
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("canvasDiv");

  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);

  let options = {
    task: "sequenceClassificationWithCNN",
  };
  model = ml5.neuralNetwork(options);

  // setup the model files to load
  let modelDetails = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };

  // load the model and call modelLoaded once finished
  model.load(modelDetails, modelLoaded);
}

function modelLoaded() {
  console.log("Model loaded");
  isModelLoaded = true;
}

function draw() {
  image(video, 0, 0, width, height);
  drawHands();
  textSize(16);
  stroke(0);
  fill(255);

  if (hands.length > 0) {
    // hands in frame, add their keypoints to the sequence (input)
    let handpoints = getKeypoints(["Left", "Right"]);
    sequence.push(handpoints);
    text(
      "Move your hand(s) out of the frame after finishing the gesture",
      50,
      50
    );
  } else if (sequence.length > 0) {
    // hands moved out of the frame, end of sequence

    // Sequence will have varying length at this point, depending on
    // how long the hands were in frame - a line simplification algorithm
    // (RDP) turns it into the fixed length the NN can work with.
    // For more information about RDP, see:
    // https://www.youtube.com/watch?v=ZCXkvwLxBrA
    let inputs = model.setFixedLength(sequence, sequenceLength);

    // start the classification
    if (isModelLoaded) {
      model.classify(inputs, gotResults);
    }
    // reset the sequence
    sequence = [];
    text("Classifying...", 50, 50);
  } else if (curGesture == null) {
    // on program start
    text("Move your hand(s) into the frame to sign a gesture", 50, 50);
  } else {
    // after receiving a classification
    text('Saw "' + curGesture + '"', 50, 50);
  }
}

// callback function for when the classification fininished
function gotResults(results, error) {
  if (error) {
    console.error(error);
    return;
  }
  curGesture = results[0].label;
}

// callback function for when handPose outputs data
function gotHands(results) {
  hands = results;
}

function drawHands() {
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
    }
  }
}

// Return the tracked hand points as flattened array of 84 numbers
// for use as input to the neural network

function getKeypoints(whichHands = ["Left", "Right"]) {
  let keypoints = [];
  // look for the left and right hand
  for (let whichHand of whichHands) {
    let found = false;
    for (let i = 0; i < hands.length; i++) {
      let hand = hands[i];
      if (hand.handedness == whichHand) {
        // and add the x and y numbers of each tracked keypoint
        // to the array
        for (let j = 0; j < hand.keypoints.length; j++) {
          let keypoint = hand.keypoints[j];
          keypoints.push(keypoint.x, keypoint.y);
        }
        found = true;
        break;
      }
    }
    if (!found) {
      // if we don't find a right or a left hand, add 42 zeros
      // to the keypoints array instead
      for (let j = 0; j < 42; j++) {
        keypoints.push(0);
      }
    }
  }
  return keypoints;
}
