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
   * @param {HTMLVideoElement} [video] - An HTMLVideoElement.
   * @param {Object} [options] - An object with options.
   * @param {function} [callback] - A callback to be called when the model is ready.
   */
  constructor(options, callback) {
    this.model = null;
    this.modelReady = false;
    this.config = options;
    this.detecting = false;
    this.signalStop = false;

    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Load the model and set it to this.model
   * @return {this} the Handpose model.
   */
  async loadModel() {
    const pipeline = handPoseDetection.SupportedModels.MediaPipeHands;
    const modelConfig = {
      maxHands: this.config?.maxHands ?? 2, // detect up to 2 hands by default
      runtime: this.config?.runtime ?? "mediapipe", // use MediaPipe runtime by default
      modelType: this.config?.modelType ?? "full", // use full version of the model by default
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands", // fetch model from mediapipe server
    };

    this.model = await handPoseDetection.createDetector(pipeline, modelConfig);
    this.modelReady = true;

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
   * Continuously output predictions through a callback function
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
  }

  /**
   * Stop the detection loop before next frame
   */
  detectStop() {
    this.signalStop = true;
  }
}

/**
 * exposes handpose class through function
 * @returns {Object} A new handpose instance
 */
const handpose = (...inputs) => {
  const { options = {}, callback } = handleArguments(...inputs);
  const instance = new Handpose(options, callback);
  return instance;
};

export default handpose;
