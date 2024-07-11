let model;
let targetLabel = 'C';

let state = 'collection';

let notes = {
  C: 261.6256,
  D: 293.6648,
  E: 329.6276
}

let env,wave;

function setup() {
  createCanvas(400, 400);
  ml5.setBackend('webgl')



  let options = {
    inputs: ['x', 'y'],
    outputs: ['label'],
    task: 'classification',
    debug: 'true'
  };
  model = ml5.timeSeries(options);
  background(255);
}

function keyPressed() {

  if (key == 't') {
    state = 'training';
    console.log('starting training');
    model.normalizeData();
    let options = {
      epochs: 200
    }
    model.train(options, whileTraining, finishedTraining);
  } else {
    targetLabel = key.toUpperCase();
  }
}

function whileTraining(epoch, loss) {
  console.log(epoch);
}

function finishedTraining() {
  console.log('finished training.');
  state = 'prediction';
}


function mousePressed() {

  let inputs = {
    x: mouseX,
    y: mouseY
  }

  if (state == 'collection') {
    let target = {
      label: targetLabel
    }
    model.addData(inputs, target);
    console.log('yeah')
    stroke(0);
    noFill();
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(targetLabel, mouseX, mouseY);
    
  } else if (state == 'prediction') {
    model.classify(inputs, gotResults);

  }

}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  console.log(results);
  stroke(0);
  fill(0, 0, 255, 100);
  ellipse(mouseX, mouseY, 24);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  let label = results[0].label;
  text(label, mouseX, mouseY);
}