/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 */

let video;
let detector;
let detections = [];

async function setup() {
  detector = await ml5.objectDetection("cocossd");

  createCanvas(640, 480);

  // Using webcam feed as video input, hiding html element to avoid duplicate with canvas
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  detector.detectStart(video, gotDetections);
}

// Callback function is called each time the object detector finishes processing a frame.
function gotDetections(results) {
  // Update detections array with the new results
  detections = results;
}

function draw() {
  // Draw the current video frame onto the canvas.
  image(video, 0, 0);

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