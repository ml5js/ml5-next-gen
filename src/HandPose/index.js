// Copyright (c) 2020-2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 * HandPose: Palm detector and hand-skeleton finger tracking in the browser
 * Ported and integrated from all the hard work by: https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection
 */

import * as tf from "@tensorflow/tfjs";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import ImageDetector from "../ImageDetector";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";

class HandPose {
  /**
   * An object for configuring HandPose options.
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
   * Creates HandPose.
   * @param {configOptions} options - An object containing HandPose configuration options.
   * @param {function} callback - A callback to be called when the model is ready.
   * @private
   */
  constructor(options, callback) {
    // for compatibility with p5's preload()
    if (this.p5PreLoadExists()) window._incrementPreload();

    this.model = null;
    this.config = options;
    this.runtimeConfig = {};

    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Loads the model.
   * @return {this} the HandPose model.
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
    if (this.p5PreLoadExists()) window._decrementPreload();

    return this;
  }

  /**
   * Asynchronously outputs a single hand landmark detection result when called.
   * Supports both callback and promise.
   * @param {*} [media] - An HTML or p5.js image, video, or canvas element to run the detection on.
   * @returns {Promise<Array>} The detection result.
   */
  async detect(media) {
    await mediaReady(media, false);
    const predictions = await this.model.estimateHands(
      media,
      this.runtimeConfig
    );
    return this.addKeypoints(predictions);
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
 * Factory function that returns a new HandPose instance.
 * @returns {ImageDetector} A new handPose instance.
 */
const handPose = (...inputs) => {
  const { options = {}, callback } = handleArguments(...inputs);
  const instance = new HandPose(options, callback);
  return new ImageDetector(instance);
};

export default handPose;
