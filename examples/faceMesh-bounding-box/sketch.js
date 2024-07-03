/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates bounding box facial tracking on live video through ml5.faceMesh.
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
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw the faces' bounding boxes
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    let x = face.box.xMin;
    let y = face.box.yMin;
    let w = face.box.width;
    let h = face.box.height;
    let centerX = (face.box.xMin + face.box.xMax) / 2; // average of xMin and xMax
    let centerY = (face.box.yMin + face.box.yMax) / 2; // average of yMin and yMax

    stroke(0, 255, 0);
    fill(0, 255, 0, 50);
    rect(x, y, w, h);
    text(i, x, y - 10);

    // Draw the center of the face
    noStroke();
    fill(255, 0, 0);
    circle(centerX, centerY, 10);
  }
}

function gotFaces(results) {
  faces = results;
}
