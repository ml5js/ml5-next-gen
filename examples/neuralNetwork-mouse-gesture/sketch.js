/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates training a mouse gesture classifier with ml5.neuralNetwork.
 */

// Step 1: load data or create some data
let data = [
  { x: 0.99, y: 0.02, label: "right" },
  { x: 0.76, y: -0.1, label: "right" },
  { x: -1.0, y: 0.12, label: "left" },
  { x: -0.9, y: -0.1, label: "left" },
  { x: 0.02, y: 0.98, label: "down" },
  { x: -0.2, y: 0.75, label: "down" },
  { x: 0.01, y: -0.9, label: "up" },
  { x: -0.1, y: -0.8, label: "up" },
];

let classifer;
let label = "training";

let start, end;

function setup() {
  createCanvas(640, 240);
  // For this example to work across all browsers
  // "webgl" or "cpu" needs to be set as the backend
  ml5.setBackend("webgl");

  // Step 2: set your neural network options
  let options = {
    task: "classification",
    debug: true,
  };

  // Step 3: initialize your neural network
  classifier = ml5.neuralNetwork(options);

  // Step 4: add data to the neural network
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let inputs = [item.x, item.y];
    let outputs = [item.label];
    classifier.addData(inputs, outputs);
  }

  // Step 5: normalize your data;
  classifier.normalizeData();

  // Step 6: train your neural network
  classifier.train({ epochs: 100 }, finishedTraining);
}
// Step 7: use the trained model
function finishedTraining() {
  label = "ready";
}

// Step 8: make a classification

function draw() {
  background(200);
  textAlign(CENTER, CENTER);
  textSize(64);
  text(label, width / 2, height / 2);
  if (start && end) {
    strokeWeight(8);
    line(start.x, start.y, end.x, end.y);
  }
}

function mousePressed() {
  start = createVector(mouseX, mouseY);
  end = createVector(mouseX, mouseY);
}

function mouseDragged() {
  end = createVector(mouseX, mouseY);
}

function mouseReleased() {
  let dir = p5.Vector.sub(end, start);
  dir.normalize();
  let inputs = [dir.x, dir.y];
  console.log(inputs);
  classifier.classify(inputs, gotResults);
}

// Step 9: define a function to handle the results of your classification
function gotResults(results) {
  label = results[0].label;
  console.log(results);
}
