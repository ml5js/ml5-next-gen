let classifier;
let video;
let label = "";
let nameInput1, nameInput2;
let doneButton;
let addButton1, addButton2, trainButton;
let class1 = "Class #1";
let class2 = "Class #2";
let count1 = 0;
let count2 = 0;

function preload() {
  classifier = ml5.featureExtractor('ResNet', { task: 'classification' });
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  background(0);

  // Inputs for naming the two classes (pre-filled with defaults)
  nameInput1 = createInput(class1);
  nameInput2 = createInput(class2);
  doneButton = createButton("Done");

  doneButton.mousePressed(function () {
    // Fall back to defaults if the user cleared the input
    class1 = nameInput1.value().trim() || "Class #1";
    class2 = nameInput2.value().trim() || "Class #2";

    nameInput1.remove();
    nameInput2.remove();
    doneButton.remove();

    // Add buttons to add samples for each class
    addButton1 = createButton("Add " + class1);
    addButton1.mousePressed(function () {
      classifier.addImage(video, class1);
      count1++;
      console.log(class1 + " samples: " + count1);
    });

    addButton2 = createButton("Add " + class2);
    addButton2.mousePressed(function () {
      classifier.addImage(video, class2);
      count2++;
      console.log(class2 + " samples: " + count2);
    });

    // Train and start classifying
    trainButton = createButton("Train");
    trainButton.mousePressed(startTraining);
  });
}

function startTraining() {
  classifier.train({ epochs: 100, debug: true }, whileTraining, finishedTraining);
}

function whileTraining(epoch, logs) {
  console.log("Epoch " + epoch + ": loss = " + logs.loss);
}

function finishedTraining() {
  console.log("Starting classification...");
  classifier.classifyStart(video, gotResults);
}

function draw() {
  background(0);

  // Draw the video
  image(video, 0, 0, 640, 450);

  // Draw the label
  fill(255);
  textSize(16);
  text(label, 10, height - 10);
}

function gotResults(results) {
  label = results[0].label + " (" + nf(results[0].confidence, 0, 2) + ")";
}
