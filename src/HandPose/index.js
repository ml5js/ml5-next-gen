/**
 * @license
 * Copyright (c) 2020-2024 ml5
 * This software is released under the ml5.js License.
 * https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 */

/**
 * @file HandPose
 *
 * The file contains the main code of HandPose, a pretrained hand landmark
 * estimation model that can estimate poses and track key body parts in real-time.
 * The HandPose model is built on top of the hand detection model of TensorFlow.
 *
 * TensorFlow Hand Pose Detection repo:
 * https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection
 * ml5.js BodyPose reference documentation:
 * https://docs.ml5js.org/#/reference/handpose
 */

import * as tf from "@tensorflow/tfjs";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import handleOptions from "../utils/handleOptions";
import { handleModelName } from "../utils/handleOptions";
import { mediaReady } from "../utils/imageUtilities";
import objectRenameKey from "../utils/objectRenameKey";

/**
 * User provided options object for HandPose. See config schema below for default and available values.
 * @typedef {object} configOptions
 * @property {number} [maxHands]           - The maximum number of hands to detect.
 * @property {string} [modelType]          - The type of model to use.
 * @property {boolean} [flipHorizontal]    - Whether to mirror the landmark results.
 * @property {string} [runtime]            - The runtime of the model.
 * @property {string} [solutionPath]       - The file path or URL to mediaPipe solution. Only for
 *                                           `mediapipe` runtime.
 * @property {string} [detectorModelUrl]   - The file path or URL to the hand detector model. Only
 *                                           for `tfjs` runtime.
 * @property {string} [landmarkModelUrl]   - The file path or URL to the hand landmark model. Only
 *                                           for `tfjs` runtime.
 */

/**
 * Schema for initialization options, used by `handleOptions` to
 * validate the user's options object.
 */
const configSchema = {
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
    default: "tfjs",
  },
  modelType: {
    type: "enum",
    enums: ["lite", "full"],
    default: "full",
  },
  solutionPath: {
    type: "string",
    default: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
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
};

/**
 * Schema for runtime options, used by `handleOptions` to
 * validate the user's options object.
 */
const runtimeConfigSchema = {
  flipHorizontal: {
    type: "boolean",
    alias: "flipped",
    default: false,
  },
};

class HandPose {
  /**
   * Creates an instance of HandPose model.
   * @param {string} [modelName] - The underlying model to use, must be `MediaPipeHands` or undefined.
   * @param {configOptions} options -An options object for the model.
   * @param {function} callback - A callback function that is called once the model has been loaded.
   * @private
   */
  constructor(modelName, options, callback) {
    /** The underlying model used. */
    this.modelName = this.modelName = handleModelName(
      modelName,
      ["MediaPipeHands"],
      "MediaPipeHands",
      "handPose"
    );
    /** The underlying TensorFlow.js detector instance.*/
    this.model = null;
    /** The user provided options object. */
    this.userOptions = options;
    /** The config passed to underlying detector instance during inference. */
    this.runtimeConfig = {};
    /** The media source being continuously detected. Only used in continuous mode. */
    this.detectMedia = null;
    /** The callback function for detection results. Only used in continuous mode. */
    this.detectCallback = null;
    /** A flag for continuous mode, set to true when detection loop is running.*/
    this.detecting = false;
    /** A flag to signal stop to the detection loop.*/
    this.signalStop = false;
    /** A flag to track the previous call to`detectStart` and `detectStop`. */
    this.prevCall = "";
    /** A promise that resolves when the model is ready. */
    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Loads the HandPose instance.
   * @return {this} the HandPose instance.
   * @private
   */
  async loadModel() {
    const pipeline = handPoseDetection.SupportedModels.MediaPipeHands;
    // Filter out initialization config options
    const modelConfig = handleOptions(
      this.userOptions,
      configSchema,
      "handPose"
    );
    // Filter out the runtime config options
    this.runtimeConfig = handleOptions(
      this.userOptions,
      runtimeConfigSchema,
      "handPose"
    );

    if (this.loadOfflineModel) {
      this.loadOfflineModel(modelConfig);
    }

    // Load the Tensorflow.js detector instance
    await tf.ready();
    this.model = await handPoseDetection.createDetector(pipeline, modelConfig);
    return this;
  }

  /**
   * A callback function that handles the handPose detection results.
   * @callback gotHands
   * @param {Array} results - The detection output.
   */

  /**
   * Asynchronously outputs a single hand landmark detection result when called.
   * Supports both callback and promise.
   * @param {any} media - An HTML or p5.js image, video, or canvas element to run the detection on.
   * @param {gotHands} [callback] - A callback to handle the hand detection result.
   * @returns {Promise<Array>} An array of hand detection results.
   * @public
   */
  async detect(...inputs) {
    //Parse the input parameters
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for detect()."
    );
    const { image, callback } = argumentObject;
    // Run the detection
    await mediaReady(image, false);
    const predictions = await this.model.estimateHands(
      image,
      this.runtimeConfig
    );
    // Modify the raw tfjs output to make it more user-friendly
    let result = predictions;
    this.renameScoreToConfidence(result);
    this.addKeypoints(result);
    // Output the result via callback and/or promise
    if (typeof callback === "function") callback(result);
    return result;
  }

  /**
   * Repeatedly outputs hand predictions through a callback function.
   * @param {any} media - An HTML or p5.js image, video, or canvas element to run the prediction on.
   * @param {gotHands} callback - A callback to handle the hand detection results.
   * @public
   */
  detectStart(...inputs) {
    // Parse the input parameters
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
      // Call the internal detection loop
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
   * @public
   */
  detectStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
  }

  /**
   * Calls estimateHands in a loop.
   * Can be started by `detectStart` and terminated by `detectStop`.
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
      // Modify the prediction result to make it more user-friendly
      this.renameScoreToConfidence(result);
      this.addKeypoints(result);

      this.detectCallback(result);
      // wait for the frame to update
      await tf.nextFrame();
    }
    this.detecting = false;
    this.signalStop = false;
  }

  /**
   * Renames the `score` key to `confidence` in the detection results.
   * @param {Object[]} hands - The detection results.
   * @private
   */
  renameScoreToConfidence(hands) {
    hands.forEach((hand) => {
      objectRenameKey(hand, "score", "confidence");
    });
  }

  /**
   * Add the named keypoints to the detection results.
   * @param {Array} hands - the original detection results.
   * @private
   */
  addKeypoints(hands) {
    hands = hands.map((hand) => {
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
  }
}

/**
 * Factory function that returns a new HandPose instance.
 * @param {string} [modelName] - The underlying model to use, must be `MediaPipeHands`
 * @param {configOptions} [options] - A user-defined options object for the model.
 * @param {function} [callback] - A callback function that is called once the model has been loaded.
 * @returns {HandPose} A new handPose instance.
 */
const handPose = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  const instance = new HandPose(string, options, callback);
  return instance;
};

export default handPose;
export { HandPose };
