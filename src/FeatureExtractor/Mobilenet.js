/*
 * FeatureExtractor using MobileNet for transfer learning.
 * Supports classification and regression tasks.
 */

import * as tf from "@tensorflow/tfjs";
import handleOptions from "../utils/handleOptions";
import { mediaReady } from "../utils/imageUtilities";
import callCallback from "../utils/callcallback";
import { getImageElement } from "../utils/handleArguments";

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
  version: 1,
  alpha: 1.0,
  learningRate: 0.0001,
  hiddenUnits: 100,
  epochs: 20,
  batchSize: 0.4,
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
        epochs: {
          type: "number",
          min: 1,
          integer: true,
          default: DEFAULTS.epochs,
        },
        hiddenUnits: {
          type: "number",
          min: 1,
          integer: true,
          default: DEFAULTS.hiddenUnits,
        },
        learningRate: {
          type: "number",
          min: 0,
          default: DEFAULTS.learningRate,
        },
        batchSize: {
          type: "number",
          min: 0,
          max: 1,
          default: DEFAULTS.batchSize,
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
    this.modelLoaded = false;
    this.hasAnyTrainedClass = false;
    this.usageType = null; // set by classification() or regression()
    this.isPredicting = false;
    this.video = null;

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

    console.log("MobileNet Feature Vector model loaded.");

    this.normalizationOffset = tf.scalar(127.5);
    this.modelLoaded = true;

    return this;
  }

  /**
   * Create a classifier using the feature extractor.
   * @param {HTMLVideoElement|Object} [video] - A video element to use as input.
   * @param {Function} [callback] - Callback when video is ready.
   * @returns {this}
   */
  classification(video, callback) {
    this.usageType = "classifier";

    if (typeof video === "function") {
      callback = video;
      video = null;
    }

    if (video) {
      this.video = video;
      if (callback) {
        const checkVideo = async () => {
          await mediaReady(video, true);
          return this;
        };
        callCallback(checkVideo(), callback);
      }
    }

    return this;
  }

  /**
   * Create a regressor using the feature extractor.
   * @param {HTMLVideoElement|Object} [video] - A video element to use as input.
   * @param {Function} [callback] - Callback when video is ready.
   * @returns {this}
   */
  regression(video, callback) {
    this.usageType = "regressor";

    if (typeof video === "function") {
      callback = video;
      video = null;
    }

    if (video) {
      this.video = video;
      if (callback) {
        const checkVideo = async () => {
          await mediaReady(video, true);
          return this;
        };
        callCallback(checkVideo(), callback);
      }
    }

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
    const imgElement = getImageElement(input);
    await mediaReady(imgElement, false);

    const preprocessed = this.normalizeAndResize(imgElement);
    const features = this.featureVector.predict(preprocessed);
    preprocessed.dispose();

    return features;
  }

  /**
   * Add an image to the training data.
   * If no input is provided and a video was set via classification()/regression(), the video frame is used.
   * @param {*} inputOrLabel - An image element, or a label if using video.
   * @param {string|number} [labelOrCallback] - The label, or callback if label is first arg.
   * @param {Function} [callback] - Optional callback.
   */
  addImage(inputOrLabel, labelOrCallback, callback) {
    let image;
    let label;
    let cb;

    // Determine if first arg is a label (string/number) or an image element
    if (typeof inputOrLabel === "string" || typeof inputOrLabel === "number") {
      // addImage(label, callback) — use video as input
      image = this.video;
      label = inputOrLabel;
      cb = typeof labelOrCallback === "function" ? labelOrCallback : callback;
    } else {
      // addImage(input, label, callback)
      image = inputOrLabel;
      label = labelOrCallback;
      cb = callback;
    }

    const addImageInternal = async () => {
      if (image === undefined || image === null) {
        throw new Error(
          "FeatureExtractor error: addImage() requires an image or a video set via classification()/regression()."
        );
      }

      if (label === undefined || label === null) {
        throw new Error("FeatureExtractor error: addImage() requires a label.");
      }

      if (this.usageType === "regressor" && typeof label !== "number") {
        throw new Error(
          "FeatureExtractor error: For regression, the label must be a number."
        );
      }

      const featureTensor = await this.extractFeatures(image);
      const features = await featureTensor.data();
      featureTensor.dispose();

      if (this.usageType === "classifier" || this.usageType === null) {
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

      this.hasAnyTrainedClass = true;
      return { label, featuresLength: features.length };
    };

    return callCallback(addImageInternal(), cb);
  }

  train(whileTrainingCb, finishedCb) {
    let whileCb = null;
    let doneCb = null;

    if (typeof whileTrainingCb === "function") {
      if (typeof finishedCb === "function") {
        whileCb = whileTrainingCb;
        doneCb = finishedCb;
      } else {
        whileCb = whileTrainingCb;
      }
    }

    const trainInternal = async () => {
      if (this.trainingData.length === 0) {
        throw new Error(
          "FeatureExtractor error: No training data. Add images using addImage() before training."
        );
      }

      const isClassification = this.usageType !== "regressor";

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
          units: this.config.hiddenUnits,
          activation: "relu",
        })
      );
      this.MLP.add(
        tf.layers.dense({
          units: numOutputs,
          activation: isClassification ? "softmax" : "linear",
        })
      );

      const optimizer = tf.train.adam(this.config.learningRate);

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
        Math.floor(this.trainingData.length * this.config.batchSize)
      );

      await this.MLP.fit(xs, ys, {
        epochs: this.config.epochs,
        batchSize,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const currentEpoch = epoch + 1;
            console.log(
              `Epoch ${currentEpoch}/${this.config.epochs} - loss: ${logs.loss}`
            );
            if (whileCb) {
              whileCb(logs.loss);
            }
          },
        },
      });

      xs.dispose();
      ys.dispose();

      this.isTrained = true;
      console.log("Training complete!");
      return { epochs: this.config.epochs, loss: "training complete" };
    };

    return callCallback(trainInternal(), doneCb);
  }

  /**
   * Classify an image. If no input is provided, uses the video set via classification().
   * @param {*} [inputOrCallback] - An image element, or callback if using video.
   * @param {Function} [callback]
   */
  classify(inputOrCallback, callback) {
    let image;
    let cb;

    if (typeof inputOrCallback === "function") {
      image = this.video;
      cb = inputOrCallback;
    } else {
      image = inputOrCallback || this.video;
      cb = callback;
    }

    const classifyInternal = async () => {
      if (this.usageType === "regressor") {
        throw new Error(
          "FeatureExtractor error: classify() is for classification. For regression, use predict() instead."
        );
      }

      if (!this.MLP) {
        throw new Error(
          "FeatureExtractor error: No trained model. Train the model (train()) or load weights (load()) before classify()."
        );
      }

      if (image === undefined || image === null) {
        throw new Error(
          "FeatureExtractor error: classify() requires an image or a video set via classification()."
        );
      }

      this.isPredicting = true;

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

      this.isPredicting = false;
      return results;
    };

    return callCallback(classifyInternal(), cb);
  }

  /**
   * Predict a value for an image (regression). If no input is provided, uses the video.
   * @param {*} [inputOrCallback] - An image element, or callback if using video.
   * @param {Function} [callback]
   */
  predict(inputOrCallback, callback) {
    let image;
    let cb;

    if (typeof inputOrCallback === "function") {
      image = this.video;
      cb = inputOrCallback;
    } else {
      image = inputOrCallback || this.video;
      cb = callback;
    }

    const predictInternal = async () => {
      if (this.usageType === "classifier") {
        throw new Error(
          "FeatureExtractor error: predict() is for regression. Use classify() instead."
        );
      }

      if (!this.MLP) {
        throw new Error(
          "FeatureExtractor error: No trained model. Call train() before predict()."
        );
      }

      if (image === undefined || image === null) {
        throw new Error(
          "FeatureExtractor error: predict() requires an image or a video set via regression()."
        );
      }

      this.isPredicting = true;

      const featureTensor = await this.extractFeatures(image);
      const prediction = this.MLP.predict(featureTensor);
      const values = await prediction.data();

      featureTensor.dispose();
      prediction.dispose();

      this.isPredicting = false;
      return [{ value: values[0] }];
    };

    return callCallback(predictInternal(), cb);
  }

  /**
   * Save the trained model weights.
   * @param {Function} [callback] - Optional callback.
   * @param {string} [name='model'] - Name for the saved files.
   */
  save(callback, name = "model") {
    const saveInternal = async () => {
      if (!this.MLP) {
        throw new Error("FeatureExtractor error: No trained model to save.");
      }
      await this.MLP.save(`downloads://${name}`);
      return this;
    };

    return callCallback(saveInternal(), callback);
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
      return this;
    };

    return callCallback(loadInternal(), callback);
  }
}

export default Mobilenet;
