let vehicles = [];
let timeSlider;
let lifetime = 0;

let target;

function setup() {
  createCanvas(640, 240);
  // Initialize a set number of vehicles
  for (let i = 0; i < 50; i++) {
    vehicles[i] = new Vehicle(random(width), random(height));
  }
  ml5.tf.setBackend("cpu");

  target = createVector(random(width), random(height));
  timeSlider = createSlider(1, 20, 1);
}

function draw() {
  background(255);

  for (let i = 0; i < timeSlider.value(); i++) {
    for (let v of vehicles) {
      v.edges();
      v.think(target);
      v.eat(target);
      v.update();
    }
    lifetime++;
  }

  let best = null;
  let record = -1;
  for (let v of vehicles) {
    v.show();
    if (v.fitness > record) {
      record = v.fitness;
      best = v;
    }
  }

  best.show();
  noStroke();
  fill(255, 0, 0, 100);
  circle(best.position.x, best.position.y, 64);
  fill(0);
  text(best.fitness, best.position.x + 12, best.position.y);
  fill(0, 0, 255, 100);
  circle(target.x, target.y, 32);

  stroke(0, 100);
  strokeWeight(1);
  //line(target.x, target.y, best.position.x, best.position.y);

  if (lifetime > 500) {
    normalizeFitness();
    reproduction();
    target = createVector(random(width), random(height));
    lifetime = 0;
  }
  // if (allVehiclesDead()) {
  // }

  fill(0);
  text(lifetime, 10, 30);
}

// function allVehiclesDead() {
//   for (let v of vehicles) {
//     if (v.alive) {
//       return false;
//     }
//   }
//   return true;
// }

function normalizeFitness() {
  let recordFitness = 0;
  for (let v of vehicles) {
    if (v.fitness > recordFitness) {
      recordFitness = v.fitness;
    }
    v.fitness = pow(2, v.fitness);
  }
  console.log(recordFitness);

  let sum = 0;
  for (let v of vehicles) {
    sum += v.fitness;
  }
  for (let v of vehicles) {
    v.fitness = v.fitness / sum;
  }
}

function reproduction() {
  let nextVehicles = [];
  for (let i = 0; i < vehicles.length; i++) {
    let parentA = weightedSelection();
    let parentB = weightedSelection();
    let child = parentA.crossover(parentB);
    child.mutate(0.1);
    nextVehicles[i] = new Vehicle(random(width), random(height), child);
  }
  vehicles = nextVehicles;
}

function weightedSelection() {
  let index = 0;
  let start = random(1);
  while (start > 0) {
    start = start - vehicles[index].fitness;
    index++;
  }
  index--;
  return vehicles[index].brain;
}
