let classifier;
let video;

let classElems = [];
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
    let input = createInput("");
    input.attribute("placeholder", "Class #" + (i + 1) + " label");
    classElems.push(input);
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
  for (let i = 0; i < classElems.length; i++) {
    let label = classElems[i].value();
    if (label.trim().length == 0) {
      label = "Class #" + (i + 1);
    }
    // we're storing the label and the number of samples seen as
    // custom properties in the p5.Element
    classElems[i].label = label;
    classElems[i].count = 0;
    // turn it into a button
    classElems[i].attribute("type", "button");
    classElems[i].value("Add " + label);
    classElems[i].mousePressed(addSample);
  }

  doneButton.html("Start training");
  doneButton.mousePressed(startTraining);
}

function addSample() {
  // "this" is the button that was pressed
  classifier.addImage(video, this.label);
  this.count++;

  result = "";
  for (let i = 0; i < classElems.length; i++) {
    result += classElems[i].label + ": " + classElems[i].count + ", ";
  }
  result = result.slice(0, -2);
}

function startTraining() {
  classifier.train({ epochs: 100, debug: true }, finishedTraining);
}

function finishedTraining() {
  for (let i = 0; i < classElems.length; i++) {
    classElems[i].hide();
  }
  doneButton.hide();

  classifier.classifyStart(video, gotResult);
}

function gotResult(results) {
  result = results[0].label + " (" + nf(results[0].confidence, 0, 2) + ")";
}
