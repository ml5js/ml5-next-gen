// Copyright (c) 2020-2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
BodyPix
=== */

let bodyPix;
let video;
let segmentation;

let options = {
  maskType: "background",
};

function preload() {
  bodyPix = ml5.bodyPix(video, options);
}

function setup() {
  createCanvas(640, 480);
  // Create the video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  bodyPix.detectStart(video, gotResults);
}

function draw() {
  background(255);
  image(video, 0, 0);
  if (segmentation) {
    tint(255, 200);
    image(segmentation, 0, 0, width, height);
    tint(255, 255);
  }
}
// callback function for body segmentation
function gotResults(result) {
  segmentation = result.mask;
}
