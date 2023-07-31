let lm;
let numOptions = 40;

async function setup() {
  noCanvas();

  lm = await ml5.languageModel(onModelLoaded);
}

function draw() {
}

function onModelLoaded() {
  console.log('Model loaded');
  select('#generate').removeAttribute('disabled');
  select('#generate').mouseClicked(generateText);
}

function generateText() {
  let prompt = select('#prompt').value();
  console.log('Prompt: ' + prompt);

  select('#prompt').remove();
  select('#generate').remove();
  let btn = createElement('button', prompt);
  btn.attribute('disabled', 'disabled');
  select('body').child(btn);

  let options = {
    temperature: 0.9
  };

  lm.manualStart(prompt, options, onTokens);
}

function onTokens(tokens, lm) {
  for (let i=0; i < numOptions; i++) {
    let btn = createElement('button', tokens[i].str);
    btn.class('continuation');
    btn.id(tokens[i].index);
    btn.mousePressed(selectToken);
    select('body').child(btn);
  }
}

function selectToken() {
  let nextToken = parseInt(this.id());

  this.removeClass('continuation');
  this.attribute('disabled', 'disabled');
  this.mousePressed(null);

  let others = selectAll('.continuation');
  for (let i=0; i < others.length; i++) {
    others[i].remove();
  }

  lm.manualNext(nextToken, onTokens);
}
