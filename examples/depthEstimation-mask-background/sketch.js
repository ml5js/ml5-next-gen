/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates running depth estimation on a webcam with a transparent background.
 */

let depthEstimator;
let webcam;
let depthMap;

let backdrop;

// Video dimensions
let videoWidth = 640;
let videoHeight = 480;

function preload() {
  // Load and start the depth estimation model
  depthEstimator = ml5.depthEstimation();

  // Load the backdrop image. "Bright Center Star Cluster" by NASA
  backdrop = loadImage('starcluster.jpg');
}

function setup() {
  // Create a canvas the size of the webcam video
  createCanvas(videoWidth, videoHeight);

  // Create the video capture element
  webcam = createCapture(VIDEO);
  webcam.size(videoWidth, videoHeight); // Set video size
  webcam.hide(); // Hide the default HTML video element

  // Start continuous depth estimation on the webcam feed and make "gotResults" the callback function
  depthEstimator.estimateStart(webcam, gotResults);
}

function draw() {
  //Draw a backdrop image that will be behind the depth map
  image(backdrop, 0, -height/2, width);

  // If depth estimation results are available
  if (depthMap) {
    // Apply the silhouette mask to the depth map using the p5 mask function. This will make its background transparent.
    depthMap.image.mask(depthMap.mask);
    // Draw the depth map
    image(depthMap.image, 0, 0);
  }
}

// Callback function that receives the depth estimation results
function gotResults(result) {
  // Store the latest result in the global variable depthMap
  depthMap = result;
}
