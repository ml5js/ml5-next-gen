let lm;
let curWord = 0;
let angle = 0;
let radius = 60;

function preload() {
  lm = ml5.languageModel('TinyStories-15M', onModelLoaded);
}

function setup() {
  createCanvas(400, 400);
  background(0);
  select('#generate').mouseClicked(generateText);
}

function draw() {
  fill(0, 5);
  rect(0, 0, width, height);
}

function onModelLoaded() {
  console.log('Model loaded');
}

function generateText() {
  let prompt = select('#prompt').value();
  console.log('Prompt is "' + prompt + '"');

  let options = {
    temperature: 0.9
  };
  lm.generate(prompt, options);
  lm.on('token', onToken);
  lm.on('word', onWord);
  lm.on('finish', onFinsh);
}


function onToken(lm) {
  console.log('Token', lm.tokens.slice(-1));
}

function onWord(lm) {
  console.log('Word "' + lm.words.slice(-1) + '"');
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
  text(lm.words.slice(-1), 0, 0);
  pop();
}

function onFinsh(lm) {
  console.log('Model returned "' + lm.text + '"');
}
