/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates detecting objects in a live video through ml5.objectDetector.
 */

let img;
let detector;
let detections = [];

function preload(){
  detector = ml5.objectDetector("cocossd");
  img = loadImage('dog_cat.jpg');
}

function setup() {
  createCanvas(640, 480);
  image(img, 0, 0);
  detector.detectStart(img, gotDetections);
}

// Callback function is called each time the object detector finishes processing a frame.
function gotDetections(results) {
  // Update detections array with the new results
  detections = results;

  for (let i = 0; i < detections.length; i += 1) {
    let detection = detections[i];

    // Draw bounding box
    stroke(0, 255, 0);
    strokeWeight(4);
    noFill();
    rect(detection.x, detection.y, detection.width, detection.height);

    // Draw label
    noStroke();
    fill(255);
    textSize(24);
    text(detection.label, detection.x + 10, detection.y + 24);
  }
}
