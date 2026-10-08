/*
 * FeatureExtractor using MobileNet for transfer learning.
 * Supports classification and regression tasks.
 */

import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import handleOptions from "../utils/handleOptions";
import { mediaReady } from "../utils/imageUtilities";
import callCallback from "../utils/callcallback";
import handleArguments, { getImageElement } from "../utils/handleArguments";

const IMAGE_SIZE = 224;
const IMAGE_RESIZE_DIMENSIONS = [IMAGE_SIZE, IMAGE_SIZE];

const MOBILENET_FEATURE_VECTOR_URL = {
  1: {
    0.25: "https://www.kaggle.com/models/google/mobilenet-v1/TfJs/025-224-feature-vector/2",
    0.5: "https://www.kaggle.com/models/google/mobilenet-v1/TfJs/050-224-feature-vector/2",
    0.75: "https://www.kaggle.com/models/google/mobilenet-v1/TfJs/075-224-feature-vector/2",
    1.0: "https://www.kaggle.com/models/google/mobilenet-v1/TfJs/100-224-feature-vector/2",
  },
  2: {
    0.5: "https://www.kaggle.com/models/google/mobilenet-v2/TfJs/050-224-feature-vector/3",
    0.75: "https://www.kaggle.com/models/google/mobilenet-v2/TfJs/075-224-feature-vector/3",
    1.0: "https://www.kaggle.com/models/google/mobilenet-v2/TfJs/100-224-feature-vector/3",
  },
};

const DEFAULTS = {
  version: 2,
  alpha: 1.0,
  task: "classification",
};

const TRAINING_DEFAULTS = {
  epochs: 20,
  hiddenUnits: 100,
  learningRate: 0.0001,
  batchSize: 0.4,
  debug: false,
};

// Validate that the provided version and alpha combination is valid
function validateVersionAlphaCombination(version, alpha) {
  const validVersion = MOBILENET_FEATURE_VECTOR_URL[version];

  if (!validVersion) {
    throw new Error(
      `FeatureExtractor error: MobileNet version ${version} is not supported.\n\n` +
        `Supported versions: 1, 2`
    );
  }

  const validAlpha = validVersion[alpha];

  if (!validAlpha) {
    const availableAlphas = Object.keys(validVersion).join(", ");
    throw new Error(
      `FeatureExtractor error: MobileNet v${version} does not support alpha ${alpha}.\n\n` +
        `Supported alpha values for v${version}: ${availableAlphas}`
    );
  }
}

class Mobilenet {
  constructor(options = {}, callback) {
    this.config = handleOptions(
      options,
      {
        version: {
          type: "enum",
          enums: [1, 2],
          default: DEFAULTS.version,
        },
        alpha: {
          type: "enum",
          enums: (config) => {
            const version = config.version || DEFAULTS.version;
            return Object.keys(MOBILENET_FEATURE_VECTOR_URL[version]).map(
              Number
            );
          },
          default: DEFAULTS.alpha,
        },
        task: {
          type: "enum",
          enums: ["classification", "regression"],
          default: DEFAULTS.task,
        },
      },
      "featureExtractor"
    );

    validateVersionAlphaCombination(this.config.version, this.config.alpha);

    this.MLP = null;
    this.featureVector = null;
    this.featureVectorURL =
      options.featureVectorURL ||
      MOBILENET_FEATURE_VECTOR_URL[this.config.version][this.config.alpha];
    this.normalizationOffset = null;

    this.labelIndex = [];
    this.trainingData = [];
    this.isTrained = false;
    this.isPredicting = false;
    this.signalStop = false;
    this.isClassifying = false;
    this.prevCall = null;

    this.ready = callCallback(this.loadModel(), callback);
  }

  async loadModel() {
    await tf.ready();

    console.log(
      "Loading MobileNet Feature Vector model from URL:",
      this.featureVectorURL
    );

    this.featureVector = await tf.loadGraphModel(this.featureVectorURL, {
      fromTFHub: true,
    });

    this.normalizationOffset = tf.scalar(127.5);

    return this;
  }

