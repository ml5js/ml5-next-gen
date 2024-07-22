import * as tf from "@tensorflow/tfjs";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { imgToPixelArray, isInstanceOfSupportedElement, } from "../utils/imageUtilities";
import NeuralNetwork from "./timeSeries";
import NeuralNetworkData from "./timeSeriesData";

import nnUtils from "../NeuralNetwork/NeuralNetworkUtils";
import NeuralNetworkVis from "../NeuralNetwork/NeuralNetworkVis";

import tsUtils from "./timeSeriesUtils";

const DEFAULTS = {
  inputs: [],
  outputs: [],
  dataUrl: null,
  modelUrl: null,
  layers: [],
  task: null,
  debug: false,
  learningRate: 0.2,
  hiddenUnits: 16,
  neuroEvolution: false,
};


/*
as far as the p5 sketch is concerned, it will directly call only a few functions in the class,
these are the following:

model.addData
model.saveData, model etc
model.train
model.classify/predict etc



*/

class timeSeries {

  //reviewed
  constructor(options, callback) {
    this.options =
      {
        ...DEFAULTS,
        ...options,
      } || DEFAULTS;

    this.neuralNetwork = new NeuralNetwork();
    this.neuralNetworkData = new NeuralNetworkData();
    this.neuralNetworkVis = new NeuralNetworkVis();

    this.data = {
      training: [],
    };
  }

  // mainly for loading data - should be async
  async init() {
    return 0;
  }


  /**
   * ////////////////////////////////////////////////////////////
   *                   Add and Format Data
   * ////////////////////////////////////////////////////////////
   */

  /* adding data: can only accept the following formats:
     - for xInputs:
      1. Sequence of objects (array of objects) 
        [{x: , y: },{x: , y: },{x: , y: },{x: , y: }]
      2. Sequence of arrays (array of array, order matters)
        [[],[],[],[]]
      3. Sequence of values (inputlabels should be provided by user)
        [[,,,,,]] e.g. shape = {inputLabels: ['x','y']} will become [{x: , y: },{x: , y: },{x: , y: },{x: , y: }]
  
    - for yInputs:
      1. similar to neural network, so use same logic
  */ 

  addData(xInputs, yInputs, options = null){
    // 1. verify format between the three possible types of xinputs
    const xs = tsUtils.verifyAndFormatInputs(xInputs,options,this.options);

    // 2. format the yInput - same logic as NN class
    const ys = tsUtils.verifyAndFormatOutputs(yInputs,options,this.options);
    
    // 3. add data to raw
    this.neuralNetworkData.addData(xs,ys);
  }


  /**
   * ////////////////////////////////////////////////////////////
   *                   Train Data
   * ////////////////////////////////////////////////////////////
   */

  async train(optionsOrCallback, optionsOrWhileTraining, callback) {
    let options = {};
    let whileTrainingCb = null;
    let finishedTrainingCb;

    if (typeof optionsOrCallback === "object") {
        options = optionsOrCallback;
        if (typeof optionsOrWhileTraining === "function") {
            whileTrainingCb = null;
            finishedTrainingCb = callback || optionsOrWhileTraining;
        } else {
            finishedTrainingCb = optionsOrWhileTraining;
        }
    } else if (typeof optionsOrCallback === "function") {
        whileTrainingCb = optionsOrCallback;
        finishedTrainingCb = optionsOrWhileTraining;
    } else {
        finishedTrainingCb = optionsOrCallback;
    }

    return callCallback(this.trainInternal(options, whileTrainingCb), finishedTrainingCb);
  }

