// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
Image Classifier using pre-trained networks
*/

import * as tf from "@tensorflow/tfjs";
// eslint-disable-next-line no-unused-vars
import axios from "axios";
import * as mobilenet from "@tensorflow-models/mobilenet";
import handleArguments from "../utils/handleArguments";
import * as darknet from "./darknet";
import * as doodlenet from "./doodlenet";
import callCallback from "../utils/callcallback";
import { imgToTensor, mediaReady } from "../utils/imageUtilities";
import handleOptions from "../utils/handleOptions";
import { handleModelName } from "../utils/handleOptions";

const IMAGE_SIZE = 224;
const MODEL_OPTIONS = ["mobilenet", "darknet", "darknet-tiny", "doodlenet"];

/**
 * Check if a string is a valid http url
 * @param {string} string - The string to check
 * @returns {boolean} - True if the string is a valid http url
 */
function isHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (e) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

class ImageClassifier {
  /**
   * Create an ImageClassifier.
   * @param {string} modelNameOrUrl - The name or the URL of the model to use. Current model name options
   *    are: 'mobilenet', 'darknet', 'darknet-tiny', and 'doodlenet'.
   * @param {object} options - An object with options.
   * @param {function} callback - A callback to be called when the model is ready.
   */
  constructor(modelNameOrUrl, options, callback) {
    this.model = null;
    this.mapStringToIndex = [];

    // flags for classifyStart() and classifyStop()
    this.isClassifying = false; // True when classification loop is running
    this.signalStop = false; // Signal to stop the loop
    this.prevCall = ""; // Track previous call to detectStart() or detectStop()

    if (typeof modelNameOrUrl === "string" && isHttpUrl(modelNameOrUrl)) {
      // its a url, we expect to find model.json
      this.modelUrl = modelNameOrUrl;
      // The teachablemachine urls end with a slash, so add model.json to complete the full path
      if (this.modelUrl.endsWith("/")) this.modelUrl += "model.json";
    } else {
      // its a model name
      this.modelUrl = null;
      this.modelName = handleModelName(
        modelNameOrUrl,
        MODEL_OPTIONS,
        "mobilenet",
        "imageClassifier"
      );

      switch (this.modelName) {
        case "mobilenet":
          this.modelToUse = mobilenet;
          const config = handleOptions(
            options,
            {
              version: {
                type: "enum",
                enums: [1, 2],
                default: 2,
              },
              alpha: {
                type: "enum",
                enums: (config) =>
                  config.version === 1
                    ? [0.25, 0.5, 0.75, 1.0]
                    : [0.5, 0.75, 1.0],
                default: 1.0,
              },
              topk: {
                type: "number",
                integer: true,
                default: 3,
              },
            },
            "imageClassifier"
          );
          this.version = config.version;
          this.alpha = config.alpha;
          this.topk = config.topk;
          break;
        case "darknet":
          this.version = "reference"; // this a 28mb model
          this.modelToUse = darknet;
          break;
        case "darknet-tiny":
          this.version = "tiny"; // this a 4mb model
          this.modelToUse = darknet;
          break;
        case "doodlenet":
          this.modelToUse = doodlenet;
          break;
        default:
          this.modelToUse = null;
      }
    }
    // Load the model
    this.ready = callCallback(this.loadModel(this.modelUrl), callback);
  }

  /**
   * Load the model and set it to this.model
   * @return {this} The ImageClassifier.
   */
  async loadModel(modelUrl) {
    await tf.ready();
    if (modelUrl) this.model = await this.loadModelFrom(modelUrl);
    else
      this.model = await this.modelToUse.load({
        version: this.version,
        alpha: this.alpha,
      });

    return this;
  }

