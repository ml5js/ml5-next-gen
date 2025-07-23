/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates basic depth estimation on a video feed using ml5.depthEstimation.
 */

let depthEstimator;
let video;
let depthMap;

// Video dimensions
let videoWidth = 640;
let videoHeight = 480;

// Default options for depth estimation (can be adjusted if needed)

function preload() {
  // Initialize the depth estimation model
  depthEstimator = ml5.depthEstimation();
}

function setup() {
  // Create a canvas twice the width of the video
  createCanvas(videoWidth * 2, videoHeight);

  // Create the video capture element
  video = createCapture(VIDEO);
  video.size(videoWidth, videoHeight); // Set video size
  video.hide(); // Hide the default HTML video element

  // Start continuous depth estimation on the video feed
  depthEstimator.estimateStart(video, gotResults);
}

function draw() {
  background(0);

  // Draw the original video feed on the left half of the canvas
  image(video, 0, 0);

  // Check if depth estimation results are available
  if (depthMap ) {
    // Draw the colormapped depth visualization on the right half of the canvas
    image(depthMap.image, videoWidth, 0, videoWidth, videoHeight);
  }
}

// Callback function that receives the depth estimation results
function gotResults(result) {
  // Store the latest result in the global variable
  depthMap = result;
}
