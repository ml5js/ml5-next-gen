/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates basic depth estimation on a video feed using ml5.depthEstimation.
 */

let depthEstimator;
let video;
let depthResult;

// Video dimensions
const videoWidth = 640;
const videoHeight = 480;

// Default options for depth estimation (can be adjusted if needed)
const options = {
    normalizeDynamically: true, // Default is false
    // minDepth: 0.25,             // Default is 0.0
    // maxDepth: 0.75,              // Default is 1.0
    normalizationSmoothingFactor: 1, // Default is 0.5 (only used if normalizeDynamically is true)
    applySegmentationMask: true, // Default is false
    // colormap: 'grayscale', // Default is 'color'
    flipped: true, // Default is false
};

function preload() {
    // Initialize the depth estimation model
    console.log("Loading depth estimation model...");
    depthEstimator = ml5.depthEstimation(options);
    console.log("Model loaded successfully!");
}

function setup() {
    // Create a canvas twice the width of the video
    createCanvas(videoWidth * 2, videoHeight);

    // Create the video capture element
    video = createCapture(VIDEO);
    video.size(videoWidth, videoHeight); // Set video size
    video.hide(); // Hide the default HTML video element

    console.log("Starting depth estimation...");
    // Start continuous depth estimation on the video feed
    depthEstimator.estimateStart(video, gotResults);
}

function draw() {
    background(0); // Clear the background

    // Draw the original video feed on the left half of the canvas
    image(video, 0, 0, videoWidth, videoHeight);

    // Check if depth estimation results are available
    if (depthResult && depthResult.visualizationImage) {
        // Draw the colormapped depth visualization on the right half of the canvas
        image(depthResult.visualizationImage, videoWidth, 0, videoWidth, videoHeight);
    } else {
        // If no results yet, display a loading message on the right half
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(16);
        text("Estimating depth...", videoWidth + videoWidth / 2, videoHeight / 2);
        textAlign(LEFT, BASELINE); // Reset text alignment
    }
}

// Callback function that receives the depth estimation results
function gotResults(result) {
    // Store the latest result in the global variable
    depthResult = result;
}

// Optional: Log the full result object when the mouse is pressed
function mousePressed() {
    if (depthResult) {
        console.log("Current Depth Result:", depthResult);
    }
}