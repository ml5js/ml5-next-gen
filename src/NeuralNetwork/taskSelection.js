import DiyNeuralNetwork from "./index.js";
import DIYTimesSeries from "./Sequential/index.js";

// helper function to check if tasks follows specified convention
const isTimeSeriesTask = (task) => {
  const timeSeriesTasks = [
    "sequenceClassification",
    "sequenceRegression",
    "sequenceClassificationConv",
    "sequenceRegressionConv",
  ];
  return timeSeriesTasks.includes(task);
};

// factory function for DIY Neural Network
const createNeuralNetwork = (inputsOrOptions, outputsOrCallback, callback) => {
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

  const instance = new DiyNeuralNetwork(options, cb);
  return instance;
};

// factory function for DIY Timeseries
const createTimeSeries = (inputsOrOptions, outputsOrCallback, callback) => {
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

// Selection logic for either NeuralNetwork or TimeSeries
const neuralNetwork = (inputsOrOptions, outputsOrCallback, callback) => {
  let options;

  // Parse options first to check the task
  if (inputsOrOptions instanceof Object) {
    options = inputsOrOptions;
  } else {
    options = {
      inputs: inputsOrOptions,
      outputs: outputsOrCallback,
    };
  }

  // Choose which factory function to call based on task
  if (isTimeSeriesTask(options.task)) {
    return createTimeSeries(inputsOrOptions, outputsOrCallback, callback);
  } else {
    return createNeuralNetwork(inputsOrOptions, outputsOrCallback, callback);
  }
};

export default neuralNetwork;
