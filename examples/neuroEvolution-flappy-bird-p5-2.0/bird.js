/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates neuroevolution with ml5.neuralNetwork.
 */

class Bird {
  constructor(brain) {
    if (brain) {
      this.brain = brain;
    } else {
      // A bird's brain receives 4 inputs and classifies them into one of two labels
      this.brain = ml5.neuralNetwork({
        inputs: 4,
        outputs: ["flap", "no flap"],
        task: "classification",
        neuroEvolution: true,
      });
    }

    // The bird's position (x will be constant)
    this.x = 50;
    this.y = 120;

    // Velocity and forces are scalar since the bird only moves along the y-axis
    this.velocity = 0;
    this.gravity = 0.5;
    this.flapForce = -10;

    // Adding a fitness
    this.fitness = 0;
    this.alive = true;
  }

  think(pipes) {
    let nextPipe = null;
    for (let pipe of pipes) {
      if (pipe.x + pipe.w > this.x) {
        nextPipe = pipe;
        break;
      }
    }

    let inputs = [
      this.y / height,
      this.velocity / height,
      nextPipe.top / height,
      (nextPipe.x - this.x) / width,
    ];

    let results = this.brain.classifySync(inputs);
    if (results[0].label == "flap") {
      this.flap();
    }
  }

  // The bird flaps its wings
  flap() {
    this.velocity += this.flapForce;
  }

  update() {
    // Add gravity
    this.velocity += this.gravity;
    this.y += this.velocity;
    // Dampen velocity
    this.velocity *= 0.95;

    // Handle the "floor"
    if (this.y > height || this.y < 0) {
      this.alive = false;
    }

    this.fitness++;
  }

  show() {
    strokeWeight(2);
    stroke(0);
    fill(127, 200);
    circle(this.x, this.y, 16);
  }
}
