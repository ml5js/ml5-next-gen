/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates basic depth estimation on an mp4 video using ml5.depthEstimation.
 */

let depthEstimator;
let video;
let depthMap;

// Video dimensions
let videoWidth = 640;
let videoHeight = 480;

async function setup() {
  // Create a canvas the size of the video
  createCanvas(videoWidth, videoHeight);

  // Load the depth estimation model
  depthEstimator = await ml5.depthEstimation();

  // Create the video
  video = createVideo("presenter.mp4"); // Excerpt from "Your name here", a 1960's spoof video in the public domain
  video.volume(0); // Mute is required for autoplay in some browsers
  video.autoplay(true); // Start playing the video automatically

  // When the video loads, run the 'videoLoaded' function
  video.elt.addEventListener("loadeddata", videoLoaded);

  video.size(videoWidth, videoHeight); // Set video size

  // Uncomment to hide the video element
  //video.hide();
}

// When loaded, start continuous depth estimation on the video feed
function videoLoaded() {
  video.loop();
  depthEstimator.estimateStart(video, gotResults);
}

function draw() {
  background(0);

  // Check if depth estimation results are available
  if (depthMap) {
    // Draw the depth map of the video
    image(depthMap.image, 0, 0);
  }
}

// Callback function that receives the depth estimation results
function gotResults(result) {
  // Store the latest result in the global variable
  depthMap = result;
}
