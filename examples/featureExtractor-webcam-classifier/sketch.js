let feClassifier;
let video;
let label = "";
let input1, input2;
let addButton1, addButton2;
let trainButton;
let count1 = 0;
let count2 = 0;

function modelReady() {
  console.log("Model is ready!");
}

function gotResults(results) {
  label = results[0].label + " (" + nf(results[0].confidence, 0, 2) + ")";
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


  // Create inputs and buttons for adding samples for two classes
  input1 = createInput("", "text");
  input1.attribute("placeholder", "Class 1");
  addButton1 = createButton("Add Sample");
  addButton1.mousePressed(function () {
    let className = input1.value() || "Class 1";
    feClassifier.addImage(className);
    count1++;
    console.log(className + " samples: " + count1);
  });

  input2 = createInput("", "text");
  input2.attribute("placeholder", "Class 2");
  addButton2 = createButton("Add Sample");
  addButton2.mousePressed(function () {
    let className = input2.value() || "Class 2";
    feClassifier.addImage(className);
    count2++;
    console.log(className + " samples: " + count2);
  });

  trainButton = createButton("train");
  trainButton.mousePressed(function () {
    feClassifier.train({ epochs: 100, debug: true }, function () {
      console.log("Starting classification...");
      feClassifier.classifyStart(gotResults);
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
