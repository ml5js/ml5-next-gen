
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import nnUtils from "../NeuralNetwork/NeuralNetworkUtils";

// import '@tensorflow/tfjs-node';
// import callCallback from "../utils/callcallback";

class LSTMify{
    
  constructor (options, callback){
    // sample architecture just to try
    this.model = tf.sequential();

  }

  createArchitecture() {

    // Create the model
    this.model = tf.sequential();

    // Add the LSTM layers with the initializer
    this.model.add(tf.layers.lstm({
      units: 50,
      inputShape: [20, 2],
      activation: 'relu',
      returnSequences: true,
      kernelInitializer: tf.initializers.glorotNormal(),
      recurrentInitializer: tf.initializers.glorotNormal(),
      biasInitializer: tf.initializers.glorotNormal(),

    }));


    this.model.add(tf.layers.lstm({
      units: 50,
      kernelInitializer: tf.initializers.glorotNormal(),
      recurrentInitializer: tf.initializers.glorotNormal(),
      biasInitializer: tf.initializers.glorotNormal(),
    }));

    this.model.add(tf.layers.dense({
      units: 2,
      activation: 'softmax',
    }));
  }

  compileModel(){
    const optimizer = tf.train.adam(0.002)
    // const optimizer = tf.train.adadelta(0.05)

    this.model.compile({
      optimizer: optimizer,
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }
  
  summarizeModel(){
    this.model.summary()
  }

  toTensors(x,y){
    const x_tensor = tf.tensor(x);
    const y_tensor = tf.tensor(y);

    return [x_tensor,y_tensor]
  }

  async fitModel(xs,ys){
    this.loggers = []
    this.history = await this.model.fit(xs, ys,{ 
      epochs: 50,
      batchSize: 16,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
        this.loggers.push(logs)
        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
      }
      // callbacks: {
      //   onEpochEnd: async (epoch, logs) => {
      //     // Display the loss and accuracy at the end of each epoch
      //     this.loggers.push(logs)
      
      //     // Plot loss and accuracy
      //     tfvis.show.history(
      //       { name: 'Training Performance' },
      //       this.loggers,
      //       ['loss', 'accuracy']  // or ['loss', 'acc'] based on your metrics
      //     );
      //   },
      // }
    }})
  }

  modelSummary() {
    console.log(this.history);
    tfvis.show.history({ name: 'Training Performance' }, this.loggers, ['loss', 'accuracy']);
  }

  // async predict(data){
  //   const predictions =  this.model.predict(data)
  //   const predict = await predictions.array();
  //   console.log(typeof predict)
  //   predict.array().then(array => {
  //     console.log(array);
  //     // return array
  //   })
  //   // console.log("this is the one")
  //   // return array_ver

  // }

  predict(_inputs) {
    const output = tf.tidy(() => {
      return this.model.predict(_inputs);
    });
    const result = output.arraySync();

    output.dispose();
    _inputs.dispose();

    console.log(result, 'here')

    const final = nnUtils.getMax(result[result.length-1])

    console.log(result[result.length-1].indexOf(final),'lalal', result, final)
    const word = [result[result.length-1].indexOf(final)]

    return word;
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