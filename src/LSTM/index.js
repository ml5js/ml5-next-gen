
import * as tf from "@tensorflow/tfjs";
// import '@tensorflow/tfjs-node';
// import callCallback from "../utils/callcallback";

class LSTMify{
    
  constructor (options, callback){
    // sample architecture just to try
    this.model = tf.sequential();

  }

  createArchitecture() {
    this.model.add(tf.layers.lstm({
      units: 40,
      inputShape: [20,2]
    }));

    this.model.add(tf.layers.dense({
      units: 20,
      activation: 'relu',
    }));

    this.model.add(tf.layers.dense({
      units: 2,
      activation: 'softmax',
    }));
  }

  compileModel(){
    this.model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  fitModel(xs,ys){
    this.model.fit(xs, ys,{
      epochs: 20,
      batchSize: 32,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
      }}
    })
  }
  
  summarizeModel(){
    this.model.summary()
  }
  
}

const timeSeries = (inputsOrOptions, outputsOrCallback, callback) => {
    // let options;
    // let cb;
  
    // if (inputsOrOptions instanceof Object) {
    //   options = inputsOrOptions;
    //   cb = outputsOrCallback;
    // } else {
    //   options = {
    //     inputs: inputsOrOptions,
    //     outputs: outputsOrCallback,
    //   };
    //   cb = callback;
    // }
  
    // const instance = new LSTMify(options, cb);
    // return instance;

    const instance = new LSTMify();
    return instance;
  };
  
  export default timeSeries;