// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam video classification using MobileNet and p5.js
This example uses a callback function to display the results
=== */

// A variable to initialize the Image Classifier
let classifier;

// A variable to hold the video we want to classify
let vid;

// Element for displaying the results
let resultsP;

function preload() {
  classifier = ml5.imageClassifier('MobileNet');
}

function setup() {
  noCanvas();
  // Using webcam feed as video input
  vid = createCapture(VIDEO);
  classifier.classifyStart(vid, gotResult);
  resultsP = createP("Model loading...");
}

// A function to run when we get any errors and the results
function gotResult(results, error) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);
  resultsP.html(`Label: ${results[0].label  } ${nf(results[0].confidence, 0, 2)}`);
}
