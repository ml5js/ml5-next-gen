import * as tf from "@tensorflow/tfjs";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import NeuralNetwork from "./timeSeries";
import NeuralNetworkData from "./timeSeriesData";
import nnUtils from "../NeuralNetwork/NeuralNetworkUtils";
import NeuralNetworkVis from "../NeuralNetwork/NeuralNetworkVis";

import setBackend from "../utils/setBackend";

import tsUtils from "./timeSeriesUtils";

const DEFAULTS = {
  inputs: [],
  outputs: [],
  dataUrl: null,
  modelUrl: null,
  layers: [],
  task: null,
  dataMode: "linear",
  debug: false,
  learningRate: 0.2,
  hiddenUnits: 16,
};

class timeSeries {
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

    - at the end of the adding data, the data is formatted to a sequence of objects similar to 1 of xinputs
 
    - changed data Modality into spatialData so its a boolean, true if coordinate data and false if normal lstm
  */

  addData(xInputs, yInputs, options = null) {
    // 1. verify format between the three possible types of xinputs
    const xs = tsUtils.verifyAndFormatInputs(xInputs, options, this.options);

    // 2. format the yInput - same logic as NN class
    const ys = tsUtils.verifyAndFormatOutputs(yInputs, options, this.options);

    // 3. add data to raw
    this.neuralNetworkData.addData(xs, ys);
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

    return callCallback(
      this.trainInternal(options, whileTrainingCb),
      finishedTrainingCb
    );
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
      this.options.layers = this.createNetworkLayers(this.options.layers);
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

  prepareForTraining() {
    // this.data.training = this.neuralNetworkData.applyOneHotEncodingsToDataRaw();
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

  addLayer(layer) {
    this.neuralNetwork.addLayer(layer);
  }

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

  async normalizeData() {
    if (!this.neuralNetworkData.data.raw.length > 0) {
      throw new Error(
        "Empty Data Error: You Cannot Normalize/Train without adding any data! Please add data first"
      );
    }
    if (!this.neuralNetworkData.isMetadataReady) {
      this.createMetaData();
    }

    if (!this.neuralNetworkData.isWarmedUp) {
      this.prepareForTraining();
    }

    const trainingData = this.neuralNetworkData.normalizeDataRaw();

    // set this equal to the training data
    this.data.training = trainingData;

    // set isNormalized to true
    this.neuralNetworkData.meta.isNormalized = true;
  }

  // ////////

  classify(_input, _cb) {
    return callCallback(this.classifyInternal(_input), _cb);
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

  predict(_input, _cb) {
    return callCallback(this.predictInternal(_input), _cb);
  }

  async predictInternal(_input) {
    const { meta } = this.neuralNetworkData;

    const inputData = this.formatInputsForPredictionAll(_input);

    const unformattedResults = await this.neuralNetwork.predict(inputData);
    inputData.dispose();

    if (meta !== null) {
      const labels = Object.keys(meta.outputs);

      const formattedResults = unformattedResults.map((unformattedResult) => {
        return labels.map((item, idx) => {
          // check to see if the data were normalized
          // if not, then send back the values, otherwise
          // unnormalize then return
          let val;
          let unNormalized;
          if (meta.isNormalized) {
            const { min, max } = meta.outputs[item];
            val = nnUtils.unnormalizeValue(unformattedResult[idx], min, max);
            unNormalized = unformattedResult[idx];
          } else {
            val = unformattedResult[idx];
          }

          const d = {
            [labels[idx]]: val,
            label: item,
            value: val,
          };

          // if unNormalized is not undefined, then
          // add that to the output
          if (unNormalized) {
            d.unNormalizedValue = unNormalized;
          }

          return d;
        });
      });

      // return single array if the length is less than 2,
      // otherwise return array of arrays
      if (formattedResults.length < 2) {
        return formattedResults[0];
      }
      return formattedResults;
    }

    // if no meta exists, then return unformatted results;
    return unformattedResults;
  }

  /**
   * ////////////////////////////////////////////////////////////
   * Save / Load Data
   * ////////////////////////////////////////////////////////////
   */

  saveData(name, callback) {
    const args = handleArguments(name, callback);
    return callCallback(
      this.neuralNetworkData.saveData(args.name),
      args.callback
    );
  }

  async loadData(filesOrPath, callback) {
    return callCallback(this.neuralNetworkData.loadData(filesOrPath), callback);
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

  /**
   * ////////////////////////////////////////////////////////////
   * Save / Load Model
   * ////////////////////////////////////////////////////////////
   */

  async save(name, callback) {
    const args = handleArguments(name, callback);
    const modelName = args.string || "model";
    // save the model
    return callCallback(
      Promise.all([
        this.neuralNetwork.save(modelName),
        this.neuralNetworkData.saveMeta(modelName),
      ]),
      args.callback
    );
  }

  /**
   * @public - also called internally by init() when there is a modelUrl in the options
   * load a model and metadata
   * @param {string | FileList | Object} filesOrPath - The URL of the file to load,
   *  or a FileList object (.files) from an HTML element <input type="file">.
   * @param {ML5Callback<void[]>} [callback] Optional - A function to call when the loading is complete.
   * @return {Promise<void[]>}
   */
  async load(filesOrPath, callback) {
    return callCallback(
      Promise.all([
        this.neuralNetwork.load(filesOrPath),
        this.neuralNetworkData.loadMeta(filesOrPath),
      ]),
      callback
    );
  }

  /**
   * dispose and release memory for a model
   */
  dispose() {
    this.neuralNetwork.dispose();
  }

  padCoordinates(coordinates, targetPointCount) {
    const maxEpsilon = int(coordinates.length / 2);
    return tsUtils.padCoordinates(coordinates, targetPointCount, maxEpsilon);
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
