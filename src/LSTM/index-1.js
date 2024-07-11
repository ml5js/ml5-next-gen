import * as tf from "@tensorflow/tfjs";
import neuralNetwork from "../NeuralNetwork/index";
import callCallback from "../utils/callcallback";


/*
Since essentially LSTM is a layer and can be used the same way with neuralNetwork class, 
this will inherit from the DIYNeuralNetwork Class, a list of modifications and overrides will be
in this list:

1.) Architecture: 
    * Default Architecutre when no 

SaveData
formatRawData

converting inputs to tensors


Maintain:
createModel
addlayer
copy

*/



class LSTMify{
  constructor(options, callback){
    this.nnInst = neuralNetwork(options, callback);

    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this.nnInst));
    for (const method of methods) {
      if (method !== 'constructor' && !this[method]) {
        this[method] = this.nnInst[method].bind(this.nnInst);
      }
    }
  }

  // train() {
  //   console.log('Overridden train method in LSTMify');
  //   // Optionally, you can still call the original method if needed
  //   // this.neuralNetworkInstance.train();
  // }
  /**
   * train
   * @public
   * @param {*} optionsOrCallback
   * @param {*} optionsOrWhileTraining
   * @param {*} callback
   * @return {Promise<void>}
   */
  async train(optionsOrCallback, optionsOrWhileTraining, callback) {
    let options;
    let whileTrainingCb;
    let finishedTrainingCb;
    if (
      typeof optionsOrCallback === "object" &&
      typeof optionsOrWhileTraining === "function" &&
      typeof callback === "function"
    ) {
      options = optionsOrCallback;
      whileTrainingCb = optionsOrWhileTraining;
      finishedTrainingCb = callback;
    } else if (
      typeof optionsOrCallback === "object" &&
      typeof optionsOrWhileTraining === "function"
    ) {
      options = optionsOrCallback;
      whileTrainingCb = null;
      finishedTrainingCb = optionsOrWhileTraining;
    } else if (
      typeof optionsOrCallback === "function" &&
      typeof optionsOrWhileTraining === "function"
    ) {
      options = {};
      whileTrainingCb = optionsOrCallback;
      finishedTrainingCb = optionsOrWhileTraining;
    } else {
      options = {};
      whileTrainingCb = null;
      finishedTrainingCb = optionsOrCallback;
    }

    return callCallback(this.trainInternal(options, whileTrainingCb), finishedTrainingCb);
  }

  /**
   * train
   * @param {Object} _options
   * @param {function} [whileTrainingCb]
   * @return {Promise<void>}
   */
  async trainInternal(_options, whileTrainingCb) {
    const options = {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.1,
      whileTraining: null,
      ..._options,
    };

    // if debug mode is true, then use tf vis
    if (this.nnInst.options.debug === true || this.nnInst.options.debug === "true") {
      options.whileTraining = [
        this.nnInst.neuralNetworkVis.trainingVis(),
        {
          onEpochEnd: whileTrainingCb,
        },
      ];
    } else {
      // if not use the default training
      // options.whileTraining = whileTrainingCb === null ? [{
      //     onEpochEnd: (epoch, loss) => {
      //       console.log(epoch, loss.loss)
      //     }
      //   }] :
      //   [{
      //     onEpochEnd: whileTrainingCb
      //   }];
      options.whileTraining = [
        {
          onEpochEnd: whileTrainingCb,
        },
      ];
    }

    // if metadata needs to be generated about the data
    if (!this.nnInst.neuralNetworkData.isMetadataReady) {
      // if the inputs are defined as an array of [img_width, img_height, channels]
      this.nnInst.createMetaData();
    }

    // if the data still need to be summarized, onehotencoded, etc
    if (!this.nnInst.neuralNetworkData.isWarmedUp) {
      this.nnInst.prepareForTraining();
    }

    // if inputs and outputs are not specified
    // in the options, then create the tensors
    // from the this.neuralNetworkData.data.raws
    if (!options.inputs && !options.outputs) {
      const { inputs, outputs } = this.convertTrainingDataToTensors();
      options.inputs = inputs;
      options.outputs = outputs;
    }

    // check to see if layers are passed into the constructor
    // then use those to create your architecture
    if (!this.nnInst.neuralNetwork.isLayered) {
      // TODO: don't update this.options.layers - Linda
      this.nnInst.options.layers = this.createNetworkLayers(
        this.nnInst.options.layers
      );
    }

    // if the model does not have any layers defined yet
    // then use the default structure
    if (!this.nnInst.neuralNetwork.isLayered) {
      // TODO: don't update this.options.layers - Linda
      this.nnInst.options.layers = this.addDefaultLayers();
    }

    if (!this.nnInst.neuralNetwork.isCompiled) {
      // compile the model with defaults
      this.nnInst.compile();
    }

    // train once the model is compiled
    await this.nnInst.neuralNetwork.train(options);
  }

  addDefaultLayers() {
    const { inputs, outputs } = this.convertTrainingDataToTensors();
    const shape = [1];
    shape.push(...inputs.shape);
    console.log(inputs)
    console.log(outputs)

    console.log('default', shape)
    let layers;
    const task = this.nnInst.options.task;
    switch (task.toLowerCase()) {
      // if the task is classification
      case "classification":
        layers = [
          {
            type: "lstm",
            units: this.nnInst.options.hiddenUnits,
            activation: "relu",
            inputShape: shape,
            returnSequences: true,
          },
          {
            type: "dense",
            units: this.nnInst.options.hiddenUnits,
            activation: "relu",
          },
          {
            type: "dense",
            activation: "softmax",
          },
        ];

        return this.createNetworkLayers(layers);
      // if the task is regression
      case "regression":
        layers = [
          {
            type: "dense",
            units: this.nnInst.options.hiddenUnits,
            activation: "relu",
          },
          {
            type: "dense",
            activation: "sigmoid",
          },
        ];
        return this.createNetworkLayers(layers);
      // if the task is imageClassification
      case "imageclassification":
        layers = [
          {
            type: "conv2d",
            filters: 8,
            kernelSize: 5,
            strides: 1,
            activation: "relu",
            kernelInitializer: "varianceScaling",
          },
          {
            type: "maxPooling2d",
            poolSize: [2, 2],
            strides: [2, 2],
          },
          {
            type: "conv2d",
            filters: 16,
            kernelSize: 5,
            strides: 1,
            activation: "relu",
            kernelInitializer: "varianceScaling",
          },
          {
            type: "maxPooling2d",
            poolSize: [2, 2],
            strides: [2, 2],
          },
          {
            type: "flatten",
          },
          {
            type: "dense",
            kernelInitializer: "varianceScaling",
            activation: "softmax",
          },
        ];
        return this.nnInst.createNetworkLayers(layers);

      default:
        console.log("no imputUnits or outputUnits defined");
        layers = [
          {
            type: "dense",
            units: this.options.hiddenUnits,
            activation: "relu",
          },
          {
            type: "dense",
            activation: "sigmoid",
          },
        ];
        return this.nnInst.createNetworkLayers(layers);
    }
  }

  getData(){
    return this.nnInst.neuralNetworkData.getData();
  }
}

const timeSeries = (inputsOrOptions, outputsOrCallback, callback) => {
    let options;
    let cb;
  
    if (inputsOrOptions instanceof Object) {
      options = inputsOrOptions;
      cb = outputsOrCallback;
    } else {
      options = {
        inputs: inputsOrOptions,
        outputs: outputsOrCallback,
      };
      cb = callback;
    }
  
    const instance = new LSTMify(options, cb);
    return instance;
  };
  
  export default timeSeries;