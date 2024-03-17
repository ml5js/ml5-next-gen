import * as tf from '@tensorflow/tfjs';

/**
 * Separate all task-dependent logic into separate task objects to minimize if/else
 * behavior in the main Neural Network class and make it easier to potentially add
 * more tasks in the future.
 * May want these to be classes which get the nn instance in the constructor.
 */

/**
 * @typedef {'classification' | 'regression' | 'imageClassification'} TaskName
 */


/**
 * A LayerJson object contains the arguments of the tf.layers function
 * and a `type` property with the name of the function.
 *
 * @typedef {Object} LayerJson
 * @property {string} type
 */

/**
 * @typedef {Object} NNTask
 * Defines all behavior which varies based on the task.
 *
 * @property {TaskName} name
 *
 * @property {() => Object} [getDefaultOptions] - Optional.
 * Override any of the default neural network options with defaults that are
 * specific to this task.
 *
 * @property {(learningRate: number) => tf.ModelCompileArgs} getCompileOptions
 * This function will be called before compiling the model and should return
 * the compile options for this task (optimizer, loss, and [optional] metrics).
 * Receives the `learningRate` as an argument.
 * Note: learningRate is always the first arg of the optimizer, but some
 * optimizers support other optional args as well
 *
 * @property {(inputShape: tf.Shape, hiddenUnits: number, outputUnits: number) => LayerJson[]} createLayers
 * Function to create the standard layers for this task.
 * Will receive the inputShape, hiddenUnits, and outputUnits from the neural network.
 *
 * @property {(
 *    inputs: number | string[] | number[],
 *    outputs: number | string[]
 *  ) => { xs: number[], ys: (string | number)[] }[]
 * } getSampleData
 * Function to create empty training data for use with neuro-evolution.
 * Should return an array of objects with properties xs and ys.
 * Receives the inputs and the outputs from the options of the neural network.
 *
 * TODO: parseInputs and parseOutputs
 */

// TODO: move elsewhere
function isStringArray(value) {
  return Array.isArray(value) && value.some(v => typeof v === 'string');
}

/**
 * Handling of input sample is the same for all tasks.
 * @param {number | string[] | number[]} inputs
 * @return {number[]}
 */
function getSampleInput(inputs) {
  if (isStringArray(inputs)) {
    throw new Error(`'inputs' cannot be an array of property names when using option 'noTraining'.  You must specify the number of inputs.`);
  }
  const inputSize = Array.isArray(inputs) ? inputs.reduce((a, b) => a * b) : inputs;
  return new Array(inputSize).fill(0);
}

/**
 * @type NNTask
 */
const classificationTask = {
  name: 'classification',
  getCompileOptions(learningRate) {
    return {
      loss: 'categoricalCrossentropy',
      optimizer: tf.train.sgd(learningRate),
      metrics: ['accuracy'],
    }
  },
  createLayers(inputShape, hiddenUnits, outputUnits) {
    return [
      {
        type: 'dense',
        units: hiddenUnits,
        activation: 'relu',
        inputShape
      },
      {
        type: 'dense',
        activation: 'softmax',
        units: outputUnits,
      },
    ];
  },
  getSampleData(inputs, outputs) {
    if (!isStringArray(outputs)) {
      throw new Error(`Invalid outputs ${outputs}. Outputs must be an array of label names when using option 'noTraining' with task 'classification'.`);
    }
    const xs = getSampleInput(inputs);
    return outputs.map(label => ({ xs, ys: [label] }));
  }
}

/**
 * @type NNTask
 */
const imageClassificationTask = {
  name: 'imageClassification',
  getDefaultOptions() {
    return {
      learningRate: 0.02
    }
  },
  getCompileOptions: classificationTask.getCompileOptions,
  createLayers(inputShape, hiddenUnits, outputUnits) {
    return [
      {
        type: 'conv2d',
        filters: 8,
        kernelSize: 5,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
        inputShape,
      },
      {
        type: 'maxPooling2d',
        poolSize: [2, 2],
        strides: [2, 2],
      },
      {
        type: 'conv2d',
        filters: 16,
        kernelSize: 5,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
      },
      {
        type: 'maxPooling2d',
        poolSize: [2, 2],
        strides: [2, 2],
      },
      {
        type: 'flatten',
      },
      {
        type: 'dense',
        kernelInitializer: 'varianceScaling',
        activation: 'softmax',
        units: outputUnits,
      },
    ];
  },
  getSampleData: classificationTask.getSampleData
}

/**
 * @type NNTask
 */
const regressionTask = {
  name: 'regression',
  getCompileOptions(learningRate) {
    return {
      loss: 'meanSquaredError',
      optimizer: tf.train.adam(learningRate),
      metrics: ['accuracy'],
    };
  },
  createLayers(inputShape, hiddenUnits, outputUnits) {
    return [
      {
        type: 'dense',
        units: hiddenUnits,
        activation: 'relu',
        inputShape
      },
      {
        type: 'dense',
        activation: 'sigmoid',
        units: outputUnits,
      },
    ];
  },
  getSampleData(inputs, outputs) {
    if (typeof outputs !== 'number') {
      throw new Error(`Invalid outputs ${outputs}. Outputs must be a number when using option 'noTraining' with task 'regression'.`);
    }
    return [{
      xs: getSampleInput(inputs),
      ys: new Array(outputs).fill(0)
    }]
  }
}

/**
 * Mapping of supported task configurations and their task names.
 * Use lowercase keys to make the lookup case-insensitive.
 */
const TASKS = {
  regression: regressionTask,
  classification: classificationTask,
  imageclassification: imageClassificationTask,
}

/**
 * Get the correct task object based on the task name.
 * @param {TaskName | string} name
 * @return {NNTask}
 */
export default function getTask(name) {
  const task = TASKS[name.toLowerCase()];
  if (!task) {
    throw new Error(`Unknown task name '${name}'. Task must be one of ${Object.keys(TASKS).join(', ')}`);
  }
  return task;
}
