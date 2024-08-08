/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates training a color classifier through ml5.neuralNetwork.
 */

const seqlength = 50;

let handPose;
let video;

let hands = [];
let sequence = [];

let recording_finished = false;
let predicted_word = '';

// UI variables
let training_words = {};


function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  // setup video capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // place UI elements
  UI();

  // set backend as either webgl or cpu
  ml5.setBackend('webgl')

  // use handpose model on video
  handPose.detectStart(video, gotHands);
  
  // setup the timeseries neural network
  let options = {
    outputs: ['label'],
    task: 'classification',
    dataModality: 'spatial',
    debug: 'true',
    learningRate: 0.001,
  };
  model = ml5.timeSeries(options);

}

function draw() {
  // draw video on frame
  image(video, 0, 0, width, height);
  
  drawPredictedWord();

  // if hands are found then start recording
  if(hands.length>0 && recording_finished == false){
    if (sequence.length <= seqlength){
      // get coordinates from hands (21 points)
      handpoints = drawPoints();
      sequence.push(handpoints);

    // once sequence reaches the seqlength, add sequence as just one X value
    } else if (sequence.length>0){
      // get the training word from the input box
      let train_word = nameField.value()

      // if there is a word currently in the box then add data with that label
      if (train_word.length > 0){
        // add data to the model
        let target = {label:train_word}
        model.addData(sequence, target);
        trainingWordsUpdate()

      // if there is no word in the box then classify instead
      } else {
        // classify the data
        model.classify(sequence, gotResults);
      }

      // reset the sequence
      sequence = [];
      recording_finished = true;
    }

  // can only record again when hand is out of frame
  } else {
    if (hands.length == 0){
      recording_finished = false;
    }
  }
}

function drawPoints(){
  let handpoints = []
  // iterate through both hands
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      // access the keypoints in the hand
      let keypoint = hand.keypoints[j];
      handpoints.push(keypoint.x,keypoint.y)

      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
    }
  }
  // assign to a different variable before clearing
  const output = handpoints;
  handpoints = []; 
  
  return output;
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

function trainModelAndSave(){
  model.normalizeData();
  let options = {
    epochs: 100
  }
  model.train(options,whileTraining,finishedTraining);
  nameField.value('')
}

function whileTraining(epoch) {
  console.log(epoch);
}

function finishedTraining() {
  console.log('finished training.');
  model.save('model');
}

function gotResults(results){
  predicted_word = results[0].label
  console.log(predicted_word)
  text(predicted_word, 200,200)
}

function UI(){
  nameField = createInput('')
  nameField.attribute('placeholder', 'Type the word to train')
  nameField.position(110, 500)
  nameField.size(250)

  instructionP = createP(
    'I want to train: <br><br> 1.) Type any word you want to pair with a gesture, e.g. "HELLO" <br> 2.) Do the gesture associated to the word, make sure to do it until the points disappear. <br> 3.) Move your hand out of the frame and repeat the gesture, do this multiple times <br> 4.) Do the same for other words e.g. "BYE" <br> 5.) Once all data is collected, press Train and Save<br><br> Tip: have at least 5 datasets for each word'
  );
  instructionP.style("width", "640px");
  dataCountsP = createP(
    "-> After the gesture a tally will appear here <-"
  );

  train_but = createButton('Train and Save');
  train_but.mouseClicked(trainModelAndSave);
  train_but.style("font-family", "Georgia");
  train_but.style("font-size", "20px");
  train_but.position(500, 490)
}

function drawPredictedWord(){
  textSize(100)
  fill(255)
  text(predicted_word, 100, height/2)
}

function trainingWordsUpdate(){
  let temp_word = nameField.value();
  console.log(Object.keys(training_words));
  if (!(temp_word in training_words)){
    training_words[temp_word] = 1;
    console.log('here')
  } else {
    console.log(training_words[temp_word])
    training_words[temp_word]++;
  }
  let counts = ''
  let keys = Object.keys(training_words)
  keys.forEach(element => {
   counts += element + ' : ' + training_words[element] + "<br>"
  });
  dataCountsP.html(
    counts
  );

}