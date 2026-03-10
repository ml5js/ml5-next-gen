let feClassifier;
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

function classifyVideo() {
  feClassifier.classify(gotResults);
}

function gotResults(results) {
  label = results[0].label + " (" + nf(results[0].confidence, 0, 2) + ")";
  classifyVideo();
}

function preload() {
  feClassifier = ml5.featureExtractor({ task: 'classification' }, modelReady);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  // Set the video as the input for the Classifier
  feClassifier.video = video;

  penButton = createButton("pen");
  penButton.mousePressed(function () {
    feClassifier.addImage("pen");
    penCount++;
    console.log("Pen samples: " + penCount);
  });

  phoneButton = createButton("phone");
  phoneButton.mousePressed(function () {
    feClassifier.addImage("phone");
    cupCount++;
    console.log("Phone samples: " + cupCount);
  });

  trainButton = createButton("train");
  trainButton.mousePressed(function () {
    feClassifier.train({ epochs: 100, debug: true }, function () {
      console.log("Starting classification...");
      classifyVideo();
    });
  });
}

function draw() {
  background(0);

  // Draw the video (flipped horizontally)
  push();
  translate(640, 0);
  scale(-1, 1);
  image(video, 0, 0, 640, 450);
  pop();

  // Draw the label
  fill(255);
  textSize(16);
  text(label, 10, height - 10);
}
