/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates training a color classifier through ml5.neuralNetwork.
 */

let handPose;
let video;
let hands = [];
let sequence = [];
const seqlength = 50;
let recording_finished = false;
let predicted_word = ''

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  ml5.setBackend('webgl')

  handPose.detectStart(video, gotHands);
  
  let options = {
    outputs: ['label'],
    task: 'classification',
    debug: 'true',
    learningRate: 0.001, 
  };
  
  model = ml5.timeSeries(options);

  const modelDetails = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };
  model.load(modelDetails, modelLoaded);
  
  nameField = createInput('')
  nameField.attribute('placeholder', 'word to train')
  nameField.position(100, 100)
  nameField.size(250)
}

function modelLoaded(){
  console.log('model loaded!')
}

function draw() {
  

  image(video, 0, 0, width, height);
  
  textSize(100)
  fill(255)
  text(predicted_word, 100, height/2)

  if(hands.length>0 && recording_finished == false){
    if (sequence.length <= seqlength){
      handpoints = drawPoints();
      sequence.push(handpoints);
    } else if (sequence.length>0){
      recording_finished = true;
      
      let word = nameField.value()

      if (word.length > 0){
        let target = {label:word}
        console.log(sequence, target);
        model.addData(sequence, target);
      } else {
        model.classify(sequence, gotResults);
      }
      
      sequence = [];
    }
  } else {
    if (hands.length == 0){
      recording_finished = false;
    }
  }
}

function drawPoints(){
  let handpoints = []
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
      handpoints.push(keypoint.x,keypoint.y)
    }
  }
  const output = handpoints;
  handpoints = []; return output;
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

function keyPressed(){
  if (key == 's'){
    model.save('hello');
  }
  if (key == 'z'){
    model.saveData();
  }

  if (key == 't'){
    model.normalizeData();
    let options = {
      epochs: 100
    }
    model.train(options,whileTraining,finishedTraining);
  }
}

function whileTraining(epoch, loss) {
  console.log(epoch);
}

function finishedTraining() {
  console.log('finished training.');
}

function gotResults(results){
  predicted_word = results[0].label
  console.log(predicted_word)
  text(predicted_word, 200,200)
}