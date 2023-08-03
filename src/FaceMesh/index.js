// Copyright (c) 2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 * FaceMesh: XXX
 */

import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { EventEmitter } from "events";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";

class FaceMesh extends EventEmitter {
  /**
   * Create FaceMesh.
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
   * @return {this} the FaceMesh model.
   */
  async loadModel() {
    // console.log('You would load the face-landmarks-detection model here');
    const pipeline = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const modelConfig = {
      runtime: 'mediapipe',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      maxFaces: this.config?.maxFaces ?? 1, // detect up to 1 face by default
      refineLandmarks: this.config?.refineLandmarks ?? false, // no refined Landmarks by defult
    };

    this.model = await faceLandmarksDetection.createDetector(pipeline, modelConfig);

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
    const predictions = await this.model.estimateFaces(image, options);
    //TODO: customize the output for easier use
    const result = predictions;

    this.emit("face", result);

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
 * exposes FaceMesh class through function
 * @returns {Object|Promise<Boolean>} A new FaceMesh instance
 */
const facemesh = (...inputs) => {
  const { video, options = {}, callback } = handleArguments(...inputs);
  const instance = new FaceMesh(video, options, callback);
  return instance;
};

export default facemesh;
