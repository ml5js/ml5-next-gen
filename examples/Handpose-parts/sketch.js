// Copyright (c) 2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let handpose;
let video;
let hands = [];

// A variable to track a pinch between thumb and index
let pinch = 0;

function preload() {
  // Load the handpose model
  handpose = ml5.handpose();
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // Start detecting hands from the webcam video
  handpose.detectStart(video, gotHands);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // If there is at least one hand
  if (hands.length > 0) {
    // Find the index finger tip and thumb tip
    let finger = hands[0].index_finger_tip;
    let thumb = hands[0].thumb_tip;

    // Draw circles at finger positions
    let centerX = (finger.x + thumb.x) / 2;
    let centerY = (finger.y + thumb.y) / 2;
    // Calculate the pinch "distance" between finger and thumb
    let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);

    // This circle's size is controlled by a "pinch" gesture
    fill(0, 255, 0, 200);
    stroke(0);
    strokeWeight(2);
    circle(centerX, centerY, pinch);
  }
}

// Callback function for when handpose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
  console.log(hands);
}
