/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates neuroevolution with ml5.neuralNetwork.
 */

let bloops = [];
let timeSlider;
let restartButton;
let food = [];

function setup() {
  createCanvas(640, 240);
  // cpu is higher performance for tiny neural networks like in this example
  ml5.setBackend("cpu");
  restart();
  restartButton = createButton("restart").mousePressed(restart);
  timeSlider = createSlider(1, 20, 1);
}

function restart() {
  bloops = [];
  for (let i = 0; i < 20; i++) {
    bloops[i] = new Creature(random(width), random(height));
  }
  food = [];
  for (let i = 0; i < 8; i++) {
    food[i] = new Food();
  }
}

function draw() {
  background(255);
  for (let i = 0; i < timeSlider.value(); i++) {
    for (let i = bloops.length - 1; i >= 0; i--) {
      bloops[i].think();
      bloops[i].eat();
      bloops[i].update();
      bloops[i].borders();
      if (bloops[i].health < 0) {
        bloops.splice(i, 1);
      } else if (random(1) < 0.001) {
        let child = bloops[i].reproduce();
        bloops.push(child);
      }
    }
  }
  for (let treat of food) {
    treat.show();
  }
  for (let bloop of bloops) {
    bloop.show();
  }
}
