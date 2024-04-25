import * as tf from "@tensorflow/tfjs";
import { saveBlob } from "../utils/io";
import { randomGaussian } from "../utils/random";

class NeuralNetwork {
  constructor() {
    // flags
    this.isTrained = false;
    this.isCompiled = false;
    this.isLayered = false;
    /**
     * @type {tf.Sequential | null} - the TensorFlow model
     */
    this.model = null;

    // methods
    this.init = this.init.bind(this);
    this.createModel = this.createModel.bind(this);
    this.addLayer = this.addLayer.bind(this);
    this.compile = this.compile.bind(this);
    this.setOptimizerFunction = this.setOptimizerFunction.bind(this);
    this.train = this.train.bind(this);
    this.predict = this.predict.bind(this);
    this.classify = this.classify.bind(this);
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);

    // initialize
    this.init();
  }

  /**
   * initialize with create model
   */
  init() {
    this.createModel();
  }

  /**
   * creates a sequential model
   * uses switch/case for potential future where different formats are supported
   * @param {*} _type
   */
  createModel(_type = "sequential") {
    switch (_type.toLowerCase()) {
      case "sequential":
        this.model = tf.sequential();
        return this.model;
      default:
        this.model = tf.sequential();
        return this.model;
    }
  }

  /**
   * add layer to the model
   * if the model has 2 or more layers switch the isLayered flag
   * @param {tf.Layer} layer
   * @void
   */
  addLayer(layer) {
    this.model.add(layer);

    // check if it has at least an input and output layer
    if (this.model.layers.length >= 2) {
      this.isLayered = true;
    }
  }

  /**
   * Compile the model
   * if the model is compiled, set the isCompiled flag to true
   * @param {*} _modelOptions
   */
  compile(_modelOptions) {
    this.model.compile(_modelOptions);
    this.isCompiled = true;
  }

  /**
   * Set the optimizer function given the learning rate
   * as a parameter
   * @param {*} learningRate
   * @param {*} optimizer
   */
  setOptimizerFunction(learningRate, optimizer) {
    return optimizer.call(this, learningRate);
  }

  /**
   * Train the model
   * @param {Object} _options
   */
  async train(_options) {
    const TRAINING_OPTIONS = _options;

    const xs = TRAINING_OPTIONS.inputs;
    const ys = TRAINING_OPTIONS.outputs;

    const { batchSize, epochs, shuffle, validationSplit, whileTraining } =
      TRAINING_OPTIONS;

    await this.model.fit(xs, ys, {
      batchSize,
      epochs,
      shuffle,
      validationSplit,
      callbacks: whileTraining,
    });

    xs.dispose();
    ys.dispose();

    this.isTrained = true;
  }

  /**
   * returns the prediction as an array synchronously
   * @param {*} _inputs
   */
  predictSync(_inputs) {
    const output = tf.tidy(() => {
      return this.model.predict(_inputs);
    });
    const result = output.arraySync();

    output.dispose();
    _inputs.dispose();

    return result;
  }

  /**
   * returns the prediction as an array
   * @param {*} _inputs
   */
  async predict(_inputs) {
    const output = tf.tidy(() => {
      return this.model.predict(_inputs);
    });
    const result = await output.array();

    output.dispose();
    _inputs.dispose();

    return result;
  }

  /**
   * classify is the same as .predict()
   * @param {*} _inputs
   */
  async classify(_inputs) {
    return this.predict(_inputs);
  }

  /**
   * classify is the same as .predict()
   * @param {*} _inputs
   */
  classifySync(_inputs) {
    return this.predictSync(_inputs);
  }

  // predictMultiple
  // classifyMultiple
  // are the same as .predict()

  /**
   * save the model.json and the weights.bin files
   * @param {string} modelName
   * @return {Promise<void>}
   */
  async save(modelName = "model") {
    await this.model.save(
      tf.io.withSaveHandler(async (data) => {
        this.weightsManifest = {
          modelTopology: data.modelTopology,
          weightsManifest: [
            {
              paths: [`./${modelName}.weights.bin`],
              weights: data.weightSpecs,
            },
          ],
        };

        await saveBlob(
          data.weightData,
          `${modelName}.weights.bin`,
          "application/octet-stream"
        );
        await saveBlob(
          JSON.stringify(this.weightsManifest),
          `${modelName}.json`,
          "text/plain"
        );
      })
    );
  }

  /**
   * loads the model and weights
   * @param {string | FileList | Object} filesOrPath
   */
  async load(filesOrPath) {
    if (filesOrPath instanceof FileList) {
      const files = Array.from(filesOrPath);
      // find the correct files
      const model = files.find((file) => file.name.includes(".json") && !file.name.includes("_meta"));
      const weights = files.find((file) => file.name.includes(".bin"));
      // load the model
      this.model = await tf.loadLayersModel(
        tf.io.browserFiles([model, weights])
      );
    } else if (filesOrPath instanceof Object) {
      this.model = await tf.loadLayersModel(
        tf.io.http(filesOrPath.model, {
          // Override the weights path from the JSON weightsManifest
          weightUrlConverter: (weightFileName) => {
            return filesOrPath.weights || weightFileName;
          }
        })
      );
    } else {
      this.model = await tf.loadLayersModel(filesOrPath);
    }

    this.isCompiled = true;
    this.isLayered = true;
    this.isTrained = true;
  }

  /**
   * dispose and release the memory for the model
   */
  dispose() {
    this.model.dispose();
  }

  // NeuroEvolution Functions

  /**
   * mutate the weights of a model
   * @param {*} rate
   * @param {*} mutateFunction
   */

  mutate(rate = 0.1, mutateFunction) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];
      for (let i = 0; i < weights.length; i += 1) {
        const tensor = weights[i];
        const { shape } = weights[i];
        // TODO: Evaluate if this should be sync or not
        const values = tensor.dataSync().slice();
        for (let j = 0; j < values.length; j += 1) {
          if (Math.random() < rate) {
            if (mutateFunction) {
              values[j] = mutateFunction(values[j]);
            } else {
              values[j] = Math.min(
                Math.max(values[j] + randomGaussian(), -1),
                1
              );
            }
          }
        }
        const newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      this.model.setWeights(mutatedWeights);
    });
  }

  /**
   * create a new neural network with crossover
   * @param {*} other
   */
  crossover(other) {
    return tf.tidy(() => {
      const weightsA = this.model.getWeights();
      const weightsB = other.model.getWeights();
      const childWeights = [];
      for (let i = 0; i < weightsA.length; i += 1) {
        const tensorA = weightsA[i];
        const tensorB = weightsB[i];
        const { shape } = weightsA[i];
        // TODO: Evaluate if this should be sync or not
        const valuesA = tensorA.dataSync().slice();
        const valuesB = tensorB.dataSync().slice();
        for (let j = 0; j < valuesA.length; j += 1) {
          if (Math.random() < 0.5) {
            valuesA[j] = valuesB[j];
          }
        }
        const newTensor = tf.tensor(valuesA, shape);
        childWeights[i] = newTensor;
      }
      this.model.setWeights(childWeights);
    });
  }
}
export default NeuralNetwork;
