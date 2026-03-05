let featureExtractor;
let regressor;
let video;
let slider;
let addButton;
let trainButton;
let sampleCount = 0;
let predictedValue = 0;

function modelReady() {
  console.log("Model is ready!");
}

function videoReady() {
  console.log("The video is ready!");
}

function regressVideo() {
  regressor.predict(gotResults);
}

function gotResults(results) {
  predictedValue = results[0].value;
  regressVideo();
}

function setup() {
  createCanvas(640, 540);
  video = createCapture(VIDEO);
  video.hide();
  background(0);

  // Initialize the feature extractor
  featureExtractor = ml5.featureExtractor({ epochs: 200}, modelReady);
  // Create a regressor using those features and with a video element
  regressor = featureExtractor.regression(video, videoReady);

  // Slider: 0 = far from camera, 1 = close to camera
  slider = createSlider(0, 1, 0.5, 0.01);
  slider.style("width", "640px");

  // Add a sample with the current slider value
  addButton = createButton("Add Sample");
  addButton.mousePressed(function () {
    regressor.addImage(slider.value());
    sampleCount++;
    console.log("Sample " + sampleCount + " added with value: " + slider.value());
  });

  // Train and start predicting
  trainButton = createButton("Train");
  trainButton.mousePressed(function () {
    regressor.train().then(function () {
      console.log("Starting regression...");
      regressVideo();
    });
  });
}

function draw() {
  background(0);

  // Draw the video (flipped horizontally)
  push();
  translate(640, 0);
  scale(-1, 1);
  image(video, 0, 0, 640, 500);
  pop();

  // Use predicted value if trained, otherwise follow the slider
  let currentValue = regressor.isTrained ? predictedValue : slider.value();
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
