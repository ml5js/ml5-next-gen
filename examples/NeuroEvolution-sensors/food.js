// Copyright (c) 2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

class Food {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.r = 50;
  }

  show() {
    noStroke();
    fill(0, 100);
    circle(this.position.x, this.position.y, this.r * 2);
  }
}
