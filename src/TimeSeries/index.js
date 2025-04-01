import * as tf from "@tensorflow/tfjs";

import { DiyNeuralNetwork } from "../NeuralNetwork";

import callCallback from "../utils/callcallback";
import setBackend from "../utils/setBackend";

import tsUtils from "./timeSeriesUtils";

// import TimeSeries from "./timeSeries";
import TimeSeriesData from "./timeSeriesData";

// call an extension of DIY Neural Network as a new class, override select methods
// which are seen below:
class DIYTimesSeries extends DiyNeuralNetwork {
  constructor(options, callback) {
    super(
      {
        ...options,
        // neuralNetwork: null,
        neuralNetworkData: null,
      },
      callback
    );
    // call all options set in the this class which is the default
    this.options = { ...this.options, dataMode: "linear", ...(options || {}) };

    // this.neuralNetwork = this.options.neuralNetwork || new TimeSeries();
    this.neuralNetworkData =
      this.options.neuralNetworkData || new TimeSeriesData();

    this.init = this.init.bind(this);
    this.ready = callCallback(this.init(), callback);
  }

  async init() {
    // workaround for Error
    setBackend("webgl");

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
    console.log(xs, ys);
    // 3. add data to raw
    this.neuralNetworkData.addData(xs, ys);
  }

  createMetaData() {
    // this method does not get shape for images but instead for timesteps
    const { inputs } = this.options;

    let inputShape;
    if (typeof inputs === "number") {
      inputShape = inputs;
    } else if (Array.isArray(inputs) && inputs.length > 0) {
      inputShape = inputs.length; //will be fed into the tensors later
    }

    this.neuralNetworkData.createMetadata(inputShape);
  }

  addDefaultLayers() {
    let layers;
    const task = this.options.task;
    const dataMode = this.options.dataMode;
    let taskConditions = `${task}_${dataMode}`;
    switch (taskConditions.toLowerCase()) {
      // if the task is classification and spatial modality
      case "classification_spatial":
        layers = [
          {
            type: "conv1d",
            filters: 8,
            kernelSize: 3,
            activation: "relu",
            inputShape: this.neuralNetworkData.meta.seriesShape,
          },
          {
            type: "maxPooling1d",
            poolSize: 2,
          },
          {
            type: "conv1d",
            filters: 16,
            kernelSize: 3,
            activation: "relu",
            inputShape: this.neuralNetworkData.meta.seriesShape,
          },
          {
            type: "maxPooling1d",
            poolSize: 2,
          },
          {
            type: "flatten",
          },
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
      // if the task is classification and sequential modality
      case "classification_linear":
        layers = [
          {
            type: "lstm",
            units: 16,
            activation: "relu",
            inputShape: this.neuralNetworkData.meta.seriesShape,
            returnSequences: true,
          },
          {
            type: "lstm",
            units: 8,
            activation: "relu",
            returnSequences: false,
          },
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
      case "regression_spatial":
        layers = [
          {
            type: "conv1d",
            filters: 8,
            kernelSize: 3,
            activation: "relu",
            inputShape: this.neuralNetworkData.meta.seriesShape,
          },
          {
            type: "maxPooling1d",
            poolSize: 2,
          },
          {
            type: "conv1d",
            filters: 16,
            kernelSize: 3,
            activation: "relu",
            inputShape: this.neuralNetworkData.meta.seriesShape,
          },
          {
            type: "maxPooling1d",
            poolSize: 2,
          },
          {
            type: "flatten",
          },
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

      case "regression_linear":
        layers = [
          {
            type: "lstm",
            units: 16,
            activation: "relu",
            inputShape: this.neuralNetworkData.meta.seriesShape,
            returnSequences: true,
          },
          {
            type: "lstm",
            units: 8,
            activation: "relu",
          },
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

      default:
        console.log("no inputUnits or outputUnits defined");
        layers = [
          {
            type: "lstm",
            units: 16,
            activation: "relu",
            inputShape: this.neuralNetworkData.meta.seriesShape,
          },
          {
            type: "lstm",
            units: 8,
            activation: "relu",
          },
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

  async loadDataFromUrl(dataUrl, inputs, outputs) {
    let json;
    let dataFromUrl;
    try {
      if (dataUrl.endsWith(".csv")) {
        dataFromUrl = await this.neuralNetworkData.loadCSV(
          dataUrl,
          inputs,
          outputs
        );
      } else if (dataUrl.endsWith(".json")) {
        dataFromUrl = await this.neuralNetworkData.loadJSON(
          dataUrl,
          inputs,
          outputs
        );
      } else if (dataUrl.includes("blob")) {
        dataFromUrl = await this.loadBlob(dataUrl, inputs, outputs);
      } else {
        throw new Error("Not a valid data format. Must be csv or json");
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }

    dataFromUrl.map((item) => {
      this.addData(item.xs, item.ys);
    });

    this.createMetaData();

    this.prepareForTraining();
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

  async classifyInternal(_input) {
    const { meta } = this.neuralNetworkData;
    const headers = Object.keys(meta.inputs);

    let inputData;

    inputData = this.formatInputsForPredictionAll(_input);

    const unformattedResults = await this.neuralNetwork.classify(inputData);
    inputData.dispose();

    if (meta !== null) {
      const label = Object.keys(meta.outputs)[0];
      const vals = Object.entries(meta.outputs[label].legend);

      const formattedResults = unformattedResults.map((unformattedResult) => {
        return vals
          .map((item, idx) => {
            return {
              [item[0]]: unformattedResult[idx],
              label: item[0],
              confidence: unformattedResult[idx],
            };
          })
          .sort((a, b) => b.confidence - a.confidence);
      });

      // return single array if the length is less than 2,
      // otherwise return array of arrays
      if (formattedResults.length < 2) {
        return formattedResults[0];
      }
      return formattedResults;
    }

    return unformattedResults;
  }

  padCoordinates(coordinates, targetPointCount) {
    const maxEpsilon = int(coordinates.length / 2);
    return tsUtils.padCoordinates(coordinates, targetPointCount, maxEpsilon);
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
