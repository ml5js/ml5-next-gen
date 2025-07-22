// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
  ObjectDetection
*/

import * as cocoSsd from "./cocossd.js";
import { handleModelName } from "../utils/handleOptions";
import handleArguments from "../utils/handleArguments";
import callCallback from "../utils/callcallback";
import { mediaReady } from "../utils/imageUtilities";

const MODEL_OPTIONS = ["cocossd", "yolo"]; // Expandable for other models like YOLO

class ObjectDetector {
  /**
   * @typedef {Object} options
   * @property {number} filterBoxesThreshold - Optional. default 0.01
   * @property {number} IOUThreshold - Optional. default 0.4
   * @property {number} classProbThreshold - Optional. default 0.4
   */
  /**
   * Create ObjectDetector model. Works on video and images.
   * @param {string} modelNameOrUrl - The name or the URL of the model to use. Current model name options are: 'YOLO' and 'CocoSsd'.
   * @param {Object} options - Optional. A set of options.
   * @param {function} callback - Optional. A callback function that is called once the model has loaded.
   */
  constructor(modelNameOrUrl, options = {}, callback) {
    this.model = null;
    this.modelName = null;
    this.modelToUse = null;

    // flags for detectStart() and detectStop()
    this.isDetecting = false;
    this.signalStop = false;
    this.prevCall = "";

    this.modelName = handleModelName(
      modelNameOrUrl,
      MODEL_OPTIONS,
      "cocossd",
      "objectDetector"
    );

    switch (this.modelName) {
      case "cocossd":
        this.modelToUse = cocoSsd;
        break;
      case "yolo":
        this.modelToUse = yolo;
        break;
      // more models... currently only cocossd is supported
      default:
        console.warn(`Unknown model: ${this.modelName}, defaulting to CocoSsd`);
        this.modelToUse = cocoSsd;
    }

    // load model and assign ready promise
    this.ready = callCallback(this.loadModel(options), callback);
  }

  async loadModel(options) {
    if (!this.modelToUse || !this.modelToUse.load) {
      throw new Error(`Model loader is missing or invalid for: ${this.modelName}`);
    }

    this.model = await this.modelToUse.load(options);

    return this;
  }

  /**
   * @typedef {Object} ObjectDetectorPrediction
   * @property {number} x - top left x coordinate of the prediction box in pixels.
   * @property {number} y - top left y coordinate of the prediction box in pixels.
   * @property {number} width - width of the prediction box in pixels.
   * @property {number} height - height of the prediction box in pixels.
   * @property {string} label - the label given.
   * @property {number} confidence - the confidence score (0 to 1).
   * @property {ObjectDetectorPredictionNormalized} normalized - a normalized object of the predicition
   */

  /**
   * @typedef {Object} ObjectDetectorPredictionNormalized
   * @property {number} x - top left x coordinate of the prediction box (0 to 1).
   * @property {number} y - top left y coordinate of the prediction box (0 to 1).
   * @property {number} width - width of the prediction box (0 to 1).
   * @property {number} height - height of the prediction box (0 to 1).
   */

  /**
   * Detect objects once from the input image/video/canvas.
   * @param {HTMLVideoElement|HTMLImageElement|HTMLCanvasElement|ImageData} input - Target element.
   * @param {function} cb - Optional callback.
   * @returns {ObjectDetectorPrediction}
   */
  async detect(input, cb) {
    const args = handleArguments(input, cb).require("image", "No valid image input.");
    await this.ready;
    return callCallback(this.model.detect(args.image), args.callback);
  }

  /**
   * Start continuous detection on video/canvas input
   * @param {HTMLVideoElement|HTMLImageElement|HTMLCanvasElement|ImageData} input - Target element.
   * @param {function} callback - Callback function called with each detection result.
   */
  async detectStart(input, callback) {
    const args = handleArguments(input, callback).require("image", "No input provided.");

    const detectFrame = async () => {
      await mediaReady(args.image, true);
      await callCallback(this.model.detect(args.image), args.callback);

      if (!this.signalStop) {
        requestAnimationFrame(detectFrame);
      } else {
        this.isDetecting = false;
      }
    };

    this.signalStop = false;
    if (!this.isDetecting) {
      this.isDetecting = true;
      detectFrame();
    }

    if (this.prevCall === "start") {
      console.warn(
        "detectStart() called again without detectStop(). Only the latest call is running."
      );
    }

    this.prevCall = "start";
  }

  detectStop() {
    if (this.isDetecting) {
      this.signalStop = true;
    }
    this.prevCall = "stop";
  }
}

const objectDetector = (modelNameOrUrl, optionsOrCallback, cb) => {
  const { string, options = {}, callback } = handleArguments(modelNameOrUrl, optionsOrCallback, cb);
  const instance = new ObjectDetector(string, options, callback);
  return instance;
};

export default objectDetector;