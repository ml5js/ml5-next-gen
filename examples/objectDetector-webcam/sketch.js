/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates object detection on an image through ml5.objectDetector.
 */

let objectDetector;
let video;
let objects = [];
let isModelLoaded = false;
let isVideoReady = false;
let detectionInterval = 30; // Number of frames between each detection
let frameCount = 0;

function preload() {
  // Set the backend to "webgl"
  ml5.setBackend("webgl");

  // Load the objectDetector model
  objectDetector = ml5.objectDetector('cocossd', modelReady);
}

function setup() {
  createCanvas(800, 800);

  // Create a video capture element
  video = createCapture(VIDEO, videoReady);
  video.size(800, 800);
  video.hide(); // Hide the video element since we'll draw it on the canvas
}

function draw() {
  if (isVideoReady && isModelLoaded) {
    // Draw the video frame to the canvas
    image(video, 0, 0);

    frameCount++;

    // Run object detection at specified intervals
    if (frameCount % detectionInterval === 0) {
      objectDetector.detect(video, gotObjects);
    }

    // Loop through all the detected objects and draw bounding boxes with labels
    for (let i = 0; i < objects.length; i++) {
      let object = objects[i];
      let x = object.bbox[0];
      let y = object.bbox[1];
      let w = object.bbox[2];
      let h = object.bbox[3];

      // Draw the bounding box
      stroke(object.color.r, object.color.g, object.color.b);
      noFill();
      rect(x, y, w, h);

      // Draw the label with the class name
      noStroke();
    fill(object.color.r, object.color.g, object.color.b);
    textSize(16);
    text(object.class, x + 5, y + 15);
    }
  }
}

// Callback when the model is ready
function modelReady() {
  console.log("Model Loaded!");
  isModelLoaded = true;
}

// Callback when the video is ready
function videoReady() {
  console.log("Video Ready!");
  isVideoReady = true;
}

// Callback function for when objectDetector outputs data
function gotObjects(results) {
  // Save the output to the objects variable and assign a random color to each object
  objects = results.map(object => {
    object.color = {
      r: random(255),
      g: random(255),
      b: random(255)
    };
    return object;
  });

  // Redraw canvas to update the boxes
  redraw();
}
