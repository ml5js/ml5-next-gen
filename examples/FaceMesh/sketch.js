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

  //We call function to draw bounding box
  drawBoxes();
  // We call function to draw all keypoints
  drawKeypoints();
  //We call function to draw all facial features
  //drawLandmarks
}

// A function to draw bounding boxes
function drawBoxes(){
  for (let i = 0; i < predictions.length; i += 1){
    // console.log(predictions[0].box)

    // const [_height,_width,_xMax,_xMin,_yMax,_yMin] = predictions[0].box
    // console.log(_height)

    const x = predictions[0].box.xMin;
    const y = predictions[0].box.yMin;
    const rectWidth = predictions[0].box.width;
    const rectHeight = predictions[0].box.height;

    stroke(0, 255, 0);
    strokeWeight(5);
    noFill();
    rect(x,y,rectWidth,rectHeight);
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // console.log(predictions);
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

// A function to draw all facial features over the detected keypoints
function drawLandmarks(){
  if (predictions.length > 0){
    for (let i = 0; i < predictions.length; i += 1) {
      
    }
  }
}

