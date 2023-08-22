// Copyright (c) 2020-2023 ml5
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
   * An options object to configure Handpose settings
   * @typedef {Object} configOptions
   * @property {number} maxHands - The maximum number of hands to detect. Defaults to 2.
   * @property {string} modelType - The model to use. "lite" or "full"(default).
   * @property {boolean} flipHorizontal - Flip the result horizontally. Defaults to false.
   * @property {string} runtime - The runtime to use. "mediapipe"(default) or "tfjs".
   *
   * // For using custom or offline models
   * @property {string} solutionPath - The file path or URL to the model.
   * @property {string} detectorModelUrl - The file path or URL to the hand detector model when using "tfjs" runtime.
   * @property {string} landmarkModelUrl - The file path or URL to the hand landmark model when using "mediapipe" runtime.
   */

  /**
   * Create Handpose.
   * @param {configOptions} options - An object with options.
   * @param {function} callback - A callback to be called when the model is ready.
   *
   * @private
   */
  constructor(options, callback) {
    // for compatibility with p5's preload()
    if (this.p5PreLoadExists()) window._incrementPreload();

    this.model = null;
    this.config = options;
    this.runtimeConfig = {};
    this.detectMedia = null;
    this.detectCallback = null;

    // flags for detectStart() and detectStop()
    this.detecting = false; // true when detection loop is running
    this.signalStop = false; // true when detectStop() is called and detecting is true
    this.prevCall = ""; // "start" or "stop", used for giving warning messages with detectStart() is called twice in a row

    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Load the model and set it to this.model
   * @return {this} the Handpose model.
   *
   * @private
   */
  async loadModel() {
    const pipeline = handPoseDetection.SupportedModels.MediaPipeHands;
    //filter out model config options
    const modelConfig = {
      maxHands: this.config?.maxHands ?? 2,
      runtime: this.config?.runtime ?? "mediapipe",
      modelType: this.config?.modelType ?? "full",
      solutionPath:
        this.config?.solutionPath ??
        "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
      detectorModelUrl: this.config?.detectorModelUrl,
      landmarkModelUrl: this.config?.landmarkModelUrl,
    };
    this.runtimeConfig = {
      flipHorizontal: this.config?.flipHorizontal ?? false,
    };

    await tf.ready();
    this.model = await handPoseDetection.createDetector(pipeline, modelConfig);

    // for compatibility with p5's preload()
    if (this.p5PreLoadExists) window._decrementPreload();

    return this;
  }

  /**
   * Asynchronously output a single hand prediction result when called
   * @param {*} [media] - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} [callback] - A callback function to handle the predictions.
   * @returns {Promise<Array>} an array of predictions.
   */
  async detect(...inputs) {
    //Parse out the input parameters
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for detectStart()."
    );
    const { image, callback } = argumentObject;

    await mediaReady(image, false);
    const predictions = await this.model.estimateHands(
      image,
      this.runtimeConfig
    );
    let result = predictions;
    result = this.addKeypoints(result);
    if (typeof callback === "function") callback(result);
    return result;
  }

  /**
   * Repeatedly output hand predictions through a callback function
   * @param {*} [media] - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} [callback] - A callback function to handle the predictions.
   * @returns {Promise<Array>} an array of predictions.
   */
  detectStart(...inputs) {
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
    this.detectMedia = argumentObject.image;
    this.detectCallback = argumentObject.callback;

    this.signalStop = false;
    if (!this.detecting) {
      this.detecting = true;
      this.detectLoop();
    }
    if (this.prevCall === "start") {
      console.warn(
        "detectStart() was called more than once without calling detectStop(). The lastest detectStart() call will be used and the previous calls will be  ignored."
      );
    }
    this.prevCall = "start";
  }

  /**
   * Stop the detection loop before next detection loop runs.
   */
  detectStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
  }

  /**
   * Internal function to call estimateHands in a loop
   * Can be started by detectStart() and terminated by detectStop()
   *
   * @private
   */
  async detectLoop() {
    await mediaReady(this.detectMedia, false);
    while (!this.signalStop) {
      const predictions = await this.model.estimateHands(
        this.detectMedia,
        this.runtimeConfig
      );
      let result = predictions;
      result = this.addKeypoints(result);
      this.detectCallback(result);
      // wait for the frame to update
      await tf.nextFrame();
    }
    this.detecting = false;
    this.signalStop = false;
  }

  /**
   * Return a new array of results with named keypoints added
   * @param {Array} hands - the original detection results
   * @return {Array} the detection results with named keypoints added
   *
   * @private
   */
  addKeypoints(hands) {
    const result = hands.map((hand) => {
      for (let i = 0; i < hand.keypoints.length; i++) {
        let keypoint = hand.keypoints[i];
        let keypoint3D = hand.keypoints3D[i];
        hand[keypoint.name] = {
          x: keypoint.x,
          y: keypoint.y,
          x3D: keypoint3D.x,
          y3D: keypoint3D.y,
          z3D: keypoint3D.z,
        };
      }
      return hand;
    });
    return result;
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
