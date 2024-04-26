/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates face tracking on an image through ml5.faceMesh.
 */

let faceMesh;
let img;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // Load the image to be detected
  img = loadImage("face.png");
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(640, 480);
  // Draw the image
  image(img, 0, 0);
  // Detect faces in an image
  faceMesh.detect(img, gotFaces);
}

function draw() {
  // Draw all the face keypoints
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 1.5);
    }
  }
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}
