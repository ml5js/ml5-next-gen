let lm;
let words = [];
let curWord = 0;
let curX = 0;
let curY = 20;

function setup() {
  createCanvas(400, 400);
  frameRate(15);
  background(0);

  lm = ml5.languageModel('TinyStories-15M', onModelLoaded);
}

function draw() {
  fill(0, 2);
  rect(0, 0, width, height);

  if (curWord < words.length) {
    let wordWidth = textWidth(words[curWord]);
    if (curX+wordWidth > width) {
      curX = 0;
      curY += textAscent() + textDescent();
    }
    fill(255);
    text(words[curWord] + ' ', curX, curY);
    curX += wordWidth;
    curWord++;
  }
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
  lm.generate(prompt, options, gotText);
}

function gotText(out, lm) {
  console.log('Model returned "' + out + '"');
  // lm.words contains the output broken up in words
  words = lm.words;
  curWord = 0;
}
