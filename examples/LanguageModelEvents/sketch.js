let lm;
let curWord = 0;
let angle = 0;
let radius = 60;

function setup() {
  createCanvas(400, 400);
  background(0);

  lm = ml5.languageModel('TinyStories-15M', onModelLoaded);
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
  console.log('Prompt is "' + prompt + '"');

  let options = {
    temperature: 0.9
  };
  lm.generate(prompt, options);
  lm.on('token', onToken);
  lm.on('word', onWord);
  lm.on('finish', onFinsh);
}


function onToken(token, lm) {
  //console.log('Token', token);
}

function onWord(word, lm) {
  //console.log('Word "' + word + '"');
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
  text(word, 0, 0);
  pop();
}

function onFinsh(out, lm) {
  console.log('Generation finished');
}