  // Preprocess the input image: convert to tensor, normalize, resize, and add batch dimension
  normalizeAndResize(input) {
    return tf.tidy(() => {
      let img = input;

      if (!(img instanceof tf.Tensor)) {
        img = tf.browser.fromPixels(img);
      }

      const normalized = img
        .toFloat()
        .sub(this.normalizationOffset)
        .div(this.normalizationOffset);

      let resized = normalized;
      if (img.shape[0] !== IMAGE_SIZE || img.shape[1] !== IMAGE_SIZE) {
        const alignCorners = true;
        resized = tf.image.resizeBilinear(
          normalized,
          IMAGE_RESIZE_DIMENSIONS,
          alignCorners
        );
      }

      const batched = resized.expandDims(0);
      return batched;
    });
  }

  async extractFeatures(input) {
    if (!this.featureVector) {
      throw new Error(
        "FeatureExtractor error: this instance has been disposed; create a new featureExtractor."
      );
    }

    const imgElement = getImageElement(input);
    await mediaReady(imgElement, false);

    const preprocessed = this.normalizeAndResize(imgElement);
    const features = this.featureVector.predict(preprocessed);
    preprocessed.dispose();

    return features;
  }

  /**
   * Add an image (or video frame) to the training data.
   * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|object} input - An image, video, or canvas element (or p5 image/video).
   * @param {string|number} label - The label for this sample. String or number for classification; number for regression.
   * @param {Function} [callback] - Optional callback.
   */
  addImage(input, label, callback) {
    const addImageInternal = async () => {
      const { image } = handleArguments(input).require(
        "image",
        "FeatureExtractor error: addImage() requires an image or video element."
      );

      if (label === undefined || label === null) {
        throw new Error("FeatureExtractor error: addImage() requires a label.");
      }

      if (
        this.config.task === "regression" &&
        (typeof label !== "number" || Number.isNaN(label))
      ) {
        throw new Error(
          "FeatureExtractor error: For regression, the label must be a valid number."
        );
      }

      await this.ready;
      const featureTensor = await this.extractFeatures(image);
      const features = await featureTensor.data();
      featureTensor.dispose();

      if (this.config.task === "classification") {
        if (!this.labelIndex.includes(label)) {
          this.labelIndex.push(label);
        }
        this.trainingData.push({
          features: new Float32Array(features),
          label,
        });
      } else {
        this.trainingData.push({
          features: new Float32Array(features),
          value: Number(label),
        });
      }
    };

    return callCallback(addImageInternal(), callback);
  }

