let vehicles = [];
let timeSlider;
let lifetime = 0;
let target;

function setup() {
  createCanvas(640, 240);
  ml5.tf.setBackend("cpu");
  for (let i = 0; i < 50; i++) {
    vehicles[i] = new Vehicle(random(width), random(height));
  }
  target = createVector(random(width), random(height));
  timeSlider = createSlider(1, 20, 1);
}

function draw() {
  background(255);
  for (let i = 0; i < timeSlider.value(); i++) {
    for (let v of vehicles) {
      v.think(target);
      v.eat(target);
      v.update();
    }
    lifetime++;
  }

  for (let v of vehicles) {
    v.show();
  }

  fill(0, 0, 255, 150);
  noStroke();
  circle(target.x, target.y, 32);

  if (lifetime > 500) {
    normalizeFitness();
    reproduction();
    target = createVector(random(width), random(height));
    lifetime = 0;
  }
  fill(0);
  text(lifetime, 10, 30);
}

function normalizeFitness() {
  for (let v of vehicles) {
    v.fitness = pow(2, v.fitness);
  }
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
