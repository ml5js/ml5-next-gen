/*
 * Hello! This is an ml5.js example made and shared with love.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates transfer learning with ml5.featureExtractor.
 * Upload images, assign labels, train a custom classifier or regressor,
 * then classify or predict on new images.
 * All hyperparameters (task, version, alpha, epochs, hiddenUnits,
 * learningRate, batchSize) are exposed via UI controls.
 */

let featureExtractor;
let currentImage;
let imageCount = {};

// UI elements
let taskSelect, versionSelect, alphaSelect;
let epochsInput, hiddenUnitsInput, learningRateInput, batchSizeInput;
let loadBtn, fileInput, labelInput, addBtn, trainBtn, inferBtn;
let fileNameSpan;
let statusP, resultP;
let instructionP;

// Alpha options per MobileNet version
const ALPHA_OPTIONS = {
  1: ["0.25", "0.5", "0.75", "1.0"],
  2: ["0.5", "0.75", "1.0"],
};

function setup() {
  createCanvas(400, 300);
  textFont("Arial");
  drawPlaceholder();

  // --- Model settings ---
  createP("Model Settings").style("font-weight", "bold").style("margin-bottom", "0");

  // Row 1: Task, Version, Alpha
  var row1 = createDiv();
  row1.style("margin-bottom", "4px");

  var taskLabel = createElement("label", "Task: ");
  taskLabel.style("margin-right", "4px");
  row1.child(taskLabel);
  taskSelect = createSelect();
  taskSelect.option("classification");
  taskSelect.option("regression");
  taskSelect.selected("classification");
  taskSelect.changed(onTaskChanged);
  taskSelect.style("margin-right", "12px");
  row1.child(taskSelect);

  var versionLabel = createElement("label", "Version: ");
  versionLabel.style("margin-right", "4px");
  row1.child(versionLabel);
  versionSelect = createSelect();
  versionSelect.option("1");
  versionSelect.option("2");
  versionSelect.selected("1");
  versionSelect.changed(updateAlphaOptions);
  versionSelect.style("margin-right", "12px");
  row1.child(versionSelect);

  var alphaLabel = createElement("label", "Alpha: ");
  alphaLabel.style("margin-right", "4px");
  row1.child(alphaLabel);
  alphaSelect = createSelect();
  updateAlphaOptions();
  row1.child(alphaSelect);

  // Row 2: Epochs, Hidden Units, Learning Rate, Batch Size
  var row2 = createDiv();
  row2.style("margin-bottom", "4px");

  var epochsLabel = createElement("label", "Epochs: ");
  epochsLabel.style("margin-right", "4px");
  row2.child(epochsLabel);
  epochsInput = createInput("20", "number");
  epochsInput.attribute("min", "1");
  epochsInput.attribute("step", "1");
  epochsInput.style("width", "60px");
  epochsInput.style("margin-right", "12px");
  row2.child(epochsInput);

  var hiddenLabel = createElement("label", "Hidden Units: ");
  hiddenLabel.style("margin-right", "4px");
  row2.child(hiddenLabel);
  hiddenUnitsInput = createInput("100", "number");
  hiddenUnitsInput.attribute("min", "1");
  hiddenUnitsInput.attribute("step", "1");
  hiddenUnitsInput.style("width", "60px");
  hiddenUnitsInput.style("margin-right", "12px");
  row2.child(hiddenUnitsInput);

  var lrLabel = createElement("label", "Learning Rate: ");
  lrLabel.style("margin-right", "4px");
  row2.child(lrLabel);
  learningRateInput = createInput("0.0001", "number");
  learningRateInput.attribute("min", "0");
  learningRateInput.attribute("step", "0.0001");
  learningRateInput.style("width", "80px");
  learningRateInput.style("margin-right", "12px");
  row2.child(learningRateInput);

  var batchLabel = createElement("label", "Batch Size: ");
  batchLabel.style("margin-right", "4px");
  row2.child(batchLabel);
  batchSizeInput = createInput("0.4", "number");
  batchSizeInput.attribute("min", "0");
  batchSizeInput.attribute("max", "1");
  batchSizeInput.attribute("step", "0.05");
  batchSizeInput.style("width", "60px");
  row2.child(batchSizeInput);

  // Row 3: Load button
  var row3 = createDiv();
  row3.style("margin-bottom", "4px");
  loadBtn = createButton("Load MobileNet");
  loadBtn.mousePressed(initFeatureExtractor);
  row3.child(loadBtn);

  // --- Image & training controls ---
  createP("Training").style("font-weight", "bold").style("margin-bottom", "0");

  // Row 4: File input (custom English button)
  var row4 = createDiv();
  row4.style("margin-bottom", "4px");

  fileInput = createFileInput(handleFile);
  fileInput.attribute("accept", "image/*");
  fileInput.style("display", "none");

  var chooseBtn = createButton("Choose Image");
  chooseBtn.mousePressed(function () { fileInput.elt.click(); });
  row4.child(chooseBtn);

  fileNameSpan = createSpan("No file chosen");
  fileNameSpan.style("margin-left", "8px");
  row4.child(fileNameSpan);

  // Row 5: Label input, Add, Train, Classify/Predict
  var row5 = createDiv();
  row5.style("margin-bottom", "4px");

  var labelLabel = createElement("label", "Label: ");
  labelLabel.style("margin-right", "4px");
  row5.child(labelLabel);
  labelInput = createInput("").attribute("placeholder", "Label");
  labelInput.style("margin-right", "8px");
  row5.child(labelInput);

  addBtn = createButton("Add Image");
  addBtn.mousePressed(addCurrentImage);
  addBtn.style("margin-right", "4px");
  row5.child(addBtn);

  trainBtn = createButton("Train");
  trainBtn.mousePressed(trainModel);
  trainBtn.style("margin-right", "4px");
  row5.child(trainBtn);

  inferBtn = createButton("Classify");
  inferBtn.mousePressed(inferCurrentImage);
  row5.child(inferBtn);

  // --- Status display ---
  statusP = createP("Loading MobileNet...");
  resultP = createP("");

  // Load with defaults on startup
  initFeatureExtractor();
}

function drawPlaceholder() {
  background(220);
  fill(100);
  textAlign(CENTER, CENTER);
  textSize(14);
  textFont("Arial");
  text("Upload an image to get started", width / 2, height / 2);
}

function getOptions() {
  return {
    task: taskSelect.value(),
    version: Number(versionSelect.value()),
    alpha: Number(alphaSelect.value()),
    epochs: parseInt(epochsInput.value(), 10) || 20,
    hiddenUnits: parseInt(hiddenUnitsInput.value(), 10) || 100,
    learningRate: parseFloat(learningRateInput.value()) || 0.0001,
    batchSize: parseFloat(batchSizeInput.value()) || 0.4,
  };
}

function initFeatureExtractor() {
  var opts = getOptions();
  statusP.html("Loading MobileNet v" + opts.version + " (alpha " + opts.alpha + ")...");
  resultP.html("");
  imageCount = {};

  featureExtractor = ml5.featureExtractor("MobileNet", opts, function () {
    statusP.html(
      "MobileNet v" + opts.version + " loaded (" + opts.task + "). Upload images and add labels to train."
    );
  });

  onTaskChanged();
}

function updateAlphaOptions() {
  var version = Number(versionSelect.value());
  var options = ALPHA_OPTIONS[version];

  // Remove existing options
  alphaSelect.elt.innerHTML = "";

  for (var i = 0; i < options.length; i++) {
    alphaSelect.option(options[i]);
  }

  // Default to 1.0
  alphaSelect.selected("1.0");
}

function onTaskChanged() {
  var task = taskSelect.value();
  if (task === "regression") {
    inferBtn.html("Predict");
    labelInput.attribute("placeholder", "Numeric value");
  } else {
    inferBtn.html("Classify");
    labelInput.attribute("placeholder", "Label");
  }
}

function handleFile(file) {
  if (file.type === "image") {
    fileNameSpan.html(file.name);
    loadImage(file.data, function (img) {
      currentImage = img;
      displayImage(img);
    });
  }
}

function displayImage(img) {
  background(220);
  var aspectRatio = img.width / img.height;
  var dw, dh, x, y;

  if (aspectRatio > width / height) {
    dw = width;
    dh = width / aspectRatio;
    x = 0;
    y = (height - dh) / 2;
  } else {
    dh = height;
    dw = height * aspectRatio;
    x = (width - dw) / 2;
    y = 0;
  }

  image(img, x, y, dw, dh);
}

function addCurrentImage() {
  if (!currentImage) {
    statusP.html("No image loaded. Upload an image first.");
    return;
  }

  var label = labelInput.value().trim();
  if (!label) {
    statusP.html("Enter a label before adding the image.");
    return;
  }

  // For regression, convert label to a number
  var task = taskSelect.value();
  if (task === "regression") {
    label = Number(label);
    if (isNaN(label)) {
      statusP.html("Regression requires a numeric value as the label.");
      return;
    }
  }

  statusP.html("Adding image...");
  featureExtractor.addImage(currentImage.canvas, label, function () {
    var displayLabel = String(label);
    imageCount[displayLabel] = (imageCount[displayLabel] || 0) + 1;
    var summary = Object.entries(imageCount)
      .map(function (entry) {
        return entry[0] + ": " + entry[1];
      })
      .join(", ");
    statusP.html("Images added — " + summary);
  });
}

function trainModel() {
  statusP.html("Training...");
  featureExtractor.train(
    function (epoch, logs) {
      statusP.html(
        "Training epoch " + (epoch + 1) + " — loss: " + logs.loss.toFixed(5)
      );
    },
    function () {
      var task = taskSelect.value();
      if (task === "regression") {
        statusP.html("Training complete! You can now predict on images.");
      } else {
        statusP.html("Training complete! You can now classify images.");
      }
    }
  );
}

function inferCurrentImage() {
  if (!currentImage) {
    statusP.html("No image loaded. Upload an image first.");
    return;
  }

  var task = taskSelect.value();

  if (task === "regression") {
    statusP.html("Predicting...");
    featureExtractor.predict(currentImage.canvas, function (results) {
      resultP.html("Prediction: " + results[0].value.toFixed(4));
      statusP.html("Prediction complete.");
    });
  } else {
    statusP.html("Classifying...");
    featureExtractor.classify(currentImage.canvas, function (results) {
      var text = results
        .map(function (r) {
          return r.label + ": " + (r.confidence * 100).toFixed(1) + "%";
        })
        .join("  |  ");
      resultP.html(text);
      statusP.html("Classification complete.");
    });
  }
}
