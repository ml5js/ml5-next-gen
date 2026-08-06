let predictor;
let video;

let slider;
let addButton;
let trainButton;
let sampleCount = 0;
let predictedValue = 0;

async function setup() {
  predictor = await ml5.featureExtractor("MobileNet", { task: "regression" });

  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // slider: 0 = far from camera, 1 = close to camera
  slider = createSlider(0, 1, 0.5, 0.01);
  slider.style("width", "640px");

  addButton = createButton("Add sample");
  addButton.mousePressed(addSample);

  trainButton = createButton("Start training");
  trainButton.mousePressed(startTraining);
}

function addSample() {
  predictor.addImage(video, slider.value());
  sampleCount++;
  console.log("Sample " + sampleCount + " added with value: " + slider.value());
}

function startTraining() {
  predictor.train(
    { epochs: 500, learningRate: 0.0001, debug: true },
    finishedTraining
  );
}

function finishedTraining() {
  predictor.predictStart(video, gotResult);
}

function draw() {
  background(0);

  image(video, 0, 0, 640, 450);

  // use predicted value if trained, otherwise follow the slider
  let currentValue = slider.value();
  if (predictor.isTrained) {
    currentValue = predictedValue;
  }

  // make sure predicted value stays within 0-1
  currentValue = constrain(currentValue, 0, 1);

  let circleSize = map(currentValue, 0, 1, 80, 300);
  fill(255, 255, 0, 100);
  ellipse(320, 250, circleSize, circleSize);

  noStroke();
  fill(255);
  textSize(16);
  text("Value: " + nf(currentValue, 1, 4), 10, height - 10);
}

function gotResult(results) {
  predictedValue = results[0].value;
}
