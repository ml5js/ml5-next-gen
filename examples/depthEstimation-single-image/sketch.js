/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates depth estimation on a single image using ml5.depthEstimation.
 */

// Global variables
let depthEstimator;
let img;
let depthResult;

// Default options for depth estimation (can be adjusted if needed)
const options = {
  //normalizeDynamically: true, // Default is false
  minDepth: 0.21, // Default is 0.0
  maxDepth: 0.73, // Default is 1.0
  applySegmentationMask: true, // Default is false
};

function preload() {
  img = loadImage("face.png");
  // Load the depth estimation model
  depthEstimator = ml5.depthEstimation(options);
}

function setup() {
  // Create a canvas twice the width of the image
  createCanvas(img.width * 2, img.height);

  // Estimate depth from the loaded image
  depthEstimator.estimate(img, gotResults);
}

function draw() {
  background(0); // Clear the background

  // Draw the original image on the left half of the canvas
  if (img) {
    image(img, 0, 0, img.width, img.height);
  }

  // Check if depth estimation results are available
  if (depthResult && depthResult.visualizationImage) {
    // Draw the colormapped depth visualization on the right half of the canvas
    image(depthResult.visualizationImage, img.width, 0, img.width, img.height);
  } else {
    // If no results yet, display a simple status message on the right half
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Estimating...", img.width + img.width / 2, img.height / 2);
    textAlign(LEFT, BASELINE); // Reset text alignment
  }
}

// Callback function that receives the depth estimation results
function gotResults(result) {
  depthResult = result; // Store the result
}
