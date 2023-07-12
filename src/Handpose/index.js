// Copyright (c) 2020 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 * Handpose: Palm detector and hand-skeleton finger tracking in the browser
 * Ported and integrated from all the hard work by: https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection
 */
import * as tf from "@tensorflow/tfjs";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import { EventEmitter } from "events";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";

class Handpose extends EventEmitter {
  /**
   * Create Handpose.
   * @param {HTMLVideoElement} [video] - An HTMLVideoElement.
   * @param {Object} [options] - An object with options.
   * @param {function} [callback] - A callback to be called when the model is ready.
   */
  constructor(video, options, callback) {
    super();

    this.video = video;
    this.model = null;
    this.modelReady = false;
    this.config = options;

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

    if (this.video) {
      this.predict();
    }

    return this;
  }

  /**
   * @param {*} [inputOr] - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} [cb] - A callback function to handle the predictions.
   * @return {Promise<handposeCore.AnnotatedPrediction[]>} an array of predictions.
   */
  async predict(inputOr, cb) {
    const { image, callback } = handleArguments(this.video, inputOr, cb);
    if (!image) {
      throw new Error("No input image found.");
    }
    await mediaReady(image, false);
    const options = {
      flipHorizontal: this.config?.flipHorizontal ?? false, // do not horizontally flip the prediction by default
    };
    const predictions = await this.model.estimateHands(image, options);
    //TODO: customize the output for easier use
    const result = predictions;

    this.emit("hand", result);

    if (this.video) {
      return tf.nextFrame().then(() => this.predict());
    }

    if (typeof callback === "function") {
      callback(result);
    }

    return result;
  }
}

/**
 * exposes handpose class through function
 * @returns {Object|Promise<Boolean>} A new handpose instance
 */
const handpose = (...inputs) => {
  const { video, options = {}, callback } = handleArguments(...inputs);
  const instance = new Handpose(video, options, callback);
  return instance;
};

export default handpose;
