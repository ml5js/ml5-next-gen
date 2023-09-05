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

  // Draw all the tracked face points
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
    }
  }
}

// Callback function for when facemesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
  //console.log(faces);
}
