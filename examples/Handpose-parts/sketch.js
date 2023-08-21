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
  // Load the handpose model.
  handpose = ml5.handpose();
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // start detecting hands from the webcam video
  handpose.detectStart(video, gotHands);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // This circle's size is controlled by a "pinch" gesture
  fill(0, 255, 0);
  noStroke();
  circle(width / 4, height / 4, pinch);

  // If there is at least one hand
  if (hands.length > 0) {
    // Find the index finger tip and thumb tip
    let finger = hands[0].index_finger_tip;
    let thumb = hands[0].thumb_tip;

    // Draw circles at finger positions
    noStroke();
    fill(255);
    circle(finger.x, finger.y, 16);
    circle(thumb.x, thumb.y, 16);

    // Draw a line between finger positions
    stroke(0);
    strokeWeight(4);
    line(finger.x, finger.y, thumb.x, thumb.y);

    // Calculate the pinch "distance" between finger and thumb
    pinch = dist(finger.x, finger.y, thumb.x, thumb.y);
  }
}

// Callback function for when handpose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
  console.log(hands);
}
