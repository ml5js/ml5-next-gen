// declare variables img, bodyPose, and poses in the global scope
// so that we can access them inside the `draw()` function

/** @type {HTMLImageElement} - the input image */
let img;

/** @type {Object} the loaded ml5 model */
let bodyPose;

/** @type {Array} - the poses detected by the model */
let poses;


// Preload assets - setup() will not run until the loading is complete.
function preload() {
  // Load an image for pose detection
  img = loadImage('data/runner.jpg');
  // Load the ml5 model
  bodyPose = ml5.bodyPose();
}

function setup() {
  // Draw the image to the canvas
  createCanvas(img.width, img.height, document.querySelector('canvas'));
  image(img, 0, 0);
  // Do not need to draw on every frame
  noLoop();
  // Draw again when changing checkboxes
  // TODO: can use p5 function once this fix is published - https://github.com/processing/p5.js/pull/6838
  // select("form").changed(redraw);
  document.querySelector('form').addEventListener('change', redraw);
}

// When bodyPose is ready, do the detection
function modelReady() {
  // Update the status
  select('#status').html('Model Loaded');
  // Detect poses in the image
  bodyPose.detect(img, onPose);
}

// Function to run when the model detects poses.
function onPose(result) {
  // Update the status
  select("#status").html('Pose Detected');
  // Store the poses
  poses = result;
  // Initiate the drawing
  redraw();
}

// p5 draw function
function draw() {
  // Need to reset the canvas by drawing the image again.
  // In order to "undraw" when deselecting checkboxes.
  image(img, 0, 0);

  // If there are no poses, we are done.
  if (!poses) {
    return;
  }

  // Draw the correct layers based on the current checkboxes.
  const showSkeleton = select("#skeleton").checked();
  const showKeypoints = select("#keypoints").checked();
  const showLabels = select("#labels").checked();
  const showBox = select("#box").checked();

  // Loop through all the poses detected
  poses.forEach(pose => {
    // For each pose detected, loop through all body connections on the skeleton
    if (showSkeleton) {
      pose.skeleton?.forEach(connection => {
        // Each connection is an array of two parts
        const [partA, partB] = connection;
        // Draw a line between the two parts
        stroke(255);
        strokeWeight(2);
        line(partA.x, partA.y, partB.x, partB.y);
      });
    }
    // For each pose detected, draw the bounding box rectangle
    if (showBox) {
      console.log('drawing box', pose.box);
      const boundingBox = pose.box;
      stroke(255);
      noFill();
      strokeWeight(2);
      rect(boundingBox.xMin * width, boundingBox.yMin * height, boundingBox.width * width, boundingBox.height * height);
    }
    // For each pose detected, loop through all the keypoints
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    pose.keypoints.forEach(keypoint => {
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        if (showLabels) {
          // Line from part to label
          stroke(60);
          strokeWeight(1);
          line(keypoint.x, keypoint.y, keypoint.x + 10, keypoint.y);
          // Write the name of the part
          textAlign(LEFT, CENTER);
          text(keypoint.name, keypoint.x + 10, keypoint.y);
        }
        if (showKeypoints) {
          // Draw ellipse over part
          fill(255);
          stroke(20);
          strokeWeight(4);
          ellipse(round(keypoint.x), round(keypoint.y), 8, 8);
        }
      }
    });
  });
}