  /**
   * Train the MLP head on the collected training data.
   * @param {Object|Function} [optionsOrCallback] - Training options, whileTraining, or finishedTraining callback.
   * @param {number} [optionsOrCallback.epochs=20] - Number of training epochs.
   * @param {number} [optionsOrCallback.hiddenUnits=100] - Hidden layer units.
   * @param {number} [optionsOrCallback.learningRate=0.0001] - Learning rate.
   * @param {number} [optionsOrCallback.batchSize=0.4] - Batch size as a fraction of total data.
   * @param {boolean} [optionsOrCallback.debug=false] - Show training visualization via tfjs-vis.
   * @param {Function} [optionsOrWhileTraining] - whileTraining callback `(epoch, logs)` fired after each epoch,
   *   or finishedTraining callback if only two args are provided.
   * @param {Function} [callback] - finishedTraining callback, called once when training completes.
   */
  train(optionsOrCallback, optionsOrWhileTraining, callback) {
    let trainOpts = {};
    let whileTrainingCb = null;
    let finishedTrainingCb = null;

    if (
      typeof optionsOrCallback === "object" &&
      typeof optionsOrWhileTraining === "function" &&
      typeof callback === "function"
    ) {
      // train(options, whileTraining, finishedTraining)
      trainOpts = optionsOrCallback;
      whileTrainingCb = optionsOrWhileTraining;
      finishedTrainingCb = callback;
    } else if (
      typeof optionsOrCallback === "object" &&
      typeof optionsOrWhileTraining === "function"
    ) {
      // train(options, finishedTraining)
      trainOpts = optionsOrCallback;
      finishedTrainingCb = optionsOrWhileTraining;
    } else if (
      typeof optionsOrCallback === "function" &&
      typeof optionsOrWhileTraining === "function"
    ) {
      // train(whileTraining, finishedTraining)
      whileTrainingCb = optionsOrCallback;
      finishedTrainingCb = optionsOrWhileTraining;
    } else if (typeof optionsOrCallback === "function") {
      // train(finishedTraining)
      finishedTrainingCb = optionsOrCallback;
    } else if (typeof optionsOrCallback === "object") {
      // train(options)
      trainOpts = optionsOrCallback;
    }

    const epochs = trainOpts.epochs || TRAINING_DEFAULTS.epochs;
    const hiddenUnits = trainOpts.hiddenUnits || TRAINING_DEFAULTS.hiddenUnits;
    const learningRate =
      trainOpts.learningRate || TRAINING_DEFAULTS.learningRate;
    const batchSizeFraction =
      trainOpts.batchSize || TRAINING_DEFAULTS.batchSize;
    const debug = trainOpts.debug === true || trainOpts.debug === "true";

    const trainInternal = async () => {
      if (this.trainingData.length === 0) {
        throw new Error(
          "FeatureExtractor error: No training data. Add images using addImage() before training."
        );
      }

      const isClassification = this.config.task === "classification";

      if (isClassification && this.labelIndex.length < 2) {
        throw new Error(
          "FeatureExtractor error: Classification requires at least 2 different labels."
        );
      }

      // Dispose previous model if retraining
      if (this.MLP) {
        this.MLP.dispose();
        this.MLP = null;
      }

      const featureSize = this.trainingData[0].features.length;
      const numOutputs = isClassification ? this.labelIndex.length : 1;

      // Initialize a new MLP model
      this.MLP = tf.sequential();
      this.MLP.add(
        tf.layers.dense({
          inputShape: [featureSize],
          units: hiddenUnits,
          activation: "relu",
        })
      );
      this.MLP.add(
        tf.layers.dense({
          units: numOutputs,
          activation: isClassification ? "softmax" : "linear",
        })
      );

      const optimizer = tf.train.adam(learningRate);

      this.MLP.compile({
        optimizer,
        loss: isClassification ? "categoricalCrossentropy" : "meanSquaredError",
      });

      // Prepare training data and label tensors
      const xsData = this.trainingData.map((d) => Array.from(d.features));
      const xs = tf.tensor2d(xsData);

      let ys;
      if (isClassification) {
        const labels = this.trainingData.map((d) =>
          this.labelIndex.indexOf(d.label)
        );
        ys = tf.oneHot(labels, numOutputs);
      } else {
        const values = this.trainingData.map((d) => [d.value]);
        ys = tf.tensor2d(values);
      }

      const batchSize = Math.max(
        1,
        Math.floor(this.trainingData.length * batchSizeFraction)
      );

      // Build callbacks
      const callbacks = [];

      if (debug) {
        const fitCallbacks = tfvis.show.fitCallbacks(
          { name: "Training Performance" },
          ["loss"],
          { height: 300, callbacks: ["onEpochEnd"] }
        );
        callbacks.push(fitCallbacks);
      }

      // Call the user's whileTraining handler after each epoch, passing (epoch, logs)
      if (whileTrainingCb) {
        callbacks.push({ onEpochEnd: whileTrainingCb });
      }

      try {
        await this.MLP.fit(xs, ys, {
          epochs,
          batchSize,
          callbacks,
        });
      } finally {
        xs.dispose();
        ys.dispose();
        optimizer.dispose();
      }

      this.isTrained = true;
      console.log("Training complete!");
    };

    return callCallback(trainInternal(), finishedTrainingCb);
  }

  /**
   * Classify a single image (classification task). Requires an input image.
   * For continuous video classification, use classifyStart().
   * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|object} inputOrCallback - An image, video, or canvas element (or p5 image/video).
   * @param {Function} [callback]
   */
  async classify(inputOrCallback, callback) {
    const { image, callback: cb } = handleArguments(
      inputOrCallback,
      callback
    ).require(
      "image",
      "FeatureExtractor error: classify() requires an input image. To classify a video, use classifyStart()."
    );

    return callCallback(this.classifyInternal(image), cb);
  }

