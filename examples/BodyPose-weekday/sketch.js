/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates pose tracking on live video through ml5.bodyPose with MoveNet model.
 */

let bodyPose;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(640, 480);
}

function draw() {
  background(255);
  fill(0);
  stroke(0);
  let day = bodyPose.weekday();
  textSize(48);
  textAlign(CENTER);
  text(day, width/2, height/2);
}
