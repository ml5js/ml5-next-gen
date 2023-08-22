// Copyright (c) 2018-2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
Bodypose
Ported from pose-detection at Tensorflow.js
*/

import * as tf from "@tensorflow/tfjs";
import * as bodyPoseDetection from "@tensorflow-models/pose-detection";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";

class Bodypose {
  /**
   * An options object to configure MoveNet settings
   * @typedef {Object} configOptions
   * @property {string} modelType - Optional. specify what model variant to load from. Default: 'MULTIPOSE_LIGHTNING'.
   * @property {boolean} enableSmoothing - Optional. Whether to use temporal filter to smooth keypoints across frames. Default: true.
   * @property {number} minPoseScore - Optional. The minimum confidence score for a pose to be detected. Default: 0.25.
   * @property {number} multiPoseMaxDimension - Optional. The target maximum dimension to use as the input to the multi-pose model. Must be a mutiple of 32. Default: 256.
   * @property {boolean} enableTracking - Optional. Track each person across the frame with a unique ID. Default: true.
   * @property {string} trackerType - Optional. Specify what type of tracker to use. Default: 'boundingBox'.
   * @property {Object} trackerConfig - Optional. Specify tracker configurations. Use tf.js setting by default.
   *
   * //For using custom or offline models
   * @property {string} modelUrl - Optional. A The file path or URL to the model.
   */

  /**
   * Create a Bodypose model.
   * @param {configOptions} options - Optional. An object describing a model accuracy and performance.
   * @param {function} callback  Optional. A function to run once the model has been loaded.
   *
   * @private
   */
  constructor(options, callback) {
    // for compatibility with p5's preload()
    if (this.p5PreLoadExists()) window._incrementPreload();

    this.model = null;
    this.config = options;
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
   * @return {this} the detector model.
   */
  async loadModel() {
    const pipeline = bodyPoseDetection.SupportedModels.MoveNet;
    //Set the config to user defined or default values
    const modelConfig = {
      enableSmoothing: this.config.enableSmoothing ?? true,
      modelUrl: this.config.modelUrl,
      minPoseScore: this.config.minPoseScore ?? 0.25,
      multiPoseMaxDimension: this.config.multiPoseMaxDimension ?? 256,
      enableTracking: this.config.enableTracking ?? true,
      trackerType: this.config.trackerType ?? "boundingBox",
      trackerConfig: this.config.trackerConfig,
    };
    // use multi-pose lightning model by default
    switch (this.config.modelType) {
      case "SINGLEPOSE_LIGHTNING":
        modelConfig.modelType =
          bodyPoseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
        break;
      case "SINGLEPOSE_THUNDER":
        modelConfig.modelType =
          bodyPoseDetection.movenet.modelType.SINGLEPOSE_THUNDER;
        break;
      default:
        modelConfig.modelType =
          bodyPoseDetection.movenet.modelType.MULTIPOSE_LIGHTNING;
    }
    // Load the detector model
    await tf.ready();
    this.model = await bodyPoseDetection.createDetector(pipeline, modelConfig);

    // for compatibility with p5's preload()
    if (this.p5PreLoadExists) window._decrementPreload();

    return this;
  }

  /**
   * Asynchronously output a single pose prediction result when called
   * @param {*} media - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} callback - A callback function to handle the predictions.
   * @returns {Promise<Array>} an array of poses.
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
    const predictions = await this.model.estimatePoses(image);
    let result = predictions;
    result = this.addKeypoints(result);
    if (typeof callback === "function") callback(result);
    return result;
  }

  /**
   * Repeatedly output pose predictions through a callback function
   * Calls the internal detectLoop() function
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
        "detectStart() was called more than once without calling detectStop(). The lastest detectStart() call will be used and the previous calls will be ignored."
      );
    }
    this.prevCall = "start";
  }

  /**
   * Internal function to call estimatePoses in a loop
   * Can be started by detectStart() and terminated by detectStop()
   *
   * @private
   */
  async detectLoop() {
    await mediaReady(this.detectMedia, false);
    while (!this.signalStop) {
      const predictions = await this.model.estimatePoses(
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
   * Stop the detection loop before next detection loop runs.
   */
  detectStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
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
        hand[keypoint.name] = {
          x: keypoint.x,
          y: keypoint.y,
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
 * Factory function that retunts a Bodypose instance
 * @returns {Bodypose} A Bodypose instance
 */
const bodypose = (...inputs) => {
  const { options = {}, callback } = handleArguments(...inputs);
  const instance = new Bodypose(options, callback);
  return instance;
};

export default bodypose;
