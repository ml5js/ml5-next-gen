/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates segmenting a person by body parts with ml5.bodySegmentation.
 */

let bodyPix;
let video;
let segmentation;

let options = {
  maskType: "parts",
};

function preload() {
  bodyPix = ml5.bodySegmentation("BodyPix", options);
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
    image(segmentation, 0, 0, width, height);
  }
}
// callback function for body segmentation
function gotResults(result) {
  segmentation = result.mask;
}