  // Run a single classification on an already-resolved image element.
  async classifyInternal(image) {
    await this.ready;

    if (this.config.task === "regression") {
      throw new Error(
        "FeatureExtractor error: classify() is for classification. For regression, use predict() instead."
      );
    }

    if (!this.MLP) {
      throw new Error(
        "FeatureExtractor error: No trained model. Train the model (train()) or load weights (load()) before classify()."
      );
    }

    const featureTensor = await this.extractFeatures(image);
    const prediction = this.MLP.predict(featureTensor);
    const probabilities = await prediction.data();

    featureTensor.dispose();
    prediction.dispose();

    const results = this.labelIndex.map((label, i) => ({
      label,
      confidence: probabilities[i],
    }));

    results.sort((a, b) => b.confidence - a.confidence);

    return results;
  }

  /**
   * Continuously classify each frame of a video (classification task).
   * @param {HTMLVideoElement|object} inputOrCallback - A video element to classify frames from (or p5 video).
   * @param {Function} [callback] - Called with the results for each frame.
   */
  classifyStart(inputOrCallback, callback) {
    // Store the latest input/callback on the instance so a repeated
    // classifyStart() (e.g. to switch video source) actually takes effect:
    // the running loop reads these fields every frame.
    this.classifyInput = inputOrCallback;
    this.classifyCallback = callback;

    const classifyFrame = async () => {
      try {
        if (this.signalStop) {
          this.isClassifying = false;
          return;
        }

        const { image, callback: cb } = handleArguments(
          this.classifyInput,
          this.classifyCallback
        ).require(
          "image",
          "FeatureExtractor error: classifyStart() requires a video element."
        );

        await callCallback(this.classifyInternal(image), cb);

        if (this.signalStop) {
          this.isClassifying = false;
        } else {
          requestAnimationFrame(classifyFrame);
        }
      } catch (error) {
        // Reset the flag so a later classifyStart() can recover instead of
        // being permanently blocked by a stuck isClassifying === true.
        this.isClassifying = false;
        throw error;
      }
    };

    this.signalStop = false;
    if (!this.isClassifying) {
      this.isClassifying = true;
      classifyFrame();
    }
    if (this.prevCall === "start") {
      console.warn(
        "classifyStart() was called more than once without calling classifyStop(). Only the latest classifyStart() call will take effect."
      );
    }
    this.prevCall = "start";
  }

  /**
   * Stops the continuous classification started by classifyStart().
   */
  classifyStop() {
    if (this.isClassifying) {
      this.signalStop = true;
    }
    this.prevCall = "stop";
  }

  /**
   * Predict a continuous value for a single image (regression task). Requires an input image.
   * For continuous video prediction, use predictStart().
   * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|object} inputOrCallback - An image, video, or canvas element (or p5 image/video).
   * @param {Function} [callback]
   */
  async predict(inputOrCallback, callback) {
    const { image, callback: cb } = handleArguments(
      inputOrCallback,
      callback
    ).require(
      "image",
      "FeatureExtractor error: predict() requires an input image. To run on a video, use predictStart()."
    );

    return callCallback(this.predictInternal(image), cb);
  }

  // Run a single regression prediction on an already-resolved image element.
  async predictInternal(image) {
    await this.ready;

    if (this.config.task === "classification") {
      throw new Error(
        "FeatureExtractor error: predict() is for regression. Use classify() instead."
      );
    }

    if (!this.MLP) {
      throw new Error(
        "FeatureExtractor error: No trained model. Call train() before predict()."
      );
    }

    const featureTensor = await this.extractFeatures(image);
    const prediction = this.MLP.predict(featureTensor);
    const values = await prediction.data();

    featureTensor.dispose();
    prediction.dispose();

    return [{ value: values[0] }];
  }

