let featureExtractor;
let classifier;
let video;
let label = "";
let penButton;
let phoneButton;
let trainButton;
let penCount = 0;
let cupCount = 0;

function modelReady() {
  console.log("Model is ready!");
}

function videoReady() {
  console.log("The video is ready!");
}

function classifyVideo() {
  classifier.classify(gotResults);
}

function gotResults(results) {
  label = results[0].label + " (" + nf(results[0].confidence, 0, 2) + ")";
  classifyVideo();
}

function setup() {
  createCanvas(640, 540);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  // Initialize the feature extractor
  featureExtractor = ml5.featureExtractor({ epochs: 100 }, modelReady);
  // Create a new classifier using those features and with a video element
  classifier = featureExtractor.classification(video, videoReady);

  penButton = createButton("pen");
  penButton.mousePressed(function () {
    classifier.addImage("pen");
    penCount++;
    console.log("Pen samples: " + penCount);
  });

  phoneButton = createButton("phone");
  phoneButton.mousePressed(function () {
    classifier.addImage("phone");
    cupCount++;
    console.log("Phone samples: " + cupCount);
  });

  trainButton = createButton("train");
  trainButton.mousePressed(function () {
    classifier.train().then(function () {
      console.log("Starting classification...");
      classifyVideo();
    });
  });
}

function draw() {
  background(0);
  // Draw the video
  image(video, 0, 0, 640, 500);
  // Draw the label
  fill(255);
  textSize(16);
  text(label, 10, height - 10);
}