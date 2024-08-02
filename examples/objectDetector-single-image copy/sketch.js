/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates object detection on an image through ml5.objectDetector.
 */

let objectDetector;
let video;
let hands = [];

function preload() {
  // Load the image to be detected
  img = loadImage("hand.jpg");

  // trying to work around "WebGPU readSync is only available for CPU-resident tensors."
  // see https://github.com/ml5js/ml5-next-gen/issues/117
  ml5.setBackend("webgl");

  // Load the objectDetector model
  objectDetector = ml5.objectDetector();
}

function setup() {
  createCanvas(640, 480);
  // Draw the image
  image(img, 0, 0);
  // Detect hands in an image
  objectDetector.detect(img, gotHands);
}

function draw() {
  // Draw all the hand keypoints
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}

// Callback function for when objectDetector outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}