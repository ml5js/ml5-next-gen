/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates training a hand gesture classifier through
 * ml5.neuralNetwork with the sequenceClassificationWithCNN task.
 */

let video;
let handPose;
let hands = [];
let model;

let state = "training";
let sequence = [];
let targetLength = 30;
let gestures = ["Gesture #1", "Gesture #2"];
let counts = { "Gesture #1": 0, "Gesture #2": 0 };
let curGesture = gestures[0];

let gesture1Button;
let gesture2Button;
let trainButton;

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
    outputs: ["label"],
    task: "sequenceClassificationWithCNN",
    debug: true,
    learningRate: 0.001, // the default learning rate of 0.01 didn't converge for this use case (0.001 makes smaller steps each epoch)
  };
  model = ml5.neuralNetwork(options);

  // setup the UI buttons for training
  gesture1Button = createButton("Start recording " + gestures[0]);
  gesture1Button.mousePressed(recordGesture1);
  gesture2Button = createButton("Start recording " + gestures[1]);
  gesture2Button.mousePressed(recordGesture2);
  trainButton = createButton("Train and Save Model");
  trainButton.mousePressed(trainModel);
}

function draw() {
  image(video, 0, 0, width, height);
  drawHands();

  if (hands.length > 0) {
    // hands in frame, add to sequence
    let handpoints = getKeypoints(["Left", "Right"]);
    sequence.push(handpoints);

    // This uses the RDP line simplification algorithm to make sure each
    // input to the neural network has the same number of points.
    // For more information about RDP, see:
    // https://www.youtube.com/watch?v=ZCXkvwLxBrA

    let rdp = model.setFixedLength(sequence, targetLength);
    for (let i = 0; i < rdp.length - 1; i++) {
      for (let j = 0; j < rdp[i].length; j += 2) {
        stroke(255, 0, 0);
        line(rdp[i][j], rdp[i][j + 1], rdp[i + 1][j], rdp[i + 1][j + 1]);
      }
    }
  } else if (sequence.length > 0) {
    // hands moved out of the frame, end of sequence
    let inputs = model.setFixedLength(sequence, targetLength);

    if (state == "training") {
      let outputs = { label: curGesture };
      model.addData(inputs, outputs);
    } else if (state == "predicting") {
      model.classify(inputs, gotResults);
    }
    counts[curGesture]++;
    // reset the sequence
    sequence = [];
  }

  // display current state
  textSize(16);
  fill(255);
  noStroke();
  if (state == "training" && sequence.length == 0) {
    text("Move your hand(s) into the frame to record " + curGesture, 50, 50);
  } else if (state == "training") {
    text("Move your hand(s) out of the frame to finish " + curGesture, 50, 50);
  } else if (state == "predicting" && curGesture == null) {
    text("Try a trained gesture to see the prediction", 50, 50);
  } else if (state == "predicting" && curGesture) {
    text("Saw " + curGesture, 50, 50);
  }

  // show how many times each gesture was recorded
  if (state == "training") {
    for (let i = gestures.length - 1; i >= 0; i--) {
      text(
        gestures[i] + ": " + counts[gestures[i]],
        50,
        height - 50 - (gestures.length - i - 1) * 20
      );
    }
  }
}

function trainModel() {
  model.normalizeData();
  let options = {
    epochs: 50,
  };
  model.train(options, finishedTraining);

  gesture1Button.attribute("disabled", true);
  gesture2Button.attribute("disabled", true);
  trainButton.attribute("disabled", true);
}

function finishedTraining() {
  state = "predicting";
  model.save();
  curGesture = null;
}

// callback function for when the classification fininished
function gotResults(results) {
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
  for (let handedness of whichHands) {
    let found = false;
    for (let i = 0; i < hands.length; i++) {
      let hand = hands[i];
      if (hand.handedness == handedness) {
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

function recordGesture1() {
  curGesture = gestures[0];
}

function recordGesture2() {
  curGesture = gestures[1];
}
