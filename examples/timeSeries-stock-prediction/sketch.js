/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates Training a Stock Price Predictor through ml5.TimeSeries.
 */

let classifer;
let data;
let data_index;
let seqlength = 8;
let seq = [];
let x=0;
let y= 0;
let train = false;
let training_done = false;

// load JSON data with same formatting from the internet, this means 
// loadData() cannot yet be used as it is formatted differently
function preload(){
  json_data = loadJSON('stock_data.json');
}


function setup() {
  // just get the data property from json
  data = json_data.data;

  // p5 and UI elements
  UI();
  createCanvas(640, 480);
  background(220);

  // set framerate to a constant value
  frameRate(30);

  // set the backend to either webgl or cpu
  ml5.setBackend("webgl");

  // set the options to initialize timeSeries Neural Network
  let options = {
    task: 'regression',
    dataModality: "sequential",
    debug: 'true',
    learningRate: 0.01,
    output:['label']
  };
  model = ml5.timeSeries(options);
  
  // iterate through data using simple sliding window algorithm
  data_index = seqlength - 1;
  while(data_index < data.length-1){
    // get the values [seqlength] steps before current index, collect and add
    for (let x = seqlength -1; x >= 0; x--){
      let curr = data[data_index - x];
      // choose from the raw data what you want to to feed to the model
      let inputs = {
        Open: curr.Open,
        High: curr.High,
        Low: curr.Low,
        Close: curr.Close,
        Volume: curr.Volume
      }
      
      // once collected all data into an array to make it into a sequence
      // the format of the sequence is like this [{},{},...,{}]
      // this is the X value
      seq.push(inputs)
    }

    // the Y value to train is the value that comes after the sequence
    let target = data[data_index + 1];

    // select the outputs you want to get, multiple outputs are possible
    let output = {
      Open: target.Open,
      High: target.High,
      Low: target.Low,
      Close: target.Close,
      Volume: target.Volume
    }

    // feed data into the model
    model.addData(seq, output)
    
    // reset the sequence so new values can be added
    seq = []
    
    // iterate through the whole dataset moving the sliding window in each iteration
    data_index++;
  }
  // normalize the data after adding everything
  model.normalizeData()
}

function trainData(){
  model.normalizeData()
  let options = {
    epochs: 60,
  }
  model.train(options, finishedTraining);
}

function finishedTraining(){
  console.log("Training Done!")
  training_done = true;
}

function predictData(){
  seq = [];

  // choose the most recent sequences
  let latest = data.slice(-seqlength)
  for (let x = 0; x < seqlength ; x++){
    let curr = latest[x];
    // select the same properties for inputs
    let inputs = {
      Open: curr.Open,
      High: curr.High,
      Low: curr.Low,
      Close: curr.Close,
      Volume: curr.Volume
    }
    // add them to one array to make them a sequence
    seq.push(inputs)
  }

  // use the sequence to predict
  model.predict(seq, gotResults);
}

// put the new data in the dataset so this will be considered for any new predictions
function gotResults(results) {
  console.log(results);
  addNewData(results);
}

// code for adding new data to the dataset to be used for future prediction
function addNewData(results){
  let date_old = data[data.length-1].Date
  let date = new Date(date_old);
  date.setDate(date.getDate() + 1);
  let nextDateStr = date.toISOString().split('T')[0];
  new_values = {
    "Date": nextDateStr,
    "Open": parseFloat(results[0].value), 
    "High": parseFloat(results[1].value), 
    "Low": parseFloat(results[2].value), 
    "Close": parseFloat(results[3].value), 
    "Volume": parseFloat(results[4].value),
  },
  data.push(new_values)
}

function draw() {
  // draw some helpful visualizations
  updatedUI()
}

// create custom line graph for stock close prices
let py = 300;
let px = 80;
function updatedUI(){
  if (y < data.length && train){
    push()
    fill(220)
    noStroke()
    rect(100,300,300,70)
    rect(50,350,600,70)
    pop()

    text(" Date: " + data[y].Date + "   Close value: " + data[y].Close.toFixed(1),150,350)
    text('Open: ' + data[y].Open.toFixed(1),80,400)
    text('High: ' + data[y].High.toFixed(1),180,400)
    text('Low: ' + data[y].Low.toFixed(1),280,400)
    text('Close: ' + data[y].Close.toFixed(1),380,400)
    text('Volume: ' + data[y].Volume.toFixed(1),480,400)

    point = data[y].Close;
    cy = map(point, 90, 120, 250, 70)
    cx = x+80
    push()
    if(training_done){
      fill(144,238,144);
    } else {
      fill(0)
    }
    ellipse(cx,cy,5,5)
    line(px,py,cx,cy);
    line(x+80,300,x+80,cy)
    pop()

    px = cx
    py = cy
    y +=1;
    x += 8;
  }
  
  // if you havent trained yet, you cannot predict
  if (train){
    predict.removeAttribute('disabled');
  } else {
    predict.attribute('disabled','true');
  }
}

// Buttons on screen
function UI(){

  rec_circle = createButton('Open Data and Train');
  rec_circle.mouseClicked(() => {train = true; trainData()});
  rec_circle.style("font-family", "Georgia");
  rec_circle.style("font-size", "15px");
  rec_circle.position(20,20)

  predict = createButton('Predict Close for Next Day');
  predict.mouseClicked(predictData);
  predict.style("font-family", "Georgia");
  predict.style("font-size", "15px");
  predict.position(200,440)

}