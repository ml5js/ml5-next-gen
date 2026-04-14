let feClassifier;
let video;
let label = "";
let nameButton1, nameButton2;
let doneButton;
let addButton1, addButton2, trainButton;
let class1 = "Class #1";
let class2 = "Class #2";
let count1 = 0;
let count2 = 0;

function preload() {
  feClassifier = ml5.featureExtractor({ task: 'classification' }, modelReady);
}

function setup() {
  let cnv = createCanvas(640, 480);
  cnv.parent("canvasContainer");
  // Show the name controls now that the canvas exists
  document.getElementById("nameControls").style.display = "";
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  feClassifier.video = video;

  // Grab the editable name buttons + Done button defined in index.html
  nameButton1 = select("#nameButton1");
  nameButton2 = select("#nameButton2");
  doneButton = select("#doneButton");

  doneButton.mousePressed(function () {
    // Get class names from the editable buttons, or use defaults if unchanged
    let text1 = nameButton1.elt.textContent.trim();
    let text2 = nameButton2.elt.textContent.trim();
    class1 = (text1 && text1 !== "Click to edit Class #1") ? text1 : "Class #1";
    class2 = (text2 && text2 !== "Click to edit Class #2") ? text2 : "Class #2";

    nameButton1.remove();
    nameButton2.remove();
    doneButton.remove();

    // Add buttons to add samples for each class
    addButton1 = createButton("Add " + class1);
    addButton1.mousePressed(function () {
      feClassifier.addImage(class1);
      count1++;
      console.log(class1 + " samples: " + count1);
    });

    addButton2 = createButton("Add " + class2);
    addButton2.mousePressed(function () {
      feClassifier.addImage(class2);
      count2++;
      console.log(class2 + " samples: " + count2);
    });

    // Train and start classifying
    trainButton = createButton("Train");
    trainButton.mousePressed(function () {
      feClassifier.train({ epochs: 100, debug: true }, function () {
        console.log("Starting classification...");
        feClassifier.classifyStart(gotResults);
      });
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

function modelReady() {
  console.log("Model is ready!");
}

function gotResults(results) {
  label = results[0].label + " (" + nf(results[0].confidence, 0, 2) + ")";
}
