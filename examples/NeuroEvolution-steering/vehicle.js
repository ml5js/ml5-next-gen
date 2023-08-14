class Vehicle {
  constructor(x, y, brain) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.r = 4;
    this.maxspeed = 4;
    this.fitness = 0;

    if (brain) {
      this.brain = brain;
    } else {
      this.brain = ml5.neuralNetwork({
        inputs: 2,
        outputs: 2,
        task: "regression",
        neuroEvolution: true,
      });
    }
  }

  eat(food) {
    let d = p5.Vector.dist(this.position, food);
    if (d < 10) {
      this.fitness++;
      // this.position = createVector(random(width), random(height));
      target = createVector(random(width), random(height));
    }
  }

  think(food) {
    let v = p5.Vector.sub(food, this.position);
    v.normalize();
    let inputs = [v.x, v.y];

    // Predicting the force to apply
    const outputs = this.brain.predictSync(inputs);
    // let x = 2 * outputs[0].value - 1;
    // let y = 2 * outputs[1].value - 1;
    // let force = createVector(x, y); //.setMag(magnitude);
    // force.setMag(1);
    let angle = outputs[0].value * TWO_PI;
    let magnitude = outputs[1].value;
    let force = p5.Vector.fromAngle(angle).setMag(magnitude);
    this.applyForce(force);
  }

  // Method to update location
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);

    // if (
    //   this.position.x > width ||
    //   this.position.y > height ||
    //   this.position.x < 0 ||
    //   this.position.y < 0
    // ) {
    //   this.alive = false;
    // }
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // Wraparound
  edges() {
    // this.position.x = constrain(this.position.x, 0, width);
    // this.position.y = constrain(this.position.y, 0, height);
    //if (this.position.x < -this.r) this.position.x = width + this.r;
    //if (this.position.y < -this.r) this.position.y = height + this.r;
    //if (this.position.x > width + this.r) this.position.x = -this.r;
    //if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  show() {
    //{!1} Vehicle is a triangle pointing in the direction of velocity
    let angle = this.velocity.heading();
    fill(127);
    stroke(0);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    beginShape();
    vertex(this.r * 2, 0);
    vertex(-this.r * 2, -this.r);
    vertex(-this.r * 2, this.r);
    endShape(CLOSE);
    pop();

    //fill(0);
    //noStroke();
    //text(this.fitness, this.position.x + 12, this.position.y);

    // let d = p5.Vector.dist(this.position, this.target);
    // if (d < 50) {
    // stroke(0, 200);
    // strokeWeight(1);
    // line(this.position.x, this.position.y, this.target.x, this.target.y);
    // fill(0, 255, 0, 100);
    // circle(this.target.x, this.target.y, 8);
    //}
  }
}
