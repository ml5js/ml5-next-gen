// Hand Regressor
// Based on https://editor.p5js.org/golan/sketches/dpzEzaapt

let handPose;
let video;
let hands = [];
let handTrackOptions = { maxHands: 1, flipHorizontal: true };

// Interface
let dataButton;
let dataLabel;
let trainButton;

const N_LANDMARKS = 21;
let sampleCount = 0;
let bTrainingCompleted = false;
let theResults;
let brain;
let trainingData = [];

//----------------------------------------------------
const neuralNetworkOptions = {
  task: "regression",
  debug: true,
};

//------------------------------------------
function preload() {
  // Load the handpose model.
  handPose = ml5.handPose(handTrackOptions);
}
function gotHands(results) {
  // Callback function for when handpose outputs data.
  // Save the output to the hands variable
  hands = results;
}

//------------------------------------------
function setup() {
  let myCanvas = createCanvas(640, 480);
  myCanvas.position(0, 0);

  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // ML5 Handpose: detect hands from the webcam video
  handPose.detectStart(video, gotHands);

  // ML5 Neural Net:
  ml5.setBackend("webgl");

  trainButton = createButton("Train model");
  trainButton.mousePressed(trainModelFunction);
  trainButton.position(520, 35);
  trainButton.size(90, 40);

  // Create the model.
  let options = {
    inputs: N_LANDMARKS * 2,
    outputs: 1,
    task: "regression",
    debug: true,
  };
  brain = ml5.neuralNetwork(options);

  // Save and download the model
  let saveBtn = createButton("Save Model");
  saveBtn.position(520, 80);
  saveBtn.mousePressed(function () {
    brain.save();
  });

  //Load model explictly pointing to each file
  const modelDetails = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };
  brain.load(modelDetails, modelReady);
}

//------------------------------------------
function draw() {
  // Draw the webcam video
  background("white");
  drawVideoBackground();
  drawHandPoints();

  if (bTrainingCompleted) {
    doRegression();
  }
  drawResults();
}

//------------------------------------------
function keyPressed() {
  if (key == " ") {
    addTrainingExample();
  }
}

//------------------------------------------
// Add a training example
function addTrainingExample() {
  let inputs = getInputData();
  if (inputs && inputs.length > 0) {
    let target = map(mouseX, 0, width, 0, 1);
    brain.addData(inputs, [target]);
    sampleCount++;
  }
}

//------------------------------------------
// Train the model
function trainModelFunction() {
  brain.normalizeData();
  let options = {
    batchSize: 24,
    epochs: 30,
  };
  brain.train(options, finishedTrainingCallback);
  bTrainingCompleted = true;
}

//------------------------------------------
// Begin prediction
function finishedTrainingCallback() {
  print("Finished Training");
}
//------------------------------------------
function modelReady() {
  console.log("model loaded!");
  bTrainingCompleted = true;
  //doRegression();
}
//------------------------------------------
function doRegression() {
  if (bTrainingCompleted) {
    let freshInput = getInputData();
    if (freshInput) {
      brain.predict([freshInput], (results, err) => {
        if (err) {
          console.log(err);
          return;
        }
        theResults = results;
      });
    }
  }
}

//------------------------------------------
function drawResults() {
  stroke("black");
  fill("lightgray");
  rect(0, 0, width, 110);
  fill("white");
  rect(0, 0, width, 20);

  fill("black");
  noStroke();
  textAlign(LEFT);
  let ty = 20;
  text(
    "Step 1: Create a fist, set training value to 0 with mouse, press Space to add samples.",
    10,
    (ty += 15)
  );
  text(
    "Step 2: Open palm, set training value to 1 with mouse, press Space to add samples.",
    10,
    (ty += 15)
  );
  text("Sample count = " + sampleCount, 10, (ty += 15));

  // theResults[i].confidence;

  if (bTrainingCompleted) {
    if (theResults && theResults.length > 0) {
      let prediction = theResults[0].value; // 0...1
      let px = map(prediction, 0, 1, 0, width);
      fill("black");
      rect(px, 0, 3, 20);
      if (prediction < 0.5) {
        textAlign(LEFT);
        text("prediction val: " + nf(prediction, 1, 3), px + 5, 15);
      } else {
        textAlign(RIGHT);
        text("prediction val: " + nf(prediction, 1, 3), px - 5, 15);
      }
    }
  } else {
    let trainingValue = map(mouseX, 0, width, 0, 1);
    let px = map(trainingValue, 0, 1, 0, width);
    fill("black");
    rect(px, 0, 3, 20);
    if (trainingValue < 0.5) {
      textAlign(LEFT);
      text("training val: " + nf(trainingValue, 1, 3), px + 5, 15);
    } else {
      textAlign(RIGHT);
      text("training val: " + nf(trainingValue, 1, 3), px - 5, 15);
    }
  }
}

//------------------------------------------
function drawHandPoints() {
  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      stroke("black");
      fill("lime");
      strokeWeight(1);
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}

//------------------------------------------
function getInputData() {
  // Copy the hand data into a normalized format for the brain.
  if (hands.length > 0) {
    const landmarkData = [];
    var firstHandIndex = 0;

    // Compute the centroid (averageX, averageY) of the hand
    var avgx = 0;
    var avgy = 0;
    for (var j = 0; j < N_LANDMARKS; j++) {
      let keypoint = hands[firstHandIndex].keypoints[j];
      avgx += keypoint.x;
      avgy += keypoint.y;
    }
    avgx /= N_LANDMARKS;
    avgy /= N_LANDMARKS;

    // Create a copy of the hand data--but subtract the centroid.
    // This way, we're not training on WHERE the hand is located!
    for (var j = 0; j < N_LANDMARKS; j++) {
      let keypoint = hands[firstHandIndex].keypoints[j];
      landmarkData.push(keypoint.x - avgx);
      landmarkData.push(keypoint.y - avgy);
    }
    return landmarkData;
  }
  return null;
}

//------------------------------------------
function drawVideoBackground() {
  push();
  if (handTrackOptions.flipHorizontal) {
    translate(width, 0);
    scale(-1, 1);
  }
  let transparency = 255; // reduce this to make video transparent
  tint(255, 255, 255, transparency);
  image(video, 0, 0, width, height);
  pop();
}
