let lm;
let curWord = 0;
let angle = 0;
let radius = 60;

function setup() {
  createCanvas(400, 400);
  background(0);

  lm = ml5.languageModel(onModelLoaded);
}

function draw() {
  fill(0, 5);
  rect(0, 0, width, height);
}

function onModelLoaded() {
  console.log('Model loaded');
  select('#generate').removeAttribute('disabled');
  select('#generate').mouseClicked(generateText);
}

function generateText() {
  let prompt = select('#prompt').value();
  console.log('Prompt: ' + prompt);

  let options = {
    temperature: 0.9
  };
  lm.generate(prompt, options, onToken);

  curWord = 0;
}

function onToken(lm) {
  console.log(lm.tokens[lm.tokens.length-1]);

  while (curWord < lm.words.length) {
    push();
    translate(width/2, height/2);
    rotate(radians(angle));
    translate(radius, 0);
    rotate(radians(-angle));
    angle = angle + 5;
    radius += 0.5;
    if (radius > width/2 || radius > height/2) {
      radius = 60;
    }
    fill(255);
    textAlign(CENTER);
    textSize(10);
    text(lm.words[curWord], 0, 0);
    pop();
    curWord++;
  }

  if (lm.finished) {
    console.log('Generation finished');
  }
}
