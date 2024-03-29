/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates neuroevolution with ml5.neuralNetwork.
 */

class Glow {
  constructor() {
    this.xoff = 0;
    this.yoff = 1000;
    this.position = createVector();
    this.r = 24;
  }

  update() {
    this.position.x = noise(this.xoff) * width;
    this.position.y = noise(this.yoff) * height;
    this.xoff += 0.01;
    this.yoff += 0.01;
  }

  show() {
    stroke(0);
    strokeWeight(2);
    fill(200);
    circle(this.position.x, this.position.y, this.r * 2);
  }
}
