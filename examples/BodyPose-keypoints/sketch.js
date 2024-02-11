// Copyright (c) 2018-2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let video;
let bodyPose;
let poses = [];

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(640, 480);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // Only draw a circle if the keypoint's confidence is bigger than 0.1
      if (keypoint.score > 0.1) {
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}
