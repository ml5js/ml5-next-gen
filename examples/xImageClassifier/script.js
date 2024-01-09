// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* ===
ml5 Example
Simple Image Classification using MobileNet
This example uses promises to create the classifier
=== */

const image = document.getElementById('vid'); // The image we want to classify
const result = document.getElementById('result'); // The result tag in the HTML
const probability = document.getElementById('probability'); // The probability tag in the HTML

let classifier;
let video;

// Initialize the Image Classifier method with MobileNet
// function preload() {
//   classifier = ml5.imageClassifier('MobileNet', video);
//   // img = loadImage('images/bird.jpg');
// }

function setup() {  
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  classifier = ml5.imageClassifier('MobileNet');
  classifier.classifyN(video);
  // image(image, 200, 0);
  console.log("elooo")
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);
  classifier.classify(image, gotResult);
  // createDiv(`Label: ${results[0].label}`);
  // createDiv(`Confidence: ${nf(results[0].confidence, 0, 2)}`);
}

// function mdlred() {
//   classifier.classifyN(video);//, gotResult);
// }

// ml5.imageClassifier('MobileNet', image)
//   .then(classifier => classifier.classify())
//   .then(results => {
//     result.innerText = results[0].label;
//     probability.innerText = results[0].confidence.toFixed(4);
//     console.log(results);
//     // createDiv(`Label: ${results[0].label}`);
//     // createDiv(`Confidence: ${nf(results[0].confidence, 0, 2)}`);
//   });
  // console.log('oea')

  // function getResults(){
  //   // console.log(results);
  //   classifier.classify(getResults)
  // }