let handpose;
let video;
let hands = [];
let isDetecting = false;

function preload() {
  // Load the handpose model.
  handpose = ml5.handpose();
  console.log("preload");
}

function setup() {
  createCanvas(640, 480);
  fill(0, 255, 0);
  textSize(25);
  noStroke();
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      circle(keypoint.x, keypoint.y, 10);
    }
  }

  text("Press mouse to toggle detection", 10, 30);
  if (isDetecting) {
    text("Detecting", 10, 60);
  } else {
    text("Not detecting", 10, 60);
  }
}

//toggle detection when mouse is pressed
function mousePressed() {
  toggleDetection();
}

// call this function to start and stop detection
function toggleDetection() {
  if (isDetecting) {
    handpose.detectStop();
    isDetecting = false;
  } else {
    handpose.detectStart(video, gotHands);
    isDetecting = true;
  }
}

// Callback function for when handpose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}
