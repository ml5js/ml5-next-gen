// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
PoseDetection
Ported from pose-detection at Tensorflow.js
*/

import EventEmitter from "events";
import * as tf from "@tensorflow/tfjs";
import * as bodyPoseDetection from "@tensorflow-models/pose-detection";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";

class PoseDetection extends EventEmitter {
  /**
   * @typedef {Object} options
   * @property {string} modelType - Optional. specify what model variant to load from. Default: 'SINGLEPOSE_LIGHTNING'.
   * @property {boolean} enableSmoothing - Optional. Whether to use temporal filter to smooth keypoints across frames. Default: true.
   * @property {string} modelUrl - Optional. A string that specifies custom url of the model. Default to load from tf.hub.
   * @property {number} minPoseScore - Optional. The minimum confidence score for a pose to be detected. Default: 0.25.
   * @property {number} multiPoseMaxDimension - Optional. The target maximum dimension to use as the input to the multi-pose model. Must be a mutiple of 32. Default: 256.
   * @property {boolean} enableTracking - Optional. Track each person across the frame with a unique ID. Default: true.
   * @property {string} trackerType - Optional. Specify what type of tracker to use. Default: 'boundingBox'.
   * @property {Object} trackerConfig - Optional. Specify tracker configurations. Use tf.js setting by default.
   */

  /**
   * Create a PoseNet model.
   * @param {HTMLVideoElement || p5.Video} video  - Optional. A HTML video element or a p5 video element.
   * @param {options} options - Optional. An object describing a model accuracy and performance.
   * @param {function} callback  Optional. A function to run once the model has been loaded.
   *    If no callback is provided, it will return a promise that will be resolved once the
   *    model has loaded.
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
    await tf.setBackend("webgl");
    this.model = await bodyPoseDetection.createDetector(pipeline, modelConfig);
    this.modelReady = true;

    if (this.video) {
      this.predict();
    }

    return this;
  }

  //TODO: Add named keypoints to a MoveNet pose object

  /**
   * Given an image or video, returns an array of objects containing pose estimations
   * @param {HTMLVideoElement || p5.Video || function} inputOr - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} cb - A callback function to handle the predictions.
   */
  async predict(inputOr, cb) {
    const { image, callback } = handleArguments(this.video, inputOr, cb);
    if (!image) {
      throw new Error("No input image found.");
    }
    // If video is provided, wait for video to be loaded
    await mediaReady(image, false);
    const result = await this.model.estimatePoses(image);

    // TODO: Add named keypoints to each pose object

    this.emit("pose", result);

    if (this.video) {
      return tf.nextFrame().then(() => this.predict());
    }

    if (typeof callback === "function") {
      callback(result);
    }

    return result;
  }
}

const poseDetection = (...inputs) => {
  const { video, options = {}, callback } = handleArguments(...inputs);
  return new PoseDetection(video, options, callback);
};

export default poseDetection;
