/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates object detection on an image through ml5.objectDetector.
 */

let objectDetector;
let img;
let objects = [];

function preload() {
  // Load the image to be detected
  img = loadImage("objects.jpg");

  // trying to work around "WebGPU readSync is only available for CPU-resident tensors."
  // see https://github.com/ml5js/ml5-next-gen/issues/117
  ml5.setBackend("webgl");

  // Load the objectDetector model
  objectDetector = ml5.objectDetector();
}

function setup() {
  createCanvas(800, 800);
  // Draw the image
  image(img, 0, 0);
  // Detect objects in the image
  objectDetector.detect(img, gotObjects);
}

function draw() {
  // Draw the image
  image(img, 0, 0);

  // Loop through all the detected objects and draw bounding boxes with labels
  for (let i = 0; i < objects.length; i++) {
    let object = objects[i];
    let x = object.bbox[0];
    let y = object.bbox[1];
    let w = object.bbox[2];
    let h = object.bbox[3];

    stroke(object.color.r, object.color.g, object.color.b);
    noFill();

    // Draw the bounding box
    rect(x, y, w, h);

    // Draw the label with the class name
    noStroke();
    fill(object.color.r, object.color.g, object.color.b);
    textSize(16);
    text(object.class, x + 5, y + 15);
  }
}

// Callback function for when objectDetector outputs data
function gotObjects(results) {
  // Save the output to the objects variable and assign a random color to each object
  objects = results.map(object => {
    object.color = {
      r: random(255),
      g: random(255),
      b: random(255)
    };
    return object;
  });

  // Redraw canvas to update the bounding boxes
  redraw();
}
