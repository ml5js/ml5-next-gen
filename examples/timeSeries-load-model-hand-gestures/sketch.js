/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates loading a Sign Language classifier through ml5.TimeSeries.
 */

// change this to make the recording longer
const seqlength = 50;


let handPose;
let video;
let hands = [];
let sequence = [];
let recording_finished = false;
let predicted_word = ''

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  // create video capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  ml5.setBackend('webgl')

  handPose.detectStart(video, gotHands);
  
  let options = {
    task: 'classification',
    dataModality: 'spatial',
  };
  
  model = ml5.timeSeries(options);

  // setup the model files to load
  const modelDetails = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };

  // load the model and call modelLoaded once finished
  model.load(modelDetails, modelLoaded);
}
// call back for load model
function modelLoaded(){
  console.log('model loaded!')
}

function draw() {
  // draw video on the canvas
  image(video, 0, 0, width, height);
  
  // put the text on screen after a prediction
  placePredictedText()

  // if hands are found then start recording
  if(hands.length>0 && recording_finished == false){
    if (sequence.length <= seqlength){
      // get coordinates from hands (21 points)
      handpoints = drawPoints();
      sequence.push(handpoints);

    // once sequence reaches the seqlength, add sequence as just one X value
    } else if (sequence.length>0){
      // classify based on the collected data
      model.classify(sequence, gotResults);
      
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

// draw the points on the hands
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

// call back for accessing the results
function gotResults(results){
  predicted_word = results[0].label
  console.log(predicted_word)
  text(predicted_word, 100,100)
}

// for drawing text on screen
function placePredictedText(){
  textSize(100)
  fill(255)
  text(predicted_word, 100, height/2)
}