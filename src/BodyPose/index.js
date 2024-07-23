/**
 * @license
 * Copyright (c) 2018-2024 ml5
 * This software is released under the ml5.js License.
 * https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 */

/**
 * @file BodyPose
 *
 * The file contains the main code of BodyPose, a pretrained full-body pose
 * estimation model that can estimate poses and track key body parts in real-time.
 * The BodyPose model is built on top of the pose detection model of TensorFlow.
 *
 * TensorFlow Pose Detection repo:
 * https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
 * ml5.js Website documentation:
 * https://docs.ml5js.org/#/reference/bodypose
 */

import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";
import handleOptions from "../utils/handleOptions";
import { handleModelName } from "../utils/handleOptions";
import objectRenameKey from "../utils/objectRenameKey";
import { isVideo } from "../utils/handleArguments";

/**
 * User provided options object for BodyPose with MoveNet model,
 * the default model used by ml5.
 * @typedef {Object} MoveNetOptions
 * @property {string|undefined} modelType             - The type of MoveNet model to use.
 * @property {boolean|undefined} enableSmoothing      - Whether to use temporal filter to smooth
 *                                                      keypoints across frames.
 * @property {number|undefined} minPoseScore          - The minimum confidence score for a pose to
 *                                                      be detected.
 * @property {number|undefined} multiPoseMaxDimension - The target maximum dimension to use as the
 *                                                      input to the multi-pose model.
 * @property {boolean|undefined} enableTracking       - Whether to track each person across the
 *                                                      frames with a unique ID.
 * @property {string|undefined} trackerType           - The type of tracker to use.
 * @property {Object|undefined} trackerConfig         - Advanced tracker configurations.
 * @property {string|undefined} modelUrl              - The file path or URL to the MoveNet model.
 */

/**
 * User provided options object for BodyPose with BlazePose model.
 * @typedef {Object} BlazePoseOptions
 * @property {string|undefined} runtime               - The runtime to use.
 * @property {boolean|undefined} enableSmoothing      - Whether to use temporal filter to smooth
 *                                                      keypoints across frames.
 * @property {boolean} enableSegmentation             - Whether to generate the segmentation mask.
 *                                                      Only for 'mediapipe' runtime.
 * @property {boolean} smoothSegmentation             - Whether to filter segmentation masks across
 *                                                      different frames to reduce jitter.
 *                                                      Only for 'mediapipe' runtime.
 * @property {string|undefined} solutionPath          - The URL to the MediaPipe BlazePose solution.
 *                                                      Only for 'mediapipe' runtime.
 * @property {string|undefined} modelType             - The type of BlazePose model to use.
 * @property {string|undefined} detectorModelUrl      - The file path or URL to the BlazePose
 *                                                      detector model. Only for 'tfjs' runtime.
 * @property {string|undefined} landmarkModelUrl      - The file path or URL to the BlazePose
 *                                                      landmark model. Only for 'tfjs' runtime.
 */

/**
 * Configuration schema for MoveNet model, used by `handleOptions` to
 * validate the user's options object.
 */
const MoveNetConfigSchema = {
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
};

/**
 * Configuration schema for BlazePose model, used by `handleOptions` to
 * validate the user's options object.
 */
