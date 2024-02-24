// Copyright (c) 2018-2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
BodyPose
Ported from pose-detection at Tensorflow.js
*/

import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";
import handleOptions from "../utils/handleOptions";
import { handleModelName } from "../utils/handleOptions";

class BodyPose {
  /**
   * An object for configuring BodyPose options.
   * @typedef {Object} configOptions
   * @property {string} modelType - Optional. specify what model variant to load from.
   * @property {boolean} enableSmoothing - Optional. Whether to use temporal filter to smooth keypoints across frames. Default: true.
   *
   * Only for when using MoveNet model
   * @property {number} minPoseScore - Optional. The minimum confidence score for a pose to be detected. Default: 0.25.
   * @property {number} multiPoseMaxDimension - Optional. The target maximum dimension to use as the input to the multi-pose model. Must be a mutiple of 32. Default: 256.
   * @property {boolean} enableTracking - Optional. Track each person across the frame with a unique ID. Default: true.
   * @property {string} trackerType - Optional. Specify what type of tracker to use. Default: "boundingBox".
   * @property {Object} trackerConfig - Optional. Specify tracker configurations. Use tf.js settings by default.
   *
   * Only for when using BlazePose model
   * @property {string} runtime - Optional. Either "tfjs" or "mediapipe". Default: "mediapipe"
   * @property {boolean} enableSegmentation - Optional. A boolean indicating whether to generate the segmentation mask.
   * @property {boolean} smoothSegmentation - Optional. whether to filters segmentation masks across different input images to reduce jitter.
   *
   * For using custom or offline models
   * @property {string} modelUrl - Optional. The file path or URL to the MoveNet model.
   * @property {string} solutionPath - Optional. The file path or URL to the mediaPipe BlazePose model.
   * @property {string} detectorModelUrl - Optional. The file path or URL to the tfjs BlazePose detector model.
   * @property {string}landmarkModelUrl - Optional. The file path or URL to the tfjs BlazePose landmark model.
   */

