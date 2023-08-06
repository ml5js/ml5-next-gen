let facemesh;
let video;
let predictions = [];
var maxFaces_value = 1

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  document.getElementById("button_maxFaces").onclick = function(){
    var maxFaces_value = document.getElementById("maxFaces").value;
  }

  const options = {maxFaces: maxFaces_value, 
    refineLandmarks: true, 
    flipHorizontal: false, 
    // color: (0, 255, 0),
  };
  console.log(options.maxFaces)

  facemesh = ml5.facemesh(video, options, modelReady);

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
  //We call function to draw all keypoints
  drawKeypoints();
  //We call function to draw all facial features
  drawLandmarks();
  //We call function to draw certain facial features
  //We have faceOval,rightEyebrow, leftEyebrow, rightEye, leftEye, lips
  drawFeatures();
}

// A function to draw bounding boxes
function drawBoxes(){
  for (let i = 0; i < predictions.length; i += 1){
    // console.log(predictions[0].box);

    // const [_height,_width,_xMax,_xMin,_yMax,_yMin] = predictions[0].box;
    // console.log(_height);

    const x = predictions[0].box.xMin;
    const y = predictions[0].box.yMin;
    const rectWidth = predictions[0].box.width;
    const rectHeight = predictions[0].box.height;

    stroke(255, 0, 0);
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
      const face = predictions[i];
      for (let j = 0; j < face.keypoints.length; j += 1) {
        const keypoint = face.keypoints[j];
        
        if (Object.keys(keypoint)[3]!=null) {
          fill(0, 0, 255);
          noStroke();
          ellipse(keypoint.x, keypoint.y, 5, 5);
        };
      }
    }
  }
}

//A function to draw certain facial features, this example is for lips
//We have faceOval,rightEyebrow, leftEyebrow, rightEye, leftEye, lips
function drawFeatures(){
  if (predictions.length > 0){
    for (let i = 0; i < predictions.length; i += 1) {
      const face = predictions[i];
      for (let j = 0; j < face.keypoints.length; j += 1) {
        // console.log(Object.values(keypoint)[3]); //The name of all facial features
        const keypoint = face.keypoints[j];
        
        if (Object.values(keypoint)[3]=="lips") {
          fill(255, 255, 0);
          //draw keypoints
          noStroke();
          ellipse(keypoint.x, keypoint.y, 5, 5);
          //draw shapes
          
        };
      }
    }
  }      
}
