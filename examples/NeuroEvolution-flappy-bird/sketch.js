let birds = [];
let pipes = [];

function setup() {
  createCanvas(640, 240);
  for (let i = 0; i < 100; i++) {
    birds[i] = new Bird();
  }
  pipes.push(new Pipe());
  ml5.tf.setBackend("cpu");
}

function draw() {
  background(255);

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    for (let bird of birds) {
      if (pipes[i].collides(bird)) {
        // text("OOPS!", pipes[i].x, pipes[i].top + 20);
      }
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  for (let bird of birds) {
    bird.think(pipes);
    bird.update();
    bird.show();
  }

  if (frameCount % 75 == 0) {
    pipes.push(new Pipe());
  }
}
