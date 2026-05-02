// HandPose keypoints — offline local model CLI version.
//
// Setup once before running this sketch:
//   node ../../bin/ml5.js cache prefetch handpose
// Once published to npm, this becomes: npx ml5 cache prefetch handpose
//
// The CLI saves files into ./ml5-models/handpose/. Point modelPath at that
// model root, not at the tfjs/ or mediapipe/ runtime subfolder.

let handPose;
let video;
let hands = [];

function preload() {
  handPose = ml5.handPose({ modelPath: "./ml5-models/handpose" });
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);
  console.log("HandPose model loaded from local files.");
}

function draw() {
  image(video, 0, 0, width, height);
  for (let hand of hands) {
    for (let keypoint of hand.keypoints) {
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}

function gotHands(results) {
  hands = results;
}
