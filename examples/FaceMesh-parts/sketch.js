// Copyright (c) 2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  if (faces.length > 0 && faces[0].lips) {
    fill(0, 255, 0);
    rect(
      faces[0].lips.x,
      faces[0].lips.y,
      faces[0].lips.width,
      faces[0].lips.height
    );
  }

  drawPartsKeypoints();
}

// Draw keypoints for specific face element positions
function drawPartsKeypoints() {
  // If there is at least one face
  if (faces.length > 0) {
    for (let i = 0; i < faces[0].lips.keypoints.length; i++) {
      let lips = faces[0].lips.keypoints[i];
      fill(0, 255, 0);
      circle(lips.x, lips.y, 5);
    }
  }
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
  console.log(faces);
}
