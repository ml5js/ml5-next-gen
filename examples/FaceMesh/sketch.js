let facemesh;
let video;
let predictions = [];
var maxFaces_value = 1;

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
  //We call function to store basic data for certain facial features
  //We have faceOval,rightEyebrow, leftEyebrow, rightEye, leftEye, lips
  gotFaces(predictions);
  // //Show the index of the points
  // directPoints();

  //Interactive Elements
  mask();
}

// A function to draw bounding boxes
function drawBoxes(){
  for (let i = 0; i < predictions.length; i += 1){
    // console.log(predictions[0].box); 

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

        //draw keypoints for lips
        if (Object.values(keypoint)[3]=="lips") {
          fill(255, 255, 0);
          noStroke();
          ellipse(keypoint.x, keypoint.y, 5, 5);
        };
      };
    };
  }      
}

//A function to store basic data for faces, giving an example to store certain facial feature for lips
//We have faceOval,rightEyebrow, leftEyebrow, rightEye, leftEye, lips
function gotFaces(faces){
  if (faces.length > 0){
    for (let i = 0; i < faces.length; i += 1) {
      const face = faces[i];
      const fKeypoints = [];
      const fKeypointX = [];
      const fKeypointY = [];
      for (let j = 0; j < face.keypoints.length; j += 1) {
        //  console.log(Object.values(keypoint)[3]); //The name of all facial features
        const keypoint = face.keypoints[j];
        
        // //  all faces
        // console.log(faces);
        // //  one face
        // console.log(faces[0])

        // //  bounding box of face, x,y is top left
        // //  console.log(faces[0].box)
        // console.log(faces[0].box.xMin, faces[0].box.yMin, faces[0].box.width, faces[0].box.width); 
        
        // //  all keypoints
        // console.log(face.keypoints);
        // //  one keypoint
        // //  could use directPoints function to know the seriel number of every keypoints
        // console.log(face.keypoints[0].x, face.keypoints[0].y);

        //  x,y of a part, the lips as an example
        //  all of the parts keypoints
        if (Object.values(keypoint)[3]=="lips") {
          fKeypoints.push(keypoint)
          fKeypointX.push(keypoint.x);
          fKeypointY.push(keypoint.y);
        };
      };
      // all of the part keypoints
      console.log(fKeypoints);
      //  x,y of one part keypoint
      console.log(fKeypoints[0].x, fKeypoints[0].y)
      ;
      //Create an example class of important data of facial features
          const faceData = {
            lips: {
              topLeftX: min(fKeypointX),
              topLeftY: min(fKeypointY),
              fWidth: length(fKeypointX),
              fHeight: length(fKeypointY),
            }

            //the other needed features Data

          };
          console.log(faceData.lips.topLeftX,faceData.lips.topLeftY, faceData.lips.fWidth, faceData.lips.fHeight);
    };

    // function avg(x){
    //   return (max(x)+min(x))/2
    //       }
    function length(x){
      return max(x)-min(x)
          }
  }      
}

//Show the index of the points
function directPoints(){
  let dMouse = [];
  let closest = 0;

  if (predictions.length > 0){
    for (let i = 0; i < predictions.length; i += 1) {
      const face = predictions[i];
      for (let j = 0; j < face.keypoints.length; j += 1) {
          const keypoint = face.keypoints[j];

          //calculate the distance between mouse and points
          let d = dist(keypoint.x,keypoint.y,mouseX,mouseY);
          
          dMouse.push(d);
        }

      let minimum = min(dMouse);
      closest = dMouse.indexOf(minimum);

      fill(255,0,0);
      ellipse(predictions[i].keypoints[closest].x, predictions[i].keypoints[closest].y, 5, 5);

      console.log(closest);

      dMouse.splice(0,dMouse.length);
    }
  }
}

//Interactive Elements
function mask(){
  if (predictions.length > 0){
    for (let i = 0; i < predictions.length; i += 1) {
      const face = predictions[i];
      for (let j = 0; j < face.keypoints.length; j += 1) {
        // console.log(Object.values(keypoint)[3]); //The name of all facial features
        const keypoint = face.keypoints[4];
          push()
          fill(255, 0, 0);
          //draw rednose
          noStroke();
          ellipse(keypoint.x, keypoint.y, 40, 40);
          pop()
          
      }
    }
  }
}

