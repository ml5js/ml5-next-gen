/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates training a color classifier through ml5.neuralNetwork.
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

function preload(){
  json_data = loadJSON('stock_data.json');
}

function setup() {
  data = json_data.data;
  UI();
  frameRate(30);
  createCanvas(640, 480);
  background(220);

  ml5.setBackend("webgl");

  let options = {
    task: 'regression',
    dataModality: "sequential",
    debug: 'true',
    learningRate: 0.01,
    output:['label']
  };
  model = ml5.timeSeries(options);
  
  final = []
  
  data_index = seqlength - 1;
  while(data_index < data.length-1){
    for (let x = seqlength -1; x >= 0; x--){
      let curr = data[data_index - x];
      let inputs = {
        Open: curr.Open,
        High: curr.High,
        Low: curr.Low,
        Close: curr.Close,
        Volume: curr.Volume
      }
      
      seq.push(inputs)
    }
    
    console.log(data[data_index + 1]);


    let target = data[data_index + 1];
    let output = {
      Open: target.Open,
      High: target.High,
      Low: target.Low,
      Close: target.Close,
      Volume: target.Volume
    }
    // let target = {label:data[data_index + 1]};
    // delete target.Date
    model.addData(seq, output)
    
    seq = []
    
    data_index++;
  }
  model.normalizeData()
}


let py = 300 
let px = 80

function draw() {
  // background(200)
  updatedUI()


  // for (let x = 0; x < data.length; x ++){
  //   point = data[x].close

  // }
  
}

function updatedUI(){
  if (y < data.length && train){
    push()
    fill(220)
    noStroke()
    rect(100,300,300,70)
    rect(50,350,600,70)
    pop()

    console.log(training_done);
    

    
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
  

  if (train){
    predict.removeAttribute('disabled');
  } else {
    predict.attribute('disabled','true');
  }
}

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

function trainData(){
  model.normalizeData()
  let options = {
    epochs: 60,
  }
  model.train(options, finishedTraining);
}

function predictData(){
  console.log(data.length)
  seq = [];
  let latest = data.slice(-seqlength)
  console.log('latest',latest);
  for (let x = 0; x < seqlength ; x++){
    let curr = latest[x];
    let inputs = {
      Open: curr.Open,
      High: curr.High,
      Low: curr.Low,
      Close: curr.Close,
      Volume: curr.Volume
    }
    seq.push(inputs)
  }

  model.predict(seq, gotResults);
}

function gotResults(results) {
  console.log(results);
  addNewData(results);
}

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

function finishedTraining(){
  console.log("Training Done!")
  training_done = true;
}