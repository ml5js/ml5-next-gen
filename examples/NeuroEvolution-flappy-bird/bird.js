class Bird {
  constructor(brain) {
    // A bird's brain receives 5 inputs and classifies them into one of two labels
    if (brain) {
      this.brain = brain;
    } else {
      this.brain = ml5.neuralNetwork({
        inputs: 5,
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
      if (pipe.x > this.x) {
        nextPipe = pipe;
        break;
      }
    }

    let inputs = [
      this.y / height,
      this.velocity / height,
      nextPipe.top / height,
      nextPipe.bottom / height,
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
    this.velocity *= 0.9;

    // Handle the "floor"
    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
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
