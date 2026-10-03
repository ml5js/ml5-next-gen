// FaceMesh keypoints — offline local model CLI version.
//
// Setup once before running this sketch:
//   node ../../bin/ml5.js cache prefetch facemesh
// Once published to npm, this becomes: npx ml5 cache prefetch facemesh
//
// The CLI saves files into ./ml5-models/facemesh/. Point modelPath at that
// model root, not at the tfjs/ or mediapipe/ runtime subfolder.

let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // Load the faceMesh model from local files
  faceMesh = ml5.faceMesh({ ...options, modelPath: "./ml5-models/facemesh" });
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  console.log("FaceMesh model loaded from local files.");
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw all the tracked face points
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
    }
  }
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}
