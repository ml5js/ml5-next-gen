/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates neuroevolution with ml5.neuralNetwork.
 */

class Pipe {
  constructor() {
    this.spacing = 100;
    this.top = random(height - this.spacing);
    this.bottom = this.top + this.spacing;
    this.x = width;
    this.w = 20;
    this.speed = 2;
  }

  collides(bird) {
    // Is the bird within the vertical range of the top or bottom pipe?
    let verticalCollision = bird.y < this.top || bird.y > this.bottom;
    // Is the bird within the horizontal range of the pipes?
    let horizontalCollision = bird.x > this.x && bird.x < this.x + this.w;
    // If it's both a vertical and horizontal hit, it's a hit!
    return verticalCollision && horizontalCollision;
  }

  show() {
    fill(0);
    noStroke();
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height - this.bottom);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x < -this.w;
  }
}
