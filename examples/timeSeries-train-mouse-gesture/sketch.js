/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates How to train your own mouse gesture classifier through ml5.TimeSeries.
 */

let model;
let counts = {
  circleDataCount: 0,
  squareDataCount: 0,
};
let currShape = "circle";
let state = "collection";

let pressedOnce = true;
let frameCount = 0;
let datapoints;
let sequence = [];
let recCircle, recSquare, trainBut;

// Training Data lenghts
let ink_multiplier = 3;
let num_seq = 20;

function preload() {
  let options = {
    inputs: ["x", "y"],
    outputs: ["label"],
    task: "classification",
    spatialData: "true",
    debug: "true",
    learningRate: 0.005,
  };

  model = ml5.timeSeries(options);
}

function setup() {
  // p5 js elements
  let canvas = createCanvas(600, 400);
  canvas.parent("canvasDiv");
  background(220);
  UI();

  // set framerate to constant rate for constant data collection
  frameRate(60);
}

function draw() {
  // record data when the mouse is pressed inside the canvas
  if (mouseIsPressed && pressedOnce && mouseY < 400 && mouseX < 600) {
    // draw lines through coordinates
    line(pmouseX, pmouseY, mouseX, mouseY);

    frameCount++;

    let inputs = { x: mouseX, y: mouseY };
    sequence.push(inputs);

    if (sequence.length == num_seq * ink_multiplier) {
      pressedOnce = false;
      frameCount = 0;

      // if state is collection, add whole sequence as X, and shape as Y
      if (state == "collection") {
        let target = { label: currShape };
        model.addData(sequence, target);

        // add to the count for each
        counts[currShape + "DataCount"] += 1;
        console.log(counts);
        updateDataCountUI();

        // reset the screen
        background(220);
        textSize(20);
        fill(0);
        text("Recording: " + currShape, 50, 50);
        // if prediction, classify using the whole sequence
      } else if (state == "prediction") {
        model.classify(sequence, gotResults);

        background(220);
      }

      // reset the sequence
      sequence = [];
    }
  }
  inkBar();
}

function trainModel() {
  // normalize Data first before Training
  model.normalizeData();

  // set the number of epochs for training
  let options = {
    epochs: 40,
  };
  model.train(options, whileTraining, finishedTraining);

  background(220);
  state = "training";
  text("Training...", 50, 50);
  recCircle.style("background-color", "");
  recSquare.style("background-color", "");
  trainBut.style("background-color", "#f0f0f0");
}

function whileTraining(epoch, loss) {
  console.log(epoch);
}

function finishedTraining() {
  background(220);
  text("Training Finished, Draw again to predict", 50, 50);
  state = "prediction";
}

function gotResults(results) {
  let label = results[0].label;

  fill(0);
  text("Prediction: " + label, 50, 50);
}

// code to signify drawing can be done again
function mouseReleased() {
  pressedOnce = true;
}

////////////// UI Elements ////////////

// code to visualize how much ink left
function inkBar() {
  datapoints = map(frameCount, 0, ink_multiplier * num_seq, 0, num_seq);

  bar_height = 250;
  height_miltiplier = bar_height / num_seq;
  push();
  fill(0);
  textSize(15);
  text("Ink:", 550, 90);
  rect(550, 100, 25, num_seq * height_miltiplier);
  fill(255);
  rect(550, 100, 25, datapoints * height_miltiplier);
  pop();
}

// code for UI elements such as buttons
function UI() {
  textSize(20);

  recCircle = select("#recCircle");
  recSquare = select("#recSquare");
  trainBut = select("#trainBut");

  recCircle.mouseClicked(recordCircle);
  recCircle.style("background-color", "#f0f0f0");
  recSquare.mouseClicked(recordSquare);
  trainBut.mouseClicked(trainModel);

  function recordCircle() {
    state = "collection";
    currShape = "circle";

    background(220);
    text("Recording: circle", 50, 50);
    recCircle.style("background-color", "#f0f0f0");
    recSquare.style("background-color", "");
    trainBut.style("background-color", "");
  }

  function recordSquare() {
    state = "collection";
    currShape = "square";

    background(220);
    text("Recording: square", 50, 50);
    recCircle.style("background-color", "");
    recSquare.style("background-color", "#f0f0f0");
    trainBut.style("background-color", "");
  }
  dataCountsP = createP(
    "circle data: " +
      counts.circleDataCount +
      "<br>square data: " +
      counts.squareDataCount
  );
}

// Update the HTML UI with the current data counts
function updateDataCountUI() {
  dataCountsP.html(
    "circle data: " +
      counts.circleDataCount +
      "<br>square data: " +
      counts.squareDataCount
  );
}
