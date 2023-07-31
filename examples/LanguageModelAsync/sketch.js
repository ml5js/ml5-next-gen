let lm;

async function setup() {
  noCanvas();

  lm = await ml5.languageModel();
  console.log('Model loaded');

  select('#generate').mouseClicked(generateText);
}

function draw() {
}

async function generateText() {
  let prompt = select('#prompt').value();
  console.log('Prompt: ' + prompt);

  let out = await lm.generate(prompt);
  console.log('Generated: ' + out);
  select('#output').html(out);
}
