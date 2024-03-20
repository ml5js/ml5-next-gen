// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Sound classification using Google's Teachable Machine and p5.js
Create your own custom model with Google's Teachable Machine! https://teachablemachine.withgoogle.com/
This example uses a callback pattern to create the classifier
=== */

// Initialize a sound classifier method with SpeechCommands18w model. A callback needs to be passed.
let classifier;

// Variable for holding the results of the classification
let predictedSound = "";

// Link to custom Teachable Machine model
const modelJson = "https://teachablemachine.withgoogle.com/models/FvsFiSwHW/";

function preload() {
  // Load Teachable Machine model
  classifier = ml5.soundClassifier(modelJson);
}

function setup() {
  createCanvas(650, 450);
  textAlign(CENTER, CENTER);
  textSize(32);

  // Classify the sound from microphone in real time
  classifier.classify(gotResult);
}

function draw() {
  background(250);

  // Update canvas according to classification results
  if (predictedSound == "Background Noise" || predictedSound == "") {
    fill(0);
    textSize(64);
    text("clap 👏 or whistle 🎵 ", width / 2, height / 2);
  } else if (predictedSound == "Clap") {
    background(231, 176, 255);
    textSize(128);
    text("👏", width / 2, height / 2);
  } else if (predictedSound == "whistle") {
    background(255, 242, 143);
    textSize(128);
    text("🎵", width / 2, height / 2);
  }
}

// A function to run when we get any errors and the results
function gotResult(results) {
  // The results are in an array ordered by confidence.
  console.log(results);
  // Store the first label
  predictedSound = results[0].label;
}
