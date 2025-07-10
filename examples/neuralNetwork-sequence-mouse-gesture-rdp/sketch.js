/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates How to train your own mouse gesture classifier through ml5.neuralNetwork with sequeceClassification Task.
 */

let model;
let currShape = "circle";
let state = "collecting";

let sequence = [];
let targetLength = 30;

function preload() {
  let options = {
    inputs: ["x", "y"],
    outputs: ["label"],
    task: "sequenceClassificationConv",
    debug: true,
    learningRate: 0.005, // Learning rate decreased for better convergence
  };

  model = ml5.neuralNetwork(options);
}

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvasDiv");
  background(220);
  UI();
}

function draw() {
  // Record data when the mouse is pressed inside the canvas
  if (mouseIsPressed) {
    // Draw lines through coordinates
    line(pmouseX, pmouseY, mouseX, mouseY);
    let inputs = { x: mouseX, y: mouseY };
    sequence.push(inputs);
  }
}

// Code to signify drawing can be done again
function mouseReleased() {
  if (mouseY < height && mouseX < width) {
    // If state is collecting, add whole sequence as X, and shape as Y
    if (state == "collecting") {
      let target = { label: currShape };
      let paddedCoordinates = model.padCoordinates(sequence, targetLength);
      model.addData(paddedCoordinates, target);

      clearScreen();
    } else if (state == "prediction") {
      let paddedCoordinates = model.padCoordinates(sequence, targetLength);
      model.classify(paddedCoordinates, gotResults);
      clearScreen();
    }
  }
  // Reset the sequence
  sequence = [];
}

function trainModel() {
  // Normalize Data first before Training
  model.normalizeData();

  // Set the number of epochs for training
  let options = {
    epochs: 40,
  };
  model.train(options, finishedTraining);

  background(220);
  state = "training";
  text("Training...", 50, 50);

  recCircle.attribute("disabled", true);
  recSquare.attribute("disabled", true);
  trainBut.attribute("disabled", true);
}

function finishedTraining() {
  background(220);
  text("Training Finished, Draw again to predict", 50, 50);
  state = "prediction";
}

function gotResults(results) {
  let label = results[0].label;
  currShape = label;
}

// UI Elements
let recCircle, recSquare, trainBut;

function UI() {
  textSize(20);

  recCircle = select("#recCircle");
  recSquare = select("#recSquare");
  trainBut = select("#trainBut");

  recCircle.mouseClicked(recordCircle);
  recSquare.mouseClicked(recordSquare);
  trainBut.mouseClicked(trainModel);

  text(state + " : " + currShape, 50, 50);

  function recordCircle() {
    state = "collecting";
    currShape = "circle";

    background(220);
    text(state + " : " + currShape, 50, 50);
  }

  function recordSquare() {
    state = "collecting";
    currShape = "square";

    background(220);
    text(state + " : " + currShape, 50, 50);
  }
}

// Cleanup screen and removed drawn elements, add helpful text
function clearScreen() {
  background(220);
  textSize(20);
  fill(0);
  text(state + " : " + currShape, 50, 50);
}