  async loadModelFrom(path = null) {
    try {
      let data;
      if (path !== null) {
        const result = await axios.get(path);
        // eslint-disable-next-line prefer-destructuring
        data = result.data;
      }

      if (data.ml5Specs) {
        this.mapStringToIndex = data.ml5Specs.mapStringToIndex;
      }
      if (this.mapStringToIndex.length === 0) {
        const split = path.split("/");
        const prefix = split.slice(0, split.length - 1).join("/");
        const metadataUrl = `${prefix}/metadata.json`;

        const metadataResponse = await axios
          .get(metadataUrl)
          .catch((metadataError) => {
            console.log(
              "Tried to fetch metadata.json, but it seems to be missing.",
              metadataError
            );
          });
        if (metadataResponse) {
          const metadata = metadataResponse.data;

          if (metadata.labels) {
            this.mapStringToIndex = metadata.labels;
          }
        }
      }
      this.model = await tf.loadLayersModel(path);
      return this.model;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  /**
   * Classifies the given input and returns an object with labels and confidence
   * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} imgToPredict -
   *    takes an image to run the classification on.
   * @param {number} numberOfClasses - a number of labels to return for the image
   *    classification.
   * @return {object} an object with {label, confidence}.
   */
  async classifyInternal(imgToPredict, numberOfClasses) {
    // Wait for the model to be ready
    await this.ready;
    await mediaReady(imgToPredict, true);

    // For Doodlenet and Teachable Machine models a manual resizing of the image is still necessary
    const imageResize = [IMAGE_SIZE, IMAGE_SIZE];
    if (this.modelName == "doodlenet" || this.modelUrl)
      imgToPredict = imgToTensor(imgToPredict, imageResize);

    if (this.modelUrl) {
      await tf.nextFrame();

      const predictions = this.model.predict(imgToPredict);
      const predictionData = await predictions.as1D().data();
      predictions.dispose();
      const predictedClasses = Array.from(predictionData);

      const results = predictedClasses
        .map((confidence, index) => {
          const label =
            this.mapStringToIndex.length > 0 && this.mapStringToIndex[index]
              ? this.mapStringToIndex[index]
              : index;
          return {
            label,
            confidence,
          };
        })
        .sort((a, b) => b.confidence - a.confidence);
      return results;
    }

    const results = await this.model.classify(imgToPredict, numberOfClasses);

    // MobileNet uses className/probability instead of label/confidence.
    if (this.modelName === "mobilenet") {
      return results.map((result) => ({
        label: result.className,
        confidence: result.probability,
      }));
    }

    return results;
  }

  /**
   * Classifies the given input and takes a callback to handle the results
   * @param {HTMLImageElement | HTMLCanvasElement | object | function | number} inputNumOrCallback -
   *    takes any of the following params
   * @param {HTMLImageElement | HTMLCanvasElement | object | function | number} numOrCallback -
   *    takes any of the following params
   * @param {function} cb - a callback function that handles the results of the function.
   * @return {function} a promise or the results of a given callback, cb.
   */
  async classify(inputNumOrCallback, numOrCallback, cb) {
    const { image, number, callback } = handleArguments(
      inputNumOrCallback,
      numOrCallback,
      cb
    ).require(
      "image",
      "No input image provided. If you want to classify a video, use classifyStart."
    );
    return callCallback(this.classifyInternal(image, number || this.topk), callback);
  }

  /**
   * Continuously classifies each frame of the given input
   * @param {HTMLVideoElement | object | function | number} inputNumOrCallback -
   *    takes any of the following params
   * @param {object | function | number} numOrCallback - a number of labels to return for the image classification.
   * @param {function} cb - a callback function that handles the results of the function.
   * @return {function} a promise or the results of a given callback, cb.
   */
  async classifyStart(inputNumOrCallback, numOrCallback, cb) {
    const { image, number, callback } = handleArguments(
      inputNumOrCallback,
      numOrCallback,
      cb
    ).require("image", "No input provided.");

    // Function to classify a single frame
    const classifyFrame = async () => {
      await mediaReady(image, true);
      // call the callback function
      await callCallback(this.classifyInternal(image, number || this.topk), callback);
      
      // call recursively for continuous classification
      if (!this.signalStop) {
        requestAnimationFrame(classifyFrame);
      } else {
        this.isClassifying = false;
      }
    };

    // Start the classification
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
   * Used to stop the continuous classification of a video
   */
  classifyStop() {
    if (this.isClassifying) {
      this.signalStop = true;
    }
    this.prevCall = "stop";
  }
}

const imageClassifier = (modelName, optionsOrCallback, cb) => {
  const args = handleArguments(modelName, optionsOrCallback, cb);

  const { string, options = {}, callback } = args;

  const instance = new ImageClassifier(string, options, callback);
  return instance;
};

export default imageClassifier;
