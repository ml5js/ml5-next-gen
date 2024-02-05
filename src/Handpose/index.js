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
import handleOptions from "../utils/handleOptions";
import { mediaReady } from "../utils/imageUtilities";

class Handpose {
  /**
   * An object for configuring Handpose options.
   * @typedef {Object} configOptions
   * @property {number} maxHands - Optional. The maximum number of hands to detect. Default: 2.
   * @property {string} modelType - Optional. The type of model to use: "lite" or "full". Default: "full".
   * @property {boolean} flipHorizontal - Optional. Flip the result data horizontally. Default: false.
   * @property {string} runtime - Optional. The runtime of the model: "mediapipe" or "tfjs". Default: "mediapipe".
   *
   * // For using custom or offline models
   * @property {string} solutionPath - Optional. The file path or URL to the model. Only used when using "mediapipe" runtime.
   * @property {string} detectorModelUrl - Optional. The file path or URL to the hand detector model. Only used when using "tfjs" runtime.
   * @property {string} landmarkModelUrl - Optional. The file path or URL to the hand landmark model Only used when using "tfjs" runtime.
   */

  /**
   * Creates Handpose.
   * @param {configOptions} options - An object containing Handpose configuration options.
   * @param {function} callback - A callback to be called when the model is ready.
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
    this.detecting = false; // True when detection loop is running
    this.signalStop = false; // Signal to stop the loop
    this.prevCall = ""; // Track previous call to detectStart() or detectStop()

    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Loads the model.
   * @return {this} the Handpose model.
   * @private
   */
  async loadModel() {
    const pipeline = handPoseDetection.SupportedModels.MediaPipeHands;
    //filter out model config options
    const modelConfig = handleOptions(
      this.config,
      {
        maxHands: {
          type: "number",
          min: 1,
          max: 2147483647,
          integer: true,
          default: 2,
        },
        runtime: {
          type: "enum",
          enums: ["mediapipe", "tfjs"],
          default: "mediapipe",
        },
        modelType: {
          type: "enum",
          enums: ["lite", "full"],
          default: "full",
        },
        solutionPath: {
          type: (config) =>
            config.runtime === "mediapipe" ? "string" : "undefined",
          default: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
        },
        detectorModelUrl: {
          type: (config) =>
            config.runtime === "tfjs" ? "string" : "undefined",
          default: undefined,
        },
        landmarkModelUrl: {
          type: (config) =>
            config.runtime === "tfjs" ? "string" : "undefined",
          default: undefined,
        },
      },
      "handpose"
    );
    this.runtimeConfig = handleOptions(
      this.config,
      {
        flipHorizontal: {
          type: "boolean",
          default: false,
        },
      },
      "handpose"
    );

    await tf.ready();
    this.model = await handPoseDetection.createDetector(pipeline, modelConfig);

    // for compatibility with p5's preload()
    if (this.p5PreLoadExists) window._decrementPreload();

    return this;
  }

  /**
   * A callback function that handles the handpose detection results.
   * @callback gotHands
   * @param {Array} results - The detection output.
   */

  /**
   * Asynchronously outputs a single hand landmark detection result when called.
   * Supports both callback and promise.
   * @param {*} [media] - An HMTL or p5.js image, video, or canvas element to run the detection on.
   * @param {gotHands} [callback] - Optional. A callback to handle the hand detection result.
   * @returns {Promise<Array>} The detection result.
   */
  async detect(...inputs) {
    //Parse out the input parameters
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for detect()."
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
   * Repeatedly outputs hand predictions through a callback function.
   * @param {*} [media] - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {gotHands} [callback] - A callback to handle the hand detection results.
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
        "detectStart() was called more than once without calling detectStop(). Only the latest detectStart() call will take effect."
      );
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
   * Calls estimateHands in a loop.
   * Can be started by detectStart() and terminated by detectStop().
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
   * Returns a new array of results with named keypoints added.
   * @param {Array} hands - the original detection results.
   * @return {Array} the detection results with named keypoints added.
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
   * Check if p5.js' preload() function is present in the current environment.
   * @returns {boolean} True if preload() exists. False otherwise.
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
 * Factory function that returns a new Handpose instance.
 * @returns {Handpose} A new handpose instance.
 */
const handpose = (...inputs) => {
  const { options = {}, callback } = handleArguments(...inputs);
  const instance = new Handpose(options, callback);
  return instance;
};

export default handpose;
