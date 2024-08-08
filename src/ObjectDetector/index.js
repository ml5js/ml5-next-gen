// Copyright (c) 2020-2024 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 * ObjectDetector: Object detection using cocoSsd in the browser
 */

import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import handleOptions from "../utils/handleOptions";
import { handleModelName } from "../utils/handleOptions";
import { mediaReady } from "../utils/imageUtilities";

class ObjectDetector {
  /**
   * An object for configuring ObjectDetector options.
   * @typedef {Object} configOptions
   * @property {string} modelType - Optional. The type of model to use. Default: "lite".
   */

  /**
   * Creates ObjectDetector.
   * @param {configOptions} options - An object containing ObjectDetector configuration options.
   * @param {function} callback - A callback to be called when the model is ready.
   * @private
   */
  constructor(modelName, options, callback) {
    this.modelName = handleModelName(modelName, ["cocoSsd"], "cocoSsd", "objectDetector");
    this.model = null;
    this.config = options;
    this.runtimeConfig = {};
    this.detectMedia = null;
    this.detectCallback = null;

    // flags for detectStart() and detectStop()
    this.detecting = false; // True when detection loop is running
    this.signalStop = false; // Signal to stop the loop
    this.prevCall = ""; // Track previous call to detectStart() or detectStop()

    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Loads the model.
   * @return {this} the ObjectDetector model.
   * @private
   */
  async loadModel() {
    await tf.ready();
    this.model = await cocoSsd.load();
    console.log('Finished loading cocoSsd');
    return this;
  }

  /**
   * Asynchronously outputs a single object detection result when called.
   * Supports both callback and promise.
   * @param {*} [media] - An HMTL or p5.js image, video, or canvas element to run the detection on.
   * @param {function} [callback] - Optional. A callback to handle the detection result.
   * @returns {Promise<Array>} The detection result.
   */
  async detect(...inputs) {
    const argumentObject = handleArguments(...inputs);
    argumentObject.require("image", "An html or p5.js image, video, or canvas element argument is required for detect().");
    const { image, callback } = argumentObject;

    await mediaReady(image, false);

    const predictions = await this.model.detect(image);
    console.log('raw result from cocoSsd', predictions);

    const result = predictions;

    if (typeof callback === "function") callback(result);
    return result;
  }

  /**
   * Repeatedly outputs object predictions through a callback function.
   * @param {*} [media] - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} [callback] - A callback to handle the object detection results.
   */
  detectStart(...inputs) {
    const argumentObject = handleArguments(...inputs);
    argumentObject.require("image", "An html or p5.js image, video, or canvas element argument is required for detectStart().");
    argumentObject.require("callback", "A callback function argument is required for detectStart().");
    this.detectMedia = argumentObject.image;
    this.detectCallback = argumentObject.callback;

    this.signalStop = false;
    if (!this.detecting) {
      this.detecting = true;
      this.detectLoop();
    }
    if (this.prevCall === "start") {
      console.warn("detectStart() was called more than once without calling detectStop(). Only the latest detectStart() call will take effect.");
    }
    this.prevCall = "start";
  }

  /**
   * Stops the detection loop before next detection loop runs.
   */
  detectStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
  }

  /**
   * Calls detect in a loop.
   * Can be started by detectStart() and terminated by detectStop().
   * @private
   */
  async detectLoop() {
    await mediaReady(this.detectMedia, false);
    while (!this.signalStop) {
      const predictions = await this.model.detect(this.detectMedia);
      const result = predictions;

      this.detectCallback(result);
      await tf.nextFrame();
    }
    this.detecting = false;
    this.signalStop = false;
  }
}

/**
 * Factory function that returns a new ObjectDetector instance.
 * @returns {ObjectDetector} A new objectDetector instance.
 */
const objectDetector = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  const instance = new ObjectDetector(string, options, callback);
  return instance;
};

export default objectDetector;
