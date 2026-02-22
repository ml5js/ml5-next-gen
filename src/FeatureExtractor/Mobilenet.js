/*
 * FeatureExtractor using MobileNet for transfer learning.
 * Supports classification and regression tasks.
 */

import * as tf from "@tensorflow/tfjs";
import axios from "axios";
import handleOptions from "../utils/handleOptions";
import { mediaReady } from "../utils/imageUtilities";
import { saveBlob } from "../utils/io";
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
  task: "classification",
  version: 1,
  alpha: 1.0,
  learningRate: 0.0001,
  hiddenUnits: 100,
  epochs: 20,
  batchSize: 0.4,
};

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
        task: {
          type: "enum",
          enums: ["classification", "regression"],
          default: DEFAULTS.task,
        },
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

    this.ready = callCallback(this.loadModel(), callback);
  }

  async loadModel() {
    await tf.ready();

    // TODO: For Debug, remove this console log before release
    console.log(
      "Loading MobileNet Feature Vector model from URL:",
      this.featureVectorURL
    );

    this.featureVector = await tf.loadGraphModel(this.featureVectorURL, {
      fromTFHub: true,
    });

    // TODO: For Debug, remove this console log before release
    console.log("MobileNet Feature Vector model loaded.");

    this.normalizationOffset = tf.scalar(127.5);

    return this;
  }

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

  addImage(image, label, callback) {
    const addImageInternal = async () => {
      if (image === undefined || image === null) {
        throw new Error(
          "FeatureExtractor error: addImage() requires an image as the first argument."
        );
      }

      if (label === undefined || label === null) {
        throw new Error(
          "FeatureExtractor error: addImage() requires a label as the second argument."
        );
      }

      if (this.config.task === "regression" && typeof label !== "number") {
        throw new Error(
          "FeatureExtractor error: For regression, the label must be a number."
        );
      }

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

      return { label, featuresLength: features.length };
    };

    return callCallback(addImageInternal(), callback);
  }

  train(whileTrainingCb, finishedCb) {
    let whileCb = null;
    let doneCb = null;

    if (typeof whileTrainingCb === "function") {
      if (typeof finishedCb === "function") {
        whileCb = whileTrainingCb;
        doneCb = finishedCb;
      } else {
        doneCb = whileTrainingCb;
      }
    }

    const trainInternal = async () => {
      if (this.trainingData.length === 0) {
        throw new Error(
          "FeatureExtractor error: No training data. Add images using addImage() before training."
        );
      }

      if (this.config.task === "classification" && this.labelIndex.length < 2) {
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
      const isClassification = this.config.task === "classification";
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
            if (whileCb) {
              whileCb(epoch, logs);
            }
          },
        },
      });

      xs.dispose();
      ys.dispose();

      this.isTrained = true;
      return { epochs: this.config.epochs, loss: "training complete" };
    };

    return callCallback(trainInternal(), doneCb);
  }

  classify(image, callback) {
    const classifyInternal = async () => {
      if (this.config.task !== "classification") {
        throw new Error(
          "FeatureExtractor error: classify() is for classification task. For regression task, use predict() instead."
        );
      }

      if (!this.MLP) {
        throw new Error(
          "FeatureExtractor error: No trained model. Train the model (train()) or load a weight (load()) before classify()."
        );
      }

      if (image === undefined || image === null) {
        throw new Error(
          "FeatureExtractor error: classify() requires an image as the first argument."
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
    };

    return callCallback(classifyInternal(), callback);
  }

  predict(image, callback) {
    const predictInternal = async () => {
      if (this.config.task !== "regression") {
        throw new Error(
          "FeatureExtractor error: predict() is for regression task. Use classify() instead."
        );
      }

      if (!this.MLP) {
        throw new Error(
          "FeatureExtractor error: No trained model. Call train() before predict()."
        );
      }

      if (image === undefined || image === null) {
        throw new Error(
          "FeatureExtractor error: predict() requires an image as the first argument."
        );
      }

      const featureTensor = await this.extractFeatures(image);
      const prediction = this.MLP.predict(featureTensor);
      const values = await prediction.data();

      featureTensor.dispose();
      prediction.dispose();

      return [{ value: values[0] }];
    };

    return callCallback(predictInternal(), callback);
  }

  load(filesOrPath, callback) {
    const loadInternal = async () => {
      let modelPath;
      let metadataPath;

      if (typeof filesOrPath === "string") {
        modelPath = filesOrPath;
        metadataPath = filesOrPath.replace("model.json", "model_meta.json");

        this.MLP = await tf.loadLayersModel(modelPath);

        try {
          const response = await axios.get(metadataPath);
          const metadata = response.data;
          this.labelIndex = metadata.labelIndex || [];
          if (metadata.task) {
            this.config.task = metadata.task;
          }
        } catch (e) {
          console.warn(
            "🟪 FeatureExtractor warning: Could not load metadata. Using defaults."
          );
        }
      } else if (
        filesOrPath instanceof FileList ||
        Array.isArray(filesOrPath)
      ) {
        const files = Array.from(filesOrPath);
        const modelFile = files.find(
          (f) => f.name === "model.json" || f.name.endsWith("model.json")
        );
        const weightsFile = files.find(
          (f) => f.name.endsWith(".bin") || f.name.includes("weights")
        );
        const metaFile = files.find(
          (f) => f.name.includes("_meta.json") || f.name === "metadata.json"
        );

        if (!modelFile) {
          throw new Error(
            "🟪 FeatureExtractor error: model.json file not found in provided files."
          );
        }

        this.MLP = await tf.loadLayersModel(
          tf.io.browserFiles([modelFile, weightsFile].filter(Boolean))
        );

        if (metaFile) {
          const metaText = await metaFile.text();
          const metadata = JSON.parse(metaText);
          this.labelIndex = metadata.labelIndex || [];
          if (metadata.task) {
            this.config.task = metadata.task;
          }
        }
      }

      this.isTrained = true;
      this.trainingData = [];

      return { loaded: true };
    };

    return callCallback(loadInternal(), callback);
  }

  save(callbackOrName, name) {
    let callback;
    let modelName = "featureExtractor-model";

    if (typeof callbackOrName === "function") {
      callback = callbackOrName;
      if (typeof name === "string") {
        modelName = name;
      }
    } else if (typeof callbackOrName === "string") {
      modelName = callbackOrName;
      if (typeof name === "function") {
        callback = name;
      }
    }

    const saveInternal = async () => {
      if (!this.MLP) {
        throw new Error(
          "🟪 FeatureExtractor error: No trained model to save. Please train the model first."
        );
      }

      await this.MLP.save(`downloads://${modelName}`);

      const metadata = {
        task: this.config.task,
        labelIndex: this.labelIndex,
        version: 1,
        config: {
          hiddenUnits: this.config.hiddenUnits,
        },
      };

      const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: "application/json",
      });
      saveBlob(metadataBlob, `${modelName}_meta.json`);

      return { modelName };
    };

    return callCallback(saveInternal(), callback);
  }
}

export default Mobilenet;
