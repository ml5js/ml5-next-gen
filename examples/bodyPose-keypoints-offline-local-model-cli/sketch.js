// BodyPose keypoints — offline local model CLI version.
//
// Setup once before running this sketch:
//   node ../../bin/ml5.js cache prefetch bodypose
// Once published to npm, this becomes: npx ml5 cache prefetch bodypose
//
// The CLI saves files into ./ml5-models/bodypose/. Point modelPath at that
// model root, not at the tfjs/ or mediapipe/ runtime subfolder.

let video;
let bodyPose;
let poses = [];

function preload() {
  // Load the BodyPose MoveNet model from local files. For local BlazePose TFJS,
  // use: ml5.bodyPose({ modelName: "BlazePose", modelPath: "./ml5-models/bodypose" })
  bodyPose = ml5.bodyPose({ modelPath: "./ml5-models/bodypose" });
}

function setup() {
  createCanvas(640, 480);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  console.log("BodyPose (MoveNet) model loaded from local files.");
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // Only draw a circle if the keypoint's confidence is bigger than 0.1
      if (keypoint.confidence > 0.1) {
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}
