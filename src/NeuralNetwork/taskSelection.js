import DiyNeuralNetwork from "./index.js";
import DIYSequential from "./Sequential/index.js";

// helper function to check if tasks follows specified convention
const isSequenceTask = (task) => {
  const sequenceTask = [
    "sequenceClassification",
    "sequenceRegression",
    "sequenceClassificationWithCNN",
    "sequenceRegressionWithCNN",
  ];
  return sequenceTask.includes(task);
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

// factory function for DIY Sequential
const createSequential = (inputsOrOptions, outputsOrCallback, callback) => {
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

  const instance = new DIYSequential(options, cb);
  return instance;
};

// Selection logic for either NeuralNetwork or Sequential
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
  if (isSequenceTask(options.task)) {
    return createSequential(inputsOrOptions, outputsOrCallback, callback);
  } else {
    return createNeuralNetwork(inputsOrOptions, outputsOrCallback, callback);
  }
};

export default neuralNetwork;
