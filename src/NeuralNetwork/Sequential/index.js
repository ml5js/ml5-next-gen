import * as tf from "@tensorflow/tfjs";
import { DiyNeuralNetwork } from "..";

import callCallback from "../../utils/callcallback";
import setBackend from "../../utils/setBackend";

import seqUtils from "./sequentialUtils";
import SequentialData from "./sequentialData";
import { createSeqLayers } from "./seqLayers";

// call an extension of DIY Neural Network as a new class, override select methods
// which are seen below:
class DIYSequential extends DiyNeuralNetwork {
  constructor(options, callback) {
    super(
      {
        ...options,
        neuralNetworkData: null,
      },
      callback
    );
    // call all options set in the this class which is the default, extra option for dataMode
    this.options = { ...this.options, ...(options || {}) };

    this.neuralNetworkData =
      this.options.neuralNetworkData || new SequentialData();

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
    const xs = seqUtils.verifyAndFormatInputs(xInputs, options, this.options);

    // 2. format the yInput - same logic as NN class
    const ys = seqUtils.verifyAndFormatOutputs(yInputs, options, this.options);

    // 3. add data to raw
    this.neuralNetworkData.addData(xs, ys);
  }

  formatInputsForPredictionAll(_input) {
    const { meta } = this.neuralNetworkData;
    const inputHeaders = Object.keys(meta.inputs);

    const formatted_inputs = seqUtils.verifyAndFormatInputs(
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
    // check if the data is empty
    if (this.neuralNetworkData.data.raw.length <= 0) {
      throw new Error("Must add data before training!");
    }

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

    const seqLayers = createSeqLayers(
      this.neuralNetworkData.meta.seriesShape,
      this.options.hiddenUnits,
      this.numberOfClasses // For output units if needed
    );

    const task = this.options.task;
    let taskConditions = task;
    switch (taskConditions) {
      case "sequenceRegression":
        layers = seqLayers.regression;
        return this.createNetworkLayers(layers);

      case "sequenceClassification":
        layers = seqLayers.classification;
        return this.createNetworkLayers(layers);

      case "sequenceClassificationWithCNN":
        layers = seqLayers.classificationWithCNN;
        return this.createNetworkLayers(layers);

      case "sequenceRegressionWithCNN":
        layers = seqLayers.regressionWithCNN;
        return this.createNetworkLayers(layers);

      default:
        console.error(
          "Error: Task is unknown. Check documentation for a list of available sequence tasks. Defaulting to sequenceRegression Tasks"
        );
        layers = seqLayers.default;
        return this.createNetworkLayers(layers);
    }
  }

  // included here to fix non convergence issue
  compile() {
    const LEARNING_RATE = this.options.learningRate;

    let options = {};

    if (
      this.options.task === "sequenceClassification" ||
      this.options.task === "sequenceClassificationWithCNN"
    ) {
      options = {
        loss: "categoricalCrossentropy",
        optimizer: tf.train.adam,
        metrics: ["accuracy"],
      };
    } else if (
      this.options.task === "sequenceRegression" ||
      this.options.task === "sequenceRegressionWithCNN"
    ) {
      options = {
        loss: "meanSquaredError",
        optimizer: tf.train.adam,
        metrics: ["accuracy"],
      };
    } else {
      // if no task given - must be in NN class instead of this
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
  setFixedLength(coordinates, targetPointCount) {
    const maxEpsilon = int(coordinates.length / 2);
    return seqUtils.setFixedLength(coordinates, targetPointCount, maxEpsilon);
  }

  getSlidingWindow(data, featureKeys, targetKeys, batchLength = null) {
    this.featureKeys = featureKeys;

    if (batchLength == null) {
      this.batchLength = int(data.length * 0.2); // set batchlength as a fraction of the total
    } else if (batchLength >= data.length) {
      throw new Error("batchLength must be smaller than total length of data");
    } else {
      this.batchLength = batchLength;
    }

    return seqUtils.createSlidingWindowData(
      data,
      this.batchLength,
      this.featureKeys,
      targetKeys
    );
  }

  getSampleWindow(data) {
    if (!this.batchLength || !this.featureKeys) {
      throw new Error(
        "Your data must be formated through the slidingWindow method first!"
      );
    }
    return seqUtils.getLatestSequence(data, this.batchLength, this.featureKeys);
  }
}

export default DIYSequential; //export for taskSelection