  /**
   * Continuously predict a value for each frame of a video (regression task).
   * @param {HTMLVideoElement|object} inputOrCallback - A video element to predict frames from (or p5 video).
   * @param {Function} [callback] - Called with the result for each frame.
   */
  predictStart(inputOrCallback, callback) {
    // Store the latest input/callback on the instance so a repeated
    // predictStart() (e.g. to switch video source) actually takes effect:
    // the running loop reads these fields every frame.
    this.predictInput = inputOrCallback;
    this.predictCallback = callback;

    const predictFrame = async () => {
      try {
        if (this.signalStop) {
          this.isPredicting = false;
          return;
        }

        const { image, callback: cb } = handleArguments(
          this.predictInput,
          this.predictCallback
        ).require(
          "image",
          "FeatureExtractor error: predictStart() requires a video element."
        );

        await callCallback(this.predictInternal(image), cb);

        if (this.signalStop) {
          this.isPredicting = false;
        } else {
          requestAnimationFrame(predictFrame);
        }
      } catch (error) {
        // Reset the flag so a later predictStart() can recover instead of
        // being permanently blocked by a stuck isPredicting === true.
        this.isPredicting = false;
        throw error;
      }
    };

    this.signalStop = false;
    if (!this.isPredicting) {
      this.isPredicting = true;
      predictFrame();
    }
    if (this.prevCall === "start") {
      console.warn(
        "predictStart() was called more than once without calling predictStop(). Only the latest predictStart() call will take effect."
      );
    }
    this.prevCall = "start";
  }

  /**
   * Stops the continuous prediction started by predictStart().
   */
  predictStop() {
    if (this.isPredicting) {
      this.signalStop = true;
    }
    this.prevCall = "stop";
  }

  /**
   * Save the trained model weights.
   * @param {string} [name='model'] - Name for the saved files.
   * @param {Function} [callback] - Optional callback.
   */
  save(name, callback) {
    const args = handleArguments(name, callback);
    const modelName = args.string || "model";

    const saveInternal = async () => {
      if (!this.MLP) {
        throw new Error("FeatureExtractor error: No trained model to save.");
      }
      this.MLP.setUserDefinedMetadata({
        task: this.config.task,
        labelIndex: this.labelIndex,
      });
      await this.MLP.save(`downloads://${modelName}`);
      return this;
    };

    return callCallback(saveInternal(), args.callback);
  }

  /**
   * Load model weights from a URL or file input.
   * @param {string|FileList} filesOrPath - A URL to model.json or a FileList from an input element.
   * @param {Function} [callback] - Optional callback.
   */
  load(filesOrPath, callback) {
    const loadInternal = async () => {
      if (!filesOrPath) {
        throw new Error(
          "FeatureExtractor error: load() requires a path or files."
        );
      }

      let loadedModel;
      if (typeof filesOrPath === "string") {
        loadedModel = await tf.loadLayersModel(filesOrPath);
      } else {
        // Assume FileList from file input
        loadedModel = await tf.loadLayersModel(
          tf.io.browserFiles(Array.from(filesOrPath))
        );
      }

      this.MLP = loadedModel;
      this.isTrained = true;

      const metadata = loadedModel.getUserDefinedMetadata();
      if (metadata) {
        if (metadata.task) {
          this.config.task = metadata.task;
        }
        if (Array.isArray(metadata.labelIndex)) {
          this.labelIndex = metadata.labelIndex;
        }
      }

      return this;
    };

    return callCallback(loadInternal(), callback);
  }

  /**
   * Free the GPU/memory resources held by this instance: the MobileNet
   * feature model, the trained MLP, and the normalization scalar.
   * Call this when the FeatureExtractor is no longer needed.
   */
  dispose() {
    // Stop any running classify/predict loop first so a frame already
    // scheduled via requestAnimationFrame bails out instead of running
    // against disposed tensors.
    this.signalStop = true;
    this.isClassifying = false;
    this.isPredicting = false;

    if (this.featureVector) {
      this.featureVector.dispose();
      this.featureVector = null;
    }
    if (this.MLP) {
      this.MLP.dispose();
      this.MLP = null;
    }
    if (this.normalizationOffset) {
      this.normalizationOffset.dispose();
      this.normalizationOffset = null;
    }
  }
}

export default Mobilenet;
