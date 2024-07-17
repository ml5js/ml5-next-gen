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


  /////////////////////////////////////////////////////////////////////////////
  //                                 ADD DATA                                //
  /////////////////////////////////////////////////////////////////////////////

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
    
    this.neuralNetworkData.addData(xs,ys);
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
