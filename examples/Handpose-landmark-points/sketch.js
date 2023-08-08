let handpose;
let video;
let hands = [];

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  handpose = ml5.handpose(video, modelReady);
}

function draw() {
  // Draw the video
  image(video, 0, 0, width, height);

  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}

function modelReady() {
  console.log("Model ready!");
  handpose.detectStart(video, gotHands);
}

// Callback function for when handpose outputs hand landmark points
function gotHands(results) {
  // save the output to the "hands" array
  hands = results;
}
