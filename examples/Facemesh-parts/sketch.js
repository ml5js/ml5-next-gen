// Copyright (c) 2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let facemesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // Load the facemesh model
  facemesh = ml5.facemesh(options);
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // Start detecting faces from the webcam video
  facemesh.detectStart(video, gotFaces);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  drawPartsKeypoints();
  drawPartsBoundingBox();
}

// Draw keypoints for specific face element positions
function drawPartsKeypoints() {
  // If there is at least one face
  if (faces.length > 0) {
    for (let i = 0; i < faces[0].lips.length; i++) {
      let lips = faces[0].lips[i];
      fill(0, 255, 0);
      circle(lips.x, lips.y, 5);
    }
  }
}

// Draw bounding box for specific face element positions
function drawPartsBoundingBox() {
  // If there is at least one face
  if (faces.length > 0) {
    let lipsX = [];
    let lipsY = [];
    for (let i = 0; i < faces[0].lips.length; i++) {
      // Find the lips
      let lips = faces[0].lips[i];
      lipsX.push(lips.x);
      lipsY.push(lips.y);
    }
    noFill();
    rect(
      min(lipsX),
      min(lipsY),
      max(lipsX) - min(lipsX),
      max(lipsY) - min(lipsY)
    );
  }
}

// Callback function for when facemesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
  //console.log(faces);
}