const blazePoseConfigSchema = {
  runtime: {
    type: "enum",
    enums: ["mediapipe", "tfjs"],
    default: "tfjs",
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
};

/**
 * Configuration schema for runtime options, used by `handleOptions` to
 * validate the user's options object.
 */
const RuntimeConfigSchema = {
  flipHorizontal: {
    type: "boolean",
    alias: "flipped",
    default: false,
  },
};

/** Class representing a BodyPose object. */
class BodyPose {
  /**
   * Creates an instance of BodyPose model.
   * The constructor should be called with the `ml5.bodyPose` method and not directly.
   * @param {string} modelName - The underlying model to use, "MoveNet" or "BlazePose". Default: "MoveNet".
   * @param {configOptions} options - An options object for the model.
   * @param {function} callback  - A callback function that is called once the model has been loaded.
   * @private
   */
  constructor(modelName, options, callback) {
    this.modelName = handleModelName(
      modelName,
      ["BlazePose", "MoveNet"],
      "MoveNet",
      "bodyPose"
    );
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

    if (this.modelName === "BlazePose") {
      pipeline = poseDetection.SupportedModels.BlazePose;
      //Set the config to user defined or default values
      modelConfig = handleOptions(
        this.config,
        blazePoseConfigSchema,
        "bodyPose"
      );
      this.runtimeConfig = handleOptions(
        this.config,
        RuntimeConfigSchema,
        "bodyPose"
      );
    } else {
      pipeline = poseDetection.SupportedModels.MoveNet;
      //Set the config to user defined or default values
      modelConfig = handleOptions(this.config, MoveNetConfigSchema, "bodyPose");

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

      this.runtimeConfig = handleOptions(
        this.config,
        RuntimeConfigSchema,
        "bodyPose"
      );
    }

    // Load the detector model
    await tf.ready();
    this.model = await poseDetection.createDetector(pipeline, modelConfig);
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
    const predictions = await this.model.estimatePoses(image);
    let result = predictions;
    // modify the raw tfjs output to a more usable format
    this.renameScoreToConfidence(result);
    if (this.modelName === "MoveNet" && isVideo(image)) {
      this.resizeKeypoints(
        result,
        image.videoWidth,
        image.videoHeight,
        image.width,
        image.height
      );
    }
    if (this.runtimeConfig.flipHorizontal) {
      this.mirrorKeypoints(result, image.width);
      this.mirrorBoundingBox(result);
    }
    this.addKeypoints(result);
    this.resizeBoundingBoxes(result, image.width, image.height);

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
      const predictions = await this.model.estimatePoses(this.detectMedia);
      let result = predictions;
      this.renameScoreToConfidence(result);
      if (this.modelName === "MoveNet" && isVideo(this.detectMedia)) {
        this.resizeKeypoints(
          result,
          this.detectMedia.videoWidth,
          this.detectMedia.videoHeight,
          this.detectMedia.width,
          this.detectMedia.height
        );
      }
      if (this.runtimeConfig.flipHorizontal) {
        this.mirrorKeypoints(result, this.detectMedia.width);
        this.mirrorBoundingBox(result);
      }
      this.addKeypoints(result);
      this.resizeBoundingBoxes(
        result,
        this.detectMedia.width,
        this.detectMedia.height
      );
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
   * Rename the score property to confidence for consistency.
   * @param {Array.<Object>} poses - the original detection results.
   */
  renameScoreToConfidence(poses) {
    poses.forEach((pose) => {
      pose.keypoints.forEach((keypoint) => {
        objectRenameKey(keypoint, "score", "confidence");
      });
      if (pose.keypoints3D) {
        pose.keypoints3D.forEach((keypoint) => {
          objectRenameKey(keypoint, "score", "confidence");
        });
      }
      if (pose.score) objectRenameKey(pose, "score", "confidence");
    });
  }

  /**
   * Mirror the keypoints around x-axis.
   * @param {HTMLVideoElement | HTMLImageElement | HTMLCanvasElement} detectMedia
   * @param {Object} poses - the original detection results.
   * @private
   */
  mirrorKeypoints(poses, mediaWidth) {
    poses.forEach((pose) => {
      pose.keypoints.forEach((keypoint) => {
        keypoint.x = mediaWidth - keypoint.x;
      });
    });
  }

  /**
   * Mirror the bounding box around x-axis.
   * @param {Object} poses - the original detection results.
   * @private
   */
  mirrorBoundingBox(poses) {
    poses.forEach((pose) => {
      if (!pose.box) return;
      const tempXMin = pose.box.xMin;
      pose.box.xMin = 1 - pose.box.xMax;
      pose.box.xMax = 1 - tempXMin;
    });
  }

  /**
   * Resize the keypoints output of moveNet model to match the display size.
   *
   * @param {Object} poses - the original detection results.
   * @param {HTMLVideoElement} mediaWidth - the actual width of the video.
   * @param {HTMLVideoElement} mediaHeight- the actual height of the video.
   * @param {HTMLVideoElement} displayWidth - the display width of the video.
   * @param {HTMLVideoElement} displayHeight - the display height of the video.
   */
  resizeKeypoints(poses, mediaWidth, mediaHeight, displayWidth, displayHeight) {
    poses.forEach((pose) => {
      pose.keypoints.forEach((keypoint) => {
        keypoint.x = (keypoint.x / mediaWidth) * displayWidth;
        keypoint.y = (keypoint.y / mediaHeight) * displayHeight;
      });
    });
  }

  /**
   * Return a new array of results with named keypoints added.
   * @param {Array} poses - the original detection results.
   * @return {Array} the detection results with named keypoints added.
   * @private
   */
  addKeypoints(poses) {
    poses.forEach((pose) => {
      pose.keypoints.forEach((keypoint) => {
        pose[keypoint.name] = {
          x: keypoint.x,
          y: keypoint.y,
          confidence: keypoint.confidence,
        };
        if (keypoint.z) pose[keypoint.name].z = keypoint.z;
      });
    });
  }

  /**
   * Resize the bounding box values from between 0-1 to the original media size.
   *
   * @param {Array} poses - the original detection results.
   * @param {*} imageWidth - the width of the media being detected.
   * @param {*} imageHeight - the height of the media being detected.
   * @private
   */
  resizeBoundingBoxes(poses, imageWidth, imageHeight) {
    // Only MoveNet model has box property
    if (poses[0] && poses[0].box) {
      poses.forEach((pose) => {
        pose.box.height = pose.box.height * imageHeight;
        pose.box.width = pose.box.width * imageWidth;
        pose.box.xMax = pose.box.xMax * imageWidth;
        pose.box.xMin = pose.box.xMin * imageWidth;
        pose.box.yMax = pose.box.yMax * imageHeight;
        pose.box.yMin = pose.box.yMin * imageHeight;
      });
    }
  }

  /**
   * Returns the skeleton connections pairs for the model.
   * @returns {Number[][]} an array of pairs of indices containing the connected keypoints.
   */
  getSkeleton() {
    if (this.modelName === "BlazePose") {
      return poseDetection.util.getAdjacentPairs(
        poseDetection.SupportedModels.BlazePose
      );
    } else {
      return poseDetection.util.getAdjacentPairs(
        poseDetection.SupportedModels.MoveNet
      );
    }
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
