
let handPose;
let video;
let hands = [];
let sequence = [];
const seqlength = 50;
let recording_finished = false;

function preload() {
  ml5.setBackend('webgl')
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);
  
  let options = {
    outputs: ['label'],
    task: 'classification',
    debug: 'true',
    learningRate: 0.005,
    dataUrl: "http://127.0.0.1:5500/2024-8-5_13-43-10.json",
  };
  
  model = ml5.timeSeries(options);
  
  nameField = createInput('')
  nameField.attribute('placeholder', 'word to train')
  nameField.position(100, 100)
  nameField.size(250)
}

function draw() {

  image(video, 0, 0, width, height);
  
  
  if(hands.length>0 && recording_finished == false){
    if (sequence.length <= seqlength){
      handpoints = drawPoints();
      sequence.push(handpoints);
    } else if (sequence.length>0){
      recording_finished = true;
      
      let word = nameField.value()

      if (word.length > 0){
        let target = {label:word}
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
    model.save();
  }
  if (key == 'z'){
    model.saveData();
  }

  if (key == 't'){
    model.normalizeData();
    let options = {
      epochs: 20
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
  console.log(results)
}