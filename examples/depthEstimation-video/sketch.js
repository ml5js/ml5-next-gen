/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates basic depth estimation with ml5.depthEstimation.
 */

// Global variables
let depthEstimator; // The ml5.js depth estimation model instance
let video;          // The p5.js video capture element
let depthResult;    // The object holding the latest depth estimation results

// Model and runtime options
let options = {
    colormap: "COLOR", // Colormap for visualization ('COLOR', 'GRAYSCALE')
    minDepth: 0,       // Minimum depth value (0-1) for normalization
    maxDepth: 1,       // Maximum depth value (0-1) for normalization
    // flipHorizontal: false // Set to true if using a webcam that needs flipping
};

// Video dimensions
const videoWidth = 640;
const videoHeight = 480;

function preload() {
    // Initialize the depth estimation model with specified options
    console.log("Loading depth estimation model...");
    depthEstimator = ml5.depthEstimation(options);
    console.log("Model loaded successfully!");
}

function setup() {
    // Create a canvas twice the width of the video to show video and depth map side-by-side
    createCanvas(videoWidth * 2, videoHeight);

    // Create the video capture element
    video = createCapture(VIDEO);
    video.size(videoWidth, videoHeight); // Set video size
    video.hide(); // Hide the default HTML video element

// Create buttons for changing colormaps
    const colormaps = ['COLOR', 'GRAYSCALE']; // Updated available colormaps
    let buttonY = videoHeight + 15; // Position buttons below the canvas
    let buttonX = 10;
    colormaps.forEach(mapName => {
        let button = createButton(mapName);
        button.position(buttonX, buttonY);
        button.mousePressed(() => changeColormap(mapName));
        buttonX += button.width + 10; // Adjust spacing
    });

    // Adjust canvas height slightly to accommodate buttons if needed
    // resizeCanvas(width, videoHeight + 50); // Optional: uncomment if buttons overlap or are cut off
    console.log("Starting depth estimation...");
    // Start continuous depth estimation on the video feed
    // Pass the video element and the callback function 'gotResults'
    depthEstimator.estimateStart(video, gotResults);
}

function draw() {
    background(0); // Clear the background

    // Draw the original video feed on the left half of the canvas
    image(video, 0, 0, videoWidth, videoHeight);

    // Check if depth estimation results are available
    if (depthResult) {
        // Draw the colormapped depth visualization on the right half of the canvas
        image(depthResult.visualizationImage, videoWidth, 0, videoWidth, videoHeight);

        // Removed depth display on hover as getDepthAt is no longer available
        // in the result object after the tensor processing changes.
    } else {
        // If no results yet, display a loading message on the right half
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        text("Estimating depth...", videoWidth + videoWidth / 2, height / 2);
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
// Function to change the colormap and re-initialize the model
// Function to change the colormap dynamically
function changeColormap(newColormap) {
    console.log(`Changing colormap to: ${newColormap}`);
    if (depthEstimator && depthEstimator.runtimeConfig) {
        // Directly update the runtime configuration of the existing estimator
        // Ensure the value is uppercase as the library expects
        depthEstimator.runtimeConfig.colormap = newColormap.toUpperCase();
        console.log(`Runtime colormap updated to: ${depthEstimator.runtimeConfig.colormap}`);
        // The existing estimateStart loop will automatically use the new
        // colormap in the next call to processDepthMap. No need to restart.
    } else {
        console.error("Depth estimator not ready or runtimeConfig not available to change colormap.");
    }
}