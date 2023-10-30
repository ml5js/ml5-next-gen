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

let canvas;
let ctx;

let options = {
  outputStride: 16, //adjust the output stride and see which one works best!
  multiSegmentation: false,
  segmentBodyParts: true,
  architecture: "MobileNetV1",
};

function preload() {
  bodyPix = ml5.bodyPix(video, options);
}

function setup() {
  canvas = document.getElementById("cvn");
  ctx = canvas.getContext("2d");
  createCanvas(360, 270);
  // Create the video
  video = createCapture(VIDEO);
  video.size(width, height);

  bodyPix.detectStart(video, gotResults);
}

// Event for body segmentation
function gotResults(result) {
  // Save the latest part mask from the model in global variable "segmentation"
  segmentation = result;
  //Draw the video
  //console.log(segmentation.personMask);
  //image(video, 0, 0, width, height);
  background(255);
  image(video, 0, 0);
  image(segmentation.personMask, 0, 0, 360, 270);

  ctx.putImageData(segmentation.raw.personMask, 0, 0);
}

function draw() {}
