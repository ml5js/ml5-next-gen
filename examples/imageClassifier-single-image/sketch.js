/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
* This example demonstrates image classification with ml5.imageClassifier.
* Try this example with the transformer model "ViTBase", which is trained to recognize the same 1,000 ImageNet labels as MobileNet.
 */

// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;

// Variables for displaying the results on the canvas
let label = "";
let confidence = "";

async function setup() {
  // Initialize the classifier and load the image asynchronously
  // Try with a transformer model Replace "MobileNet" -> "ViTBase"
  classifier = await ml5.imageClassifier("MobileNet");
  img = await loadImage("images/bird.jpg");

  createCanvas(400, 400);

  // Classify the image and display it
  classifier.classify(img, gotResult);
  image(img, 0, 0, width, height);
}

// Callback function for when classification has finished
function gotResult(results) {
  // The results are in an array ordered by confidence
  console.log(results);

  // Display the results on the canvas
  fill(255);
  stroke(0);
  textSize(18);
  label = "Label: " + results[0].label;
  confidence = "Confidence: " + nf(results[0].confidence, 0, 2);
  text(label, 10, 360);
  text(confidence, 10, 380);
}