  async trainInternal(_options, whileTrainingCb) {
    const options = {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.1,
      whileTraining: null,
      ..._options,
    };

    // if debug mode is true, then use tf vis
    if (this.options.debug === true || this.options.debug === "true") {
      options.whileTraining = [
        this.neuralNetworkVis.trainingVis(),
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
    if (!this.neuralNetworkData.isMetadataReady) {
      // if the inputs are defined as an array of [img_width, img_height, channels]
      this.createMetaData();
    }

    // if the data still need to be summarized, onehotencoded, etc
    if (!this.neuralNetworkData.isWarmedUp) {
      this.prepareForTraining();
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
    if (!this.neuralNetwork.isLayered) {
      // TODO: don't update this.options.layers - Linda
      this.options.layers = this.createNetworkLayers(
        this.options.layers
      );
    }

    // if the model does not have any layers defined yet
    // then use the default structure
    if (!this.neuralNetwork.isLayered) {
      // TODO: don't update this.options.layers - Linda
      this.options.layers = this.addDefaultLayers();
    }

    if (!this.neuralNetwork.isCompiled) {
      // compile the model with defaults
      this.compile();
    }

    // train once the model is compiled
    await this.neuralNetwork.train(options);
  }

  createMetaData() {
    const { inputs } = this.options;

    let inputShape;
    if (Array.isArray(inputs) && inputs.length > 0) {
      inputShape =
        inputs.every((item) => typeof item === "number") && inputs.length > 0
          ? inputs
          : null;
    }

    this.neuralNetworkData.createMetadata(inputShape);
  }

  prepareForTraining() {
    this.data.training = this.neuralNetworkData.applyOneHotEncodingsToDataRaw();
    this.neuralNetworkData.isWarmedUp = true;
  }

  convertTrainingDataToTensors() {
    return this.neuralNetworkData.convertRawToTensors(this.data.training);
  }

  createNetworkLayers(layerJsonArray) {
    const layers = [...layerJsonArray];

    const { inputUnits, outputUnits } = this.neuralNetworkData.meta;
    const layersLength = layers.length;

    if (!(layers.length >= 2)) {
      return false;
    }

    // set the inputShape
    layers[0].inputShape = layers[0].inputShape
      ? layers[0].inputShape
      : inputUnits;
    // set the output units
    const lastIndex = layersLength - 1;
    const lastLayer = layers[lastIndex];
    lastLayer.units = lastLayer.units ? lastLayer.units : outputUnits;

    layers.forEach((layer) => {
      this.addLayer(tf.layers[layer.type](layer));
    });

    return layers;
  }

  addDefaultLayers() {
    let layers;
    const task = this.options.task;
    switch (task.toLowerCase()) {
      // if the task is classification
      case "classification":
        layers = [
          {
            type: "dense",
            units: this.options.hiddenUnits,
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
            units: this.options.hiddenUnits,
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
        return this.createNetworkLayers(layers);

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
        return this.createNetworkLayers(layers);
    }
  }

  addLayer(layer) {
    this.neuralNetwork.addLayer(layer);
  }

  compile(){
    const LEARNING_RATE = this.options.learningRate;

    let options = {};

    if (
      this.options.task === "classification" ||
      this.options.task === "imageClassification"
    ) {
      options = {
        loss: "categoricalCrossentropy",
        optimizer: tf.train.sgd,
        metrics: ["accuracy"],
      };
    } else if (this.options.task === "regression") {
      options = {
        loss: "meanSquaredError",
        optimizer: tf.train.adam,
        metrics: ["accuracy"],
      };
    }

    options.optimizer = options.optimizer
      ? this.neuralNetwork.setOptimizerFunction(
          LEARNING_RATE,
          options.optimizer
        )
      : this.neuralNetwork.setOptimizerFunction(LEARNING_RATE, tf.train.sgd);

    this.neuralNetwork.compile(options);

    // if debug mode is true, then show the model summary
    if (this.options.debug) {
      this.neuralNetworkVis.modelSummary(
        {
          name: "Model Summary",
        },
        this.neuralNetwork.model
      );
    }
  }

  normalizeData() {
    if (!this.neuralNetworkData.isMetadataReady) {
      // if the inputs are defined as an array of [img_width, img_height, channels]
      this.createMetaData();
    }

    if (!this.neuralNetworkData.isWarmedUp) {
      this.prepareForTraining();
    }

    const trainingData = this.neuralNetworkData.normalizeDataRaw();

    console.log('normalized', trainingData);

    // set this equal to the training data
    this.data.training = trainingData;

    // set isNormalized to true
    this.neuralNetworkData.meta.isNormalized = true;
  }


}

const TimeSeries = (inputsOrOptions, outputsOrCallback, callback) => {
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

  const instance = new timeSeries(options, cb);
  return instance;
};

export default TimeSeries;
