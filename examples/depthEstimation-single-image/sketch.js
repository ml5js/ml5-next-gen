/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates depth estimation on a single image using ml5.depthEstimation.
 */

// Global variables
let depthEstimator; // The ml5.js depth estimation model instance
let img;            // The p5.js image object for the input
let depthResult;    // The object holding the depth estimation results
let status = "Loading model and image..."; // Status message

// Image dimensions (will be updated based on loaded image)
let imgWidth = 640; // Default width
let imgHeight = 480; // Default height

// Model and runtime options
let options = {
    colormap: "COLOR", // Colormap for visualization ('COLOR', 'GRAYSCALE')
    minDepth: 0,       // Minimum depth value (0-1) for normalization
    maxDepth: 1,       // Maximum depth value (0-1) for normalization
};

// We don't use preload anymore, setup will handle async loading
// function preload() {}

async function setup() {
    // Create a canvas twice the width of the image to show image and depth map side-by-side
    // Initial size is default, will be resized later
    createCanvas(imgWidth * 2, imgHeight);
    console.log("Setup started.");

    // Initialize the depth estimation model
    console.log("Loading depth estimation model...");
    depthEstimator = ml5.depthEstimation(options);

    // Load the sample image using a promise wrapper for await
    console.log("Loading image...");
    try {
        // --- IMPORTANT: Replace with the path to YOUR image ---
        img = await loadImagePromise('face.png'); // Use the user's image
        // img = await loadImagePromise('../../3d_photo/images/im1.jpg'); // Original image path
        console.log("Image loaded successfully!");

        // Update dimensions based on the loaded image
        imgWidth = img.width;
        imgHeight = img.height;
        resizeCanvas(imgWidth * 2, imgHeight); // Resize canvas now

        // Wait for the model to be ready
        status = "Waiting for model to load...";
        console.log(status);
        await depthEstimator.ready; // Wait for the promise returned by the constructor
        console.log("Model loaded successfully!");

        // Now both image and model are ready, start estimation
        estimateDepth();

    } catch (error) {
        console.error("Error loading image:", error);
        status = "Error loading image. Check console.";
    }
}

// Helper function to load image with a Promise
function loadImagePromise(path) {
    return new Promise((resolve, reject) => {
        loadImage(path, img => {
            if (img) {
                resolve(img);
            } else {
                reject(`Failed to load image at path: ${path}`);
            }
        }, err => {
            reject(`Error loading image: ${err}`);
        });
    });
}


// Function to start the depth estimation
async function estimateDepth() {
    if (!img || !depthEstimator || !depthEstimator.model) { // Add check for depthEstimator.model
        console.error("Estimation called before model or image was ready.");
        status = "Error: Model or image not ready.";
        return;
    }
    status = "Estimating depth...";
    console.log(status);
    // Estimate depth from the loaded image
    // Use await here as estimate is async
    depthResult = await depthEstimator.estimate(img);
    gotResults(depthResult); // Call gotResults directly after await
}


function draw() {
    background(0); // Clear the background

    // Draw the original image on the left half of the canvas
    if (img) {
        image(img, 0, 0, imgWidth, imgHeight);
    } else {
        // Show status if image hasn't loaded yet
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(16);
        text(status, imgWidth / 2, imgHeight / 2);
        textAlign(LEFT, BASELINE); // Reset text alignment
    }

    // Check if depth estimation results are available
    if (depthResult) {
        // Draw the colormapped depth visualization on the right half of the canvas
        image(depthResult.visualizationImage, imgWidth, 0, imgWidth, imgHeight);
    } else {
        // If no results yet, display the status message on the right half
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(16);
        text(status, imgWidth + imgWidth / 2, imgHeight / 2);
        textAlign(LEFT, BASELINE); // Reset text alignment
    }
}

// Callback function that receives the depth estimation results
function gotResults(result) {
    // Store the result in the global variable (already done by await in estimateDepth)
    // depthResult = result;
    status = "Done!"; // Update status
    console.log("Depth estimation complete!");
    console.log("Depth Result:", depthResult); // Log the result object
}