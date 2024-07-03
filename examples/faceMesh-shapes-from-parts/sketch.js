/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates drawing custom shapes on facial features using ml5.faceMesh.
 */

let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  // draw the webcam video
  image(video, 0, 0, width, height);

  // draw the faces' bounding boxes
  for (let j = 0; j < faces.length; j++) {
    let face = faces[j];

    noFill();

    // draw the lips
    stroke(255, 0, 255);
    beginShape();
    for (let i = 0; i < face.lips.keypoints.length; i++) {
      let keypoint = face.lips.keypoints[i];
      let x = keypoint.x;
      let y = keypoint.y;
      vertex(x, y);
    }
    endShape(CLOSE);

    // draw the left eye
    stroke(255, 255, 0);
    beginShape();
    for (let i = 0; i < face.leftEye.keypoints.length; i++) {
      let keypoint = face.leftEye.keypoints[i];
      let x = keypoint.x;
      let y = keypoint.y;
      vertex(x, y);
    }
    endShape(CLOSE);

    // draw the left eyebrow
    stroke(0, 255, 0);
    beginShape();
    for (let i = 0; i < face.leftEyebrow.keypoints.length; i++) {
      let keypoint = face.leftEyebrow.keypoints[i];
      let x = keypoint.x;
      let y = keypoint.y;
      vertex(x, y);
    }
    endShape(CLOSE);

    // draw the right eye
    stroke(0, 255, 255);
    beginShape();
    for (let i = 0; i < face.rightEye.keypoints.length; i++) {
      let keypoint = face.rightEye.keypoints[i];
      let x = keypoint.x;
      let y = keypoint.y;
      vertex(x, y);
    }
    endShape(CLOSE);

    // draw the right eyebrow
    stroke(0, 0, 255);
    beginShape();
    for (let i = 0; i < face.rightEyebrow.keypoints.length; i++) {
      let keypoint = face.rightEyebrow.keypoints[i];
      let x = keypoint.x;
      let y = keypoint.y;
      vertex(x, y);
    }
    endShape(CLOSE);

    // draw the face oval

    beginShape();
    for (let i = 0; i < face.faceOval.keypoints.length; i++) {
      let keypoint = face.faceOval.keypoints[i];
      let x = keypoint.x;
      let y = keypoint.y;
      vertex(x, y);

      // display the index
      noStroke();
      fill(255, 0, 0);
      textSize(8);
      text(i, x + 10, y);
    }
    stroke(255, 0, 0);
    noFill();
    endShape(CLOSE);
  }
}

function gotFaces(results) {
  faces = results;
}
