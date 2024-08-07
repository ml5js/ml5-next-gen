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
  img = loadImage("family.jpeg");

  // trying to work around "WebGPU readSync is only available for CPU-resident tensors."
  // see https://github.com/ml5js/ml5-next-gen/issues/117
  ml5.setBackend("webgl");

  // Load the objectDetector model
  objectDetector = ml5.objectDetector();
}

function setup() {
  createCanvas(800, 800);
  // Draw the image
  image(img, 0, 0);
  // Detect hands in an image
  objectDetector.detect(img, gotHands);
}

function draw() {
  // Draw all the hand keypoints
  
}

// Callback function for when objectDetector outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}