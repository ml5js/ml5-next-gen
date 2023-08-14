let handpose;
let video;
let hands = [];

function setup() {
  createCanvas(640, 480);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Load the model and attach an event
  handpose = ml5.handpose(video, modelReady);
  handpose.on("hand", gotHands);
}

// Event for hand detection
function gotHands(results) {
  // Always save the latest output from the model in global variable "hands"
  hands = results;
}

// Event for when model loaded
function modelReady() {
  console.log("Model ready!");
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
