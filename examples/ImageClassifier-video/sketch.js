// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam video classification using MobileNet and p5.js
This example uses a callback function to update the canvas label with the latest results,
it makes use of the p5 mousePressed() function to toggle between an active classification
=== */

// A variable to initialize the Image Classifier
let classifier;

// A variable to hold the video we want to classify
let vid;

// Variable for displaying the results on the canvas
let label = 'Model loading...';

function preload() {
  classifier = ml5.imageClassifier('MobileNet');
}

function setup() {
  createCanvas(640, 480);
  background(255);
  textSize(32);
  fill(255);
  // Using webcam feed as video input, hiding html element to avoid duplicate with canvas
  vid = createCapture(VIDEO);
  vid.hide();
  classifier.classifyStart(vid, gotResult);
}

function draw() {
  //Each video frame is painted on the canvas
  image(vid, 0, 0);
  //Printing class with the highest probability on the canvas
  text(label, 20, 50);
}

//A mouse click to stop and restart the classification process
function mousePressed(){
  if (classifier.isClassifying){
    classifier.classifyStop();
  }else{
    classifier.classifyStart(vid, gotResult);
  }
}

// A function to run when we get the results and any errors
function gotResult(results) {
  //update label variable which is displayed on the canvas
  label = results[0].label;
}