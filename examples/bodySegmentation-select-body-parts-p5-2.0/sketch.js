/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates segmenting a person by body parts with ml5.bodySegmentation.
 */

let bodySegmentation;
let video;
let segmentation;

let options = {
  maskType: "parts",
};

async function setup() {
  createCanvas(640, 480);

  bodySegmentation = await ml5.bodySegmentation("BodyPix", options);

  // Create the video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);
}

function draw() {
  background(255);
  image(video, 0, 0);
  if (segmentation) {
    let parts = bodySegmentation.getPartsId();
    let gridSize = 10;
    for (let x = 0; x < video.width; x += gridSize) {
      for (let y = 0; y < video.height; y += gridSize) {
        if (segmentation.data[y * video.width + x] == parts.TORSO_FRONT) {
          fill(255, 0, 0);
          noStroke();
          circle(x, y, gridSize);
        }
      }
    }
  }
}

// callback function for body segmentation
function gotResults(result) {
  segmentation = result;
}
