// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
poseDetection example using p5.js
=== */

let video;
let poseNet;
let poses = [];

function setup() {
  createCanvas(640, 480);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Load the model and attach an event
  poseDetector = ml5.poseDetection(video, modelReady);
  poseDetector.on("pose", gotPoses);
}

// Event for pose detection
function gotPoses(results) {
  // Always save the latest output from the model in global variable "poses"
  poses = results;
}

// Event for when model loaded
function modelReady() {
  console.log("Model ready!");
}

function draw() {
  console.log(poses);
  // Draw the video
  image(video, 0, 0, width, height);

  // Draw all the tracked landmark points
  // for each individual pose detected
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    // for each keypoint in the pose
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse if the confidence score of the keypoint is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.x, keypoint.y, 10, 10);
      }
    }
  }
}
