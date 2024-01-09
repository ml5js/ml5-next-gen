let classifier;
let img;
let result;
let probability;

function preload() {
  img = loadImage('images/bird.jpg');
  classifier = ml5.imageClassifier('MobileNet');
}

function setup() {
  createCanvas(400, 400);
  image(img, 0, 0, width, height);
  classifyImage();
}

async function classifyImage() {
  try {

    const results = await classifier.classify(img);

    console.log(results);
    
    createDiv('Label: ' + results[0].label);
    createDiv('Confidence: ' + nf(results[0].confidence, 0, 2));

  } catch (error) {
    // Handle any errors that occurred during classification
    console.error(error);
  }
}