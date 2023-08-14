// Copyright (c) 2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 * Handpose: Palm detector and hand-skeleton finger tracking in the browser
 * Ported and integrated from all the hard work by: https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection
 */
import * as tf from "@tensorflow/tfjs";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";

class Handpose {
  /**
   * Create Handpose.
   * @param {Object} [options] - An object with options.
   * @param {function} [callback] - A callback to be called when the model is ready.
   *
   * @private
   */
  constructor(options, callback) {
    // for compatibility with p5's preload()
    if (this.p5PreLoadExists()) window._incrementPreload();

    this.model = null;
    this.config = options;

    this.ready = callCallback(this.loadModel(), callback);

    //flags for detectStart() and detectStop()
    this.detecting = false;
    this.signalStop = false;
  }

  /**
   * Load the model and set it to this.model
   * @return {this} the Handpose model.
   *
   * @private
   */
  async loadModel() {
    const pipeline = handPoseDetection.SupportedModels.MediaPipeHands;
    const modelConfig = {
      maxHands: this.config?.maxHands ?? 2, // detect up to 2 hands by default
      runtime: this.config?.runtime ?? "mediapipe", // use MediaPipe runtime by default
      modelType: this.config?.modelType ?? "full", // use full version of the model by default
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands", // fetch model from mediapipe server
    };
    await tf.ready();
    this.model = await handPoseDetection.createDetector(pipeline, modelConfig);
    // for compatibility with p5's preload()
    if (this.p5PreLoadExists) window._decrementPreload();

    return this;
  }

  /**
   * Asynchronously output a single prediction result when called
   * @param {*} [media] - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} [callback] - A callback function to handle the predictions.
   * @returns {Promise<Array>} an array of predictions.
   */
  async detect(...inputs) {
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for detectStart()."
    );
    const { image, callback } = argumentObject;

    await mediaReady(image, false);

    const options = {
      flipHorizontal: this.config?.flipHorizontal ?? false,
    };
    const predictions = await this.model.estimateHands(image, options);
    //TODO: customize the output for easier use
    const result = predictions;
    if (typeof callback === "function") callback(result);
    return result;
  }

  /**
   * Repeatedly output predictions through a callback function
   * @param {*} [media] - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} [callback] - A callback function to handle the predictions.
   * @returns {Promise<Array>} an array of predictions.
   */
  async detectStart(...inputs) {
    // Parse out the input parameters
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for detectStart()."
    );
    argumentObject.require(
      "callback",
      "A callback function argument is required for detectStart()."
    );
    const { image, callback } = argumentObject;

    //Throw an error if detectStart is called more than once before detectStop
    if (this.detecting) {
      console.warn(
        "Detect start has already been called. Call detectStop() before calling detectStart() again."
      );
      return;
    }
    this.detecting = true;

    await mediaReady(image, false);
    while (!this.signalStop) {
      const options = {
        flipHorizontal: this.config?.flipHorizontal ?? false,
      };
      const predictions = await this.model.estimateHands(image, options);
      //TODO: customize the output for easier use
      const result = predictions;
      callback(result);
      // wait for the frame to update
      await tf.nextFrame();
    }

    this.signalStop = false;
    this.detecting = false;
  }

  /**
   * Stop the detection loop before next frame
   */
  detectStop() {
    this.signalStop = true;
  }

  /**
   * Check if p5.js' preload() function is present
   * @returns {boolean} true if preload() exists
   *
   * @private
   */
  p5PreLoadExists() {
    if (typeof window === "undefined") return false;
    if (typeof window.p5 === "undefined") return false;
    if (typeof window.p5.prototype === "undefined") return false;
    if (typeof window.p5.prototype.registerPreloadMethod === "undefined")
      return false;
    return true;
  }
}

/**
 * Factory function that returns a Handpose instance
 * @returns {Object} A new handpose instance
 */
const handpose = (...inputs) => {
  const { options = {}, callback } = handleArguments(...inputs);
  const instance = new Handpose(options, callback);
  return instance;
};

export default handpose;
