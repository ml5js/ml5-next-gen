/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates how to train your own mouse gesture classifier
 * through ml5.neuralNetwork with the sequenceClassificationWithCNN task.
 */

let model;

let state = "training";
let curShape = "circle";
let sequence = [];
let sequenceLength = 30;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvasDiv");

  let options = {
    inputs: ["x", "y"],
    outputs: ["label"],
    task: "sequenceClassificationWithCNN",
    debug: true,
    learningRate: 0.005, // smaller learning rate converged better
  };
  model = ml5.neuralNetwork(options);

  select("#collCirclesBtn").mouseClicked(collectCircles);
  select("#collSquaresBtn").mouseClicked(collectSquares);
  select("#trainBtn").mouseClicked(trainModel);
}

function draw() {
  background(220);

  for (let i = 0; i < sequence.length - 1; i++) {
    line(sequence[i].x, sequence[i].y, sequence[i + 1].x, sequence[i + 1].y);
  }

  // Sequence will have varying length at this point, depending on
  // how long the hands were in frame - a line simplification algorithm
  // (RDP) turns it into the fixed length the NN can work with.
  // For more information about RDP, see:
  // https://www.youtube.com/watch?v=ZCXkvwLxBrA

  let rdp = model.setFixedLength(sequence, sequenceLength);
  for (let i = 0; i < rdp.length; i++) {
    fill(255);
    rect(rdp[i].x - 3, rdp[i].y - 3, 6, 6);
  }

  // display current state
  textSize(16);
  fill(0);
  if (state == "training") {
    text("Now collecting " + curShape + "s", 50, 50);
  } else if (state == "predicting" && curShape == null) {
    text("Training finished. Draw again to predict.", 50, 50);
  } else if (state == "predicting") {
    text("Saw a " + curShape, 50, 50);
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    sequence.push({ x: mouseX, y: mouseY });
  }
}

function mouseDragged() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    sequence.push({ x: mouseX, y: mouseY });
  }
}

function mouseReleased() {
  if (sequence.length == 0) return;

  if (state == "training") {
    let inputs = model.setFixedLength(sequence, sequenceLength);
    let outputs = { label: curShape };
    model.addData(inputs, outputs);
  } else if (state == "predicting") {
    let inputs = model.setFixedLength(sequence, sequenceLength);
    model.classify(inputs, gotResults);
  }
  // reset the sequence
  sequence = [];
}

function trainModel() {
  model.normalizeData();

  let options = {
    epochs: 40,
  };
  model.train(options, finishedTraining);

  select("#collCirclesBtn").attribute("disabled", true);
  select("#collSquaresBtn").attribute("disabled", true);
  select("#trainBtn").attribute("disabled", true);
}

function finishedTraining() {
  state = "predicting";
  curShape = null;
}

function gotResults(results) {
  curShape = results[0].label;
}

function collectCircles() {
  curShape = "circle";
}

function collectSquares() {
  curShape = "square";
}