  /**
   * Creates BodyPose.
   * @param {string} modelName - Specify a model to use, "MoveNet" or "BlazePose". Default: "MoveNet".
   * @param {configOptions} options - An object describing a model accuracy and performance.
   * @param {function} callback  - A function to run once the model has been loaded.
   * @private
   */
  constructor(modelName, options, callback) {
    // for compatibility with p5's preload()
    if (this.p5PreLoadExists()) window._incrementPreload();

    this.modelName = modelName;
    this.model = null;
    this.config = options;
    this.runtimeConfig = {};
    this.detectMedia = null;
    this.detectCallback = null;

    // flags for detectStart() and detectStop()
    this.detecting = false; // true when detection loop is running
    this.signalStop = false; // Signal to stop the loop
    this.prevCall = ""; // Track previous call to detectStart() or detectStop()

    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Loads the model.
   * @return {this} the detector model.
   */
  async loadModel() {
    let pipeline;
    let modelConfig;

    this.modelName = handleModelName(
      this.modelName,
      ["BlazePose", "MoveNet"],
      "MoveNet",
      "bodyPose"
    );

    if (this.modelName === "BlazePose") {
      pipeline = poseDetection.SupportedModels.BlazePose;
      //Set the config to user defined or default values
      modelConfig = handleOptions(
        this.config,
        {
          runtime: {
            type: "enum",
            enums: ["mediapipe", "tfjs"],
            default: "mediapipe",
          },
          enableSmoothing: {
            type: "boolean",
            default: true,
          },
          enableSegmentation: {
            type: "boolean",
            default: false,
            ignore: (config) => config.runtime !== "mediapipe",
          },
          smoothSegmentation: {
            type: "boolean",
            default: true,
            ignore: (config) => config.runtime !== "mediapipe",
          },
          modelType: {
            type: "enum",
            enums: ["lite", "full", "heavy"],
            default: "full",
          },
          solutionPath: {
            type: "string",
            default: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
            ignore: (config) => config.runtime !== "mediapipe",
          },
          detectorModelUrl: {
            type: "string",
            default: undefined,
            ignore: (config) => config.runtime !== "tfjs",
          },
          landmarkModelUrl: {
            type: "string",
            default: undefined,
            ignore: (config) => config.runtime !== "tfjs",
          },
        },
        "bodyPose"
      );
      this.runtimeConfig = handleOptions(
        this.config,
        {
          flipHorizontal: {
            type: "boolean",
            default: false,
          },
        },
        "bodyPose"
      );
    } else {
      pipeline = poseDetection.SupportedModels.MoveNet;
      //Set the config to user defined or default values
      modelConfig = handleOptions(
        this.config,
        {
          modelType: {
            type: "enum",
            enums: [
              "SINGLEPOSE_LIGHTNING",
              "SINGLEPOSE_THUNDER",
              "MULTIPOSE_LIGHTNING",
            ],
            default: "MULTIPOSE_LIGHTNING",
          },
          enableSmoothing: {
            type: "boolean",
            default: true,
          },
          minPoseScore: {
            type: "number",
            min: 0,
            max: 1,
            default: 0.25,
          },
          multiPoseMaxDimension: {
            type: "number",
            default: 256,
            min: 32,
            integer: true,
            multipleOf: 32,
          },
          enableTracking: {
            type: "boolean",
            default: true,
          },
          trackerType: {
            type: "enum",
            enums: ["boundingBox", "keypoint"],
            default: "boundingBox",
          },
          trackerConfig: {
            type: "object",
            default: undefined,
          },
          modelUrl: {
            type: "string",
            default: undefined,
          },
        },
        "bodyPose"
      );

      // Map the modelType string to the movenet.modelType enum
      switch (this.config.modelType) {
        case "SINGLEPOSE_LIGHTNING":
          modelConfig.modelType =
            poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
          break;
        case "SINGLEPOSE_THUNDER":
          modelConfig.modelType =
            poseDetection.movenet.modelType.SINGLEPOSE_THUNDER;
          break;
        default:
          modelConfig.modelType =
            poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING;
      }
    }

    // Load the detector model
    await tf.ready();
    this.model = await poseDetection.createDetector(pipeline, modelConfig);

    // for compatibility with p5's preload()
    if (this.p5PreLoadExists) window._decrementPreload();

    return this;
  }

  /**
   * A callback function that handles the pose detection results.
   * @callback gotPoses
   * @param {Array} results - An array of objects containing poses.
   */

  /**
   * Asynchronously outputs a single pose prediction result when called.
   * @param {*} media - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {gotPoses} callback - A callback function to handle the predictions.
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
    const predictions = await this.model.estimatePoses(
      image,
      this.runtimeConfig
    );
    let result = predictions;
    result = this.addKeypoints(result);
    if (typeof callback === "function") callback(result);
    return result;
  }

  /**
   * Repeatedly outputs pose predictions through a callback function.
   * Calls the internal detectLoop() function.
   * @param {*} media - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {gotPoses} callback - A callback function to handle the predictions.
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
   * Internal function that calls estimatePoses in a loop
   * Can be started by detectStart() and terminated by detectStop()
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
   * Stops the detection loop before next detection loop runs.
   */
  detectStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
  }

  /**
   * Return a new array of results with named keypoints added.
   * @param {Array} hands - the original detection results.
   * @return {Array} the detection results with named keypoints added.
   * @private
   */
  addKeypoints(hands) {
    const result = hands.map((hand) => {
      hand.keypoints.forEach((keypoint) => {
        hand[keypoint.name] = {
          x: keypoint.x,
          y: keypoint.y,
          score: keypoint.score,
        };
        if (keypoint.z) hand[keypoint.name].z = keypoint.z;
      });
      return hand;
    });
    return result;
  }

  /**
   * Checks if p5.js' preload() function is present.
   * @returns {boolean} true if preload() exists.
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
 * Factory function that returns a BodyPose instance.
 * @returns {BodyPose} A BodyPose instance.
 */
const bodyPose = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  const instance = new BodyPose(string, options, callback);
  return instance;
};

export default bodyPose;
