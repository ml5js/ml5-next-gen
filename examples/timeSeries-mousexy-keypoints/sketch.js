// https://editor.p5js.org/gohai/sketches/_KdpDSQzH

let model;

let curr_shape = 'None, press a button below'

let state = 'collection';
let pressedOnce = true;


let rec_duration = 2;
let num_seq = 20;
// assuming frameRate is 60, with record time of 2 seconds, there will be 120 datapoints total, which is huge! we use map to get 20 data points instead of 120

let count = 0;


let sequence = [];

function setup() {
  ml5.setBackend('webgl')
  let options = {
    inputs: ['x', 'y'],
    outputs: ['label'],
    task: 'classification',
    debug: 'true',
    learningRate: 0.5
  };
  model = ml5.timeSeries(options);
  createCanvas(600, 400);
  background(220);
  UI();
  frameRate(60);
  
}

function draw() {
  let datapoints = map(count,0,rec_duration*num_seq, 0,num_seq)
  
  if (mouseIsPressed && pressedOnce){
    
    line(pmouseX, pmouseY, mouseX,mouseY);
    let inputs = {x: mouseX,y: mouseY};
    count++;
    
    if (datapoints % 1 == 0){
        // sequence.push(inputs);
        sequence.push(inputs);
    } 
    
    if (sequence.length == num_seq){
      
      
      pressedOnce = false;
      count = 0
      
      if (state == 'collection'){
        let target = {label: curr_shape};
        background(220);
        text("Recording: " + curr_shape, 50,50);
        // console.log(sequence, target)
        options = {inputLabels:['x','y']}
        model.addData(sequence, target, options);
      } else if (state == 'prediction'){
        background(220);
        model.classify(sequence, gotResults)
      } else if (state == 'training') {
        background(220);
        text("You cannot record while training");
      }

      sequence = [];
    }
  } 
}

function gotResults(results) {
  // if (error) {
  //   console.log(error);
  // }
  // console.log('hello', results);
  stroke(0);
  fill(0, 0, 255, 100);
  let label = results[0].label;
  text("Prediction: " + label, 50,50);
  // let label = error[0].label;

}

function keyPressed(){
  if (key == 's') {
    model.saveData('trial');
  } else if (key == 'd'){
    console.log(model.getData());
  }
}

function mouseReleased(){
  pressedOnce = true;
}

function UI(){
  
  textSize(20)
  
  rec_circle = createButton('Record Circle');
  rec_circle.mouseClicked(recordCircle);
  rec_circle.style("font-family", "Georgia");
  rec_circle.style("font-size", "20px");
  
  rec_square = createButton('Record Square');
  rec_square.mouseClicked(recordSquare);
  rec_square.style("font-family", "Georgia");
  rec_square.style("font-size", "20px");
  
  train_but = createButton('Train Model');
  train_but.mouseClicked(trainModel);
  train_but.style("font-family", "Georgia");
  train_but.style("font-size", "20px");
  
  pred_sha = createButton('Predict Shape');
  pred_sha.mouseClicked(predictShape);
  pred_sha.style("font-family", "Georgia");
  pred_sha.style("font-size", "20px");
  
  function recordCircle(){
    background(220);
    state = 'collection'
    curr_shape = 'Circle'
    text("Recording: Circle", 50,50);
    rec_circle.style("background-color",'#f0f0f0')
    rec_square.style('background-color', '');
    pred_sha.style('background-color', '');
  }

  function recordSquare(){
    background(220);
    state = 'collection'
    curr_shape = 'Square'
    text("Recording: Square", 50,50);
    rec_square.style("background-color",'#f0f0f0')
    rec_circle.style('background-color', '');
    pred_sha.style('background-color', '');
  }

  function trainModel(){
    model.createArchitecture();
    model.compileModel();
    model.summarizeModel();
    background(220);
    state = 'training';
    text("Training...", 50,50);
    model.normalizeData();
    let options = {
      epochs: 100
    }
    model.train(options,whileTraining,finishedTraining);
  }
  
  function whileTraining(epoch, loss) {
    console.log(epoch);
  }
  
  function finishedTraining() {
    console.log('finished training.');
    state = 'prediction';
  }

  function predictShape(){
    background(220);
    state = 'prediction'
    text("Predicting Shape...", 50,50);
    pred_sha.style("background-color",'#f0f0f0')
    rec_square.style('background-color', '');
    rec_circle.style('background-color', '');


  }
}

