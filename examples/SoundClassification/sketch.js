// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Sound classification using SpeechCommands18w and p5.js
This example uses a callback pattern to create the classifier
=== */

// Initialize a sound classifier method with SpeechCommands18w model. A callback needs to be passed.
let classifier;
// Options for the SpeechCommands18w model, the default probabilityThreshold is 0
const options = { probabilityThreshold: 0.7 };

// Array containing the 18 words of SpeechCommands18w
let words = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "up",
  "down",
  "left",
  "right",
  "go",
  "stop",
  "yes",
  "no",
];

// Variable for displaying the results on the canvas
let predictedWord = "";

function preload() {
  // Load SpeechCommands18w sound classifier model
  classifier = ml5.soundClassifier("SpeechCommands18w", options);
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
  // Call function for displaying background words
  displayWords();

  // Once the model outputs results start displaying the predicted word on the canvas
  if (predictedWord !== "") {
    fill(211, 107, 255);
    textSize(64);
    text(predictedWord, width / 2, 90);
  }
}

//Function to display the 18 words on the canvas
function displayWords() {
  textSize(32);

  fill(96);
  text("Speak one of the words into your microphone", width / 2, 40);

  let x = 125;
  let y = 150;
  //Words appear in 3 columns of 6 rows
  for (let i = 0; i < words.length; i++) {
    fill(158);
    text(words[i], x, y);
    y += 50;
    if ((i + 1) % 6 === 0) {
      x += 200;
      y = 150;
    }
  }
}

// A function to run when we get any errors and the results
function gotResult(results) {
  // The results are in an array ordered by confidence
  console.log(results);
  // Load the first label to the text variable displayed on the canvas
  predictedWord = results[0].label;
}
