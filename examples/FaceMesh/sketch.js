let facemesh;
let video;
let predictions = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  facemesh = ml5.facemesh(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("face", results => {
   predictions = results;
  });

  // Hide the video element, and just show the canvas
  //video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);

  // We call function to draw all keypoints
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // console.log(predictions)
  for (let i = 0; i < predictions.length; i += 1) {
    // const keypoints = predictions[i].scaledMesh;
    const face = predictions[i];
    // Draw facial keypoints.
    for (let j = 0; j < face.keypoints.length; j += 1) {
      const keypoint = face.keypoints[j];

      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint.x, keypoint.y, 5, 5);
    }
  }
}
