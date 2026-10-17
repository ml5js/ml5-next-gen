// sketch.js
let speechToTextModel;
let transcriptionText = "Transcription: ";
let loadProgress = 0;
let modelReady = false;

async function setup() {
  createCanvas(400, 400);

  speechToTextModel = await ml5.speechToText(
    "Whisper",
    {
      // Called by Transformers.js while model files download
      progress_callback: logProgress,
    }
  );

  modelReady = true;

  let startButton = createButton("start");
  startButton.mousePressed(startListening);
  let stopButton = createButton("stop");
  stopButton.mousePressed(stopListening);
}

function draw() {
  background(220);
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);

  if (!modelReady) {
    // Progress bar shown while the model downloads
    text("Loading model...", 20, 20);
    noFill();
    stroke(0);
    rect(20, 50, width - 40, 20);
    noStroke();
    fill(0);
    rect(20, 50, (width - 40) * (loadProgress / 100), 20);
    text(nf(loadProgress, 0, 0) + "%", 20, 80);
    return;
  }

  text(transcriptionText, 20, 20, width - 40, height - 40);
}

function logProgress(info) {
  if(info.status === "progress_total") {
    console.log("Loading model: " + round(info.progress) + "%");
  }
  console.log("Model Loaded!")
}

function startListening() {
  console.log("Listening...");
  speechToTextModel.startListening();
}

function stopListening() {
  console.log("Stopped Listening...");
  speechToTextModel.stopListening(gotResults);
}

function gotResults(results) {
  console.log(results);
  if (results && results.text) {
    transcriptionText = "Transcription: " + results.text;
  }
}