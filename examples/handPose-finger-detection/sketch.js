// Fingers Detection with ml5.js

let video;
let handPose;
let hands = [];

function preload() {
  handPose = ml5.handPose({ flipped: true });
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);
  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.2) {
        let thumb_finger = hand.thumb_tip;
        let index_finger = hand.index_finger_tip;
        let middle_finger = hand.middle_finger_tip;
        let ring_finger = hand.ring_finger_tip;
        let pinky_finger = hand.pinky_finger_tip;
        let r = 20;
        let offset = 15;
        // Painting elements
        noStroke();
        fill(255);
        circle(thumb_finger.x, thumb_finger.y, r);
        text("Thumb", thumb_finger.x-offset, thumb_finger.y-offset);
        fill(255, 0, 0);
        circle(index_finger.x, index_finger.y, r);
        text("Index", index_finger.x-offset, index_finger.y-offset);
        fill(0, 255, 0);
        circle(middle_finger.x, middle_finger.y, r);
        text("Middle", middle_finger.x-offset, middle_finger.y-offset);
        fill(0, 0, 255);
        circle(ring_finger.x, ring_finger.y, r);
        text("Ring", ring_finger.x-offset, ring_finger.y-offset);
        fill(255, 0, 255);
        circle(pinky_finger.x, pinky_finger.y, r);
        text("Pinky", pinky_finger.x-offset, pinky_finger.y-offset);
      }
    }
  }
}
