let feRegressor;
let video;
let slider;
let addButton;
let trainButton;
let sampleCount = 0;
let predictedValue = 0;

function preload() {
  // Initialize the feature extractor for regression
  feRegressor = ml5.featureExtractor({ task: 'regression' }, modelReady);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  // Set the video as the input for the Regressor
  feRegressor.video = video;

  // Slider: 0 = far from camera, 1 = close to camera
  slider = createSlider(0, 1, 0.5, 0.01);
  slider.style("width", "640px");

  // Add a sample with the current slider value
  addButton = createButton("Add Sample");
  addButton.mousePressed(function () {
    feRegressor.addImage(slider.value());
    sampleCount++;
    console.log("Sample " + sampleCount + " added with value: " + slider.value());
  });

  // Train and start predicting
  trainButton = createButton("Train");
  trainButton.mousePressed(function () {
    feRegressor.train({ epochs: 500, learningRate: 0.0001, debug: true }, function () {
      console.log("Starting regression...");
      feRegressor.predictStart(gotResults);
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

  // Use predicted value if trained, otherwise follow the slider
  let currentValue = feRegressor.isTrained ? predictedValue : slider.value();
  // Clamp to 0-1 range
  currentValue = constrain(currentValue, 0, 1);

  // Map value to circle size: 0 = small (80), 1 = large (300)
  let circleSize = map(currentValue, 0, 1, 80, 300);

  // Draw the circle in the center of the video area
  noFill();
  stroke(255, 255, 0);
  strokeWeight(3);
  ellipse(320, 250, circleSize, circleSize);

  // Draw the label
  noStroke();
  fill(255);
  textSize(16);
  text("Value: " + nf(currentValue, 1, 4), 10, height - 10);
}

function modelReady() {
  console.log("Model is ready!");
}

function gotResults(results) {
  predictedValue = results[0].value;
}
