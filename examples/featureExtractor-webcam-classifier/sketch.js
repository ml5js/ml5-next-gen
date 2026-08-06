let classifier;
let video;

let classButtons = [];
let doneButton;
let result = "";

async function setup() {
  classifier = await ml5.featureExtractor("MobileNet", {
    task: "classification",
  });

  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  for (let i = 0; i < 2; i++) {
    let button = createButton("Class #" + (i + 1) + " (click to rename)");
    button.attribute("contenteditable", "true");
    classButtons.push(button);
  }

  doneButton = createButton("Start collecting samples");
  doneButton.mousePressed(startSampling);
}

function draw() {
  background(0);

  image(video, 0, 0, 640, 450);

  fill(255);
  textSize(16);
  text(result, 10, height - 10);
}

function startSampling() {
  for (let i = 0; i < classButtons.length; i++) {
    let label = classButtons[i].html();
    if (label.endsWith(" (click to rename)")) {
      label = label.slice(0, -18);
    }
    // we're storing the label and the nuber of samples seen as
    // custom properties in the p5.Element
    classButtons[i].label = label;
    classButtons[i].count = 0;
    classButtons[i].attribute("contenteditable", "false");
    classButtons[i].html("Add " + label);
    classButtons[i].mousePressed(addSample);
  }

  doneButton.html("Start training");
  doneButton.mousePressed(startTraining);
}

function addSample() {
  // "this" is the button that was pressed
  classifier.addImage(video, this.label);
  this.count++;

  result = "";
  for (let i = 0; i < classButtons.length; i++) {
    result += classButtons[i].label + ": " + classButtons[i].count + ", ";
  }
  result = result.slice(0, -2);
}

function startTraining() {
  classifier.train({ epochs: 100, debug: true }, finishedTraining);
}

function finishedTraining() {
  for (let i = 0; i < classButtons.length; i++) {
    classButtons[i].hide();
  }
  doneButton.hide();

  classifier.classifyStart(video, gotResult);
}

function gotResult(results) {
  result = results[0].label + " (" + nf(results[0].confidence, 0, 2) + ")";
}
