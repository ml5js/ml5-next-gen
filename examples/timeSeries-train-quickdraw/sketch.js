/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates How to train your own quickdraw classifier through ml5.TimeSeries.
 */

let model;
let counts = {
  Circle_datacount:0,
  Square_datacount:0,
}
let curr_shape = 'Circle'
let state = 'collection';
let pressedOnce = true;
let frame_count = 0;
let datapoints;
let sequence = [];

// Training Data lenghts
let ink_multiplier = 3;
let num_seq = 20;

function setup() {
  // p5 js elements
  createCanvas(600, 400);
  background(220);
  UI();

  // set framerate to constant rate for constant data collection
  frameRate(60);

  // set the backend to either webgl or cpu
  ml5.setBackend('webgl');

  // set the options to initialize timeSeries Neural Network
  let options = {
    inputs: ['x','y'],
    outputs: ['label'],
    task: 'classification',
    dataModality: 'spatial',
    debug: 'true',
    learningRate: 0.005
  };

  model = ml5.timeSeries(options);
}

function draw() {
  // record data when the mouse is pressed inside the canvas
  if (mouseIsPressed && pressedOnce && mouseY<400 && mouseX<600){
    
    // draw lines through coordinates
    line(pmouseX, pmouseY, mouseX,mouseY);

    frame_count++;

    let inputs = {x: mouseX,y: mouseY};
    sequence.push(inputs);
    
    if (sequence.length == num_seq*ink_multiplier){
      pressedOnce = false;
      frame_count = 0
      
      // if state is collection, add whole sequence as X, and shape as Y
      if (state == 'collection'){
        let target = {label: curr_shape};
        model.addData(sequence, target);

        // add to the count for each
        counts[`${curr_shape}_datacount`] += 1;
        updateDataCountUI()
        
        // reset the screen
        background(220);
        textSize(20)
        fill(0);
        text("Recording: " + curr_shape, 50,50);
      // if prediction, classify using the whole sequence
      } else if (state == 'prediction'){
        model.classify(sequence, gotResults)

        background(220);
      }

      // reset the sequence 
      sequence = [];
    }
  } 
  inkBar();
}

function trainModel(){
  // normalize Data first before Training
  model.normalizeData();

  // set the number of epochs for training
  let options = {
    epochs: 40,
  }
  model.train(options,whileTraining,finishedTraining);

  background(220);
  state = 'training';
  text("Training...", 50,50);
  rec_circle.style('background-color', '');
  rec_square.style("background-color",'');
  train_but.style('background-color', '#f0f0f0');
}

function whileTraining(epoch, loss) {
  console.log(epoch);
}

function finishedTraining() {
  background(220)
  text("Training Finished, Draw again to predict", 50,50);
  state = 'prediction';
}

function gotResults(results) {
  const label = results[0].label;

  fill(0);
  text("Prediction: " + label, 50,50);
}

// code to signify drawing can be done again
function mouseReleased(){
  pressedOnce = true;
}

////////////// UI Elements ////////////

// code to visualize how much ink left
function inkBar(){
  datapoints = map(frame_count,0,ink_multiplier*num_seq, 0,num_seq)

  bar_height = 250
  height_miltiplier = bar_height/num_seq
  push()
  fill(0)
  textSize(15)
  text('Ink:', 550,90)
  rect(550,100,25,num_seq*height_miltiplier)
  fill(255)
  rect(550,100,25,datapoints*height_miltiplier)
  pop()
}

// code for UI elements such as buttons
function UI(){
  textSize(20)

  rec_circle = createButton('Record Circle');
  rec_circle.mouseClicked(recordCircle);
  rec_circle.style("font-family", "Georgia");
  rec_circle.style("font-size", "20px");
  rec_circle.style("background-color",'#f0f0f0');
  
  rec_square = createButton('Record Square');
  rec_square.mouseClicked(recordSquare);
  rec_square.style("font-family", "Georgia");
  rec_square.style("font-size", "20px");
  
  train_but = createButton('Train and Predict');
  train_but.mouseClicked(trainModel);
  train_but.style("font-family", "Georgia");
  train_but.style("font-size", "20px");
  
  function recordCircle(){
    state = 'collection';
    curr_shape = 'Circle';

    background(220);
    text("Recording: Circle", 50,50);
    rec_circle.style("background-color",'#f0f0f0');
    rec_square.style('background-color', '');
    train_but.style('background-color', '');
  }

  function recordSquare(){
    state = 'collection';
    curr_shape = 'Square';

    background(220);
    text("Recording: Square", 50,50);
    rec_circle.style('background-color', '');
    rec_square.style("background-color",'#f0f0f0');
    train_but.style('background-color', '');
  }

  instructionP = createP(
    'Instructions: <br> 1.) Press the "Record Circle" or "Record Square" and start drawing until the ink runs out <br> 2.) Draw multiple times for each shape<br>2.) Press "Train" and wait for training to finish <br> 3.) Draw again to predict drawn shape <br><br> Tip: Collect at least 5 drawings for each:'
  );
  instructionP.style("width", "640px");
  dataCountsP = createP(
    "circle data: " +
      counts.Circle_datacount +
      "<br>square data: " +
      counts.Square_datacount
  );
}

// Update the HTML UI with the current data counts
function updateDataCountUI() {
  dataCountsP.html(
    "circle data: " +
      counts.Circle_datacount +
      "<br>square data: " +
      counts.Square_datacount
  );
}

function keyPressed(){
  if (key == 's'){

    model.save('hello');
  }
}
