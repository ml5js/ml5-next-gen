import * as tf from "@tensorflow/tfjs";

import { DiyNeuralNetwork } from "../NeuralNetwork";

import callCallback from "../utils/callcallback";
import setBackend from "../utils/setBackend";

import tsUtils from "./timeSeriesUtils";

import TimeSeriesData from "./timeSeriesData";
import { createTsLayers } from "./tsLayers";

// call an extension of DIY Neural Network as a new class, override select methods
// which are seen below:
class DIYTimesSeries extends DiyNeuralNetwork {
  constructor(options, callback) {
    super(
      {
        ...options,
        neuralNetworkData: null,
      },
      callback
    );
    // call all options set in the this class which is the default, extra option for dataMode
    this.options = { ...this.options, spatialData: false, ...(options || {}) };

    this.neuralNetworkData =
      this.options.neuralNetworkData || new TimeSeriesData();

    this.init = this.init.bind(this);
    this.ready = callCallback(this.init(), callback);
  }

  async init() {
    await tf.ready();
    if (this.options.dataUrl) {
      await this.loadDataFromUrl(this.options.dataUrl);
    } else if (this.options.modelUrl) {
      await this.load(this.options.modelUrl);
    }
    return this;
  }

  addData(xInputs, yInputs, options = null) {
    // 1. verify format between the three possible types of xinputs
    const xs = tsUtils.verifyAndFormatInputs(xInputs, options, this.options);

    // 2. format the yInput - same logic as NN class
    const ys = tsUtils.verifyAndFormatOutputs(yInputs, options, this.options);

    // 3. add data to raw
    this.neuralNetworkData.addData(xs, ys);
  }

  formatInputsForPredictionAll(_input) {
    const { meta } = this.neuralNetworkData;
    const inputHeaders = Object.keys(meta.inputs);

    const formatted_inputs = tsUtils.verifyAndFormatInputs(
      _input,
      null,
      this.options
    );
    const normalized_inputs = this.neuralNetworkData.normalizePredictData(
      formatted_inputs,
      meta.inputs
    );
    const output = tf.tensor(normalized_inputs);

    return output;
  }

  createMetaData() {
    // this method does not get shape for images but instead for timesteps
    const { inputs } = this.options;

    let inputShape;
    if (typeof inputs === "number") {
      inputShape = inputs;
    } else if (Array.isArray(inputs) && inputs.length > 0) {
      inputShape = inputs.length; // will be fed into the tensors later
    }

    this.neuralNetworkData.createMetadata(inputShape);
  }

  addDefaultLayers() {
    let layers;

    const tsLayers = createTsLayers(
      this.neuralNetworkData.meta.seriesShape,
      this.options.hiddenUnits,
      this.numberOfClasses // For output units if needed
    );

    const task = this.options.task;
    const spatialData = this.options.spatialData;
    let taskConditions = task;
    if (spatialData === true || spatialData === "true") {
      taskConditions = `${task}_spatial`;
    }
    switch (taskConditions.toLowerCase()) {
      case "regression":
        layers = tsLayers.regression;
        return this.createNetworkLayers(layers);

      case "classification":
        layers = tsLayers.classification;
        return this.createNetworkLayers(layers);

      case "classification_spatial":
        layers = tsLayers.classification_spatial;
        return this.createNetworkLayers(layers);

      case "regression_spatial":
        layers = tsLayers.regression_spatial;
        return this.createNetworkLayers(layers);

      default:
        console.warn("no inputUnits or outputUnits defined");
        layers = tsLayers.default;
        return this.createNetworkLayers(layers);
    }
  }

  // included here to fix non convergence issue
  compile() {
    const LEARNING_RATE = this.options.learningRate;

    let options = {};

    if (
      this.options.task === "classification" ||
      this.options.task === "imageClassification"
    ) {
      options = {
        loss: "categoricalCrossentropy",
        optimizer: tf.train.adam,
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

  // RDP algorithm
  padCoordinates(coordinates, targetPointCount) {
    const maxEpsilon = int(coordinates.length / 2);
    return tsUtils.padCoordinates(coordinates, targetPointCount, maxEpsilon);
  }

  slidingWindow(data, featureKeys, targetKeys, batchLength = null) {
    this.featureKeys = featureKeys;

    if (batchLength == null) {
      this.batchLength = int(data.length * 0.2); // set targetlength as a fraction of the total
    } else if (targetLength >= data.length) {
      throw new Error("batchLength must be smaller than total length of data");
    } else {
      this.batchLength = batchLength;
    }

    return tsUtils.createSlidingWindowData(
      data,
      this.batchLength,
      this.featureKeys,
      targetKeys
    );
  }

  sampleWindow(data) {
    if (!this.batchLength || !this.featureKeys) {
      throw new Error(
        "Your data must be formated through the slidingWindow method first!"
      );
    }
    return tsUtils.getLatestSequence(data, this.batchLength, this.featureKeys);
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

  const instance = new DIYTimesSeries(options, cb);
  return instance;
};

export default timeSeries;
