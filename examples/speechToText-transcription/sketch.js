// sketch.js
let speechToTextModel;
let transcriptionText = "Transcription: ";

async function setup() {
  createCanvas(400, 400);

  speechToTextModel = await ml5.speechToText(
    "Whisper",
    {
      // Called by Transformers.js while model files download
      progress_callback: logProgress,
    }
  );

  console.log("Model loaded!");

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


  text(transcriptionText, 20, 20, width - 40, height - 40);
}

function logProgress(info) {
  if(info.status === "progress_total") {
    console.log("Loading model: " + round(info.progress) + "%");
  }
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