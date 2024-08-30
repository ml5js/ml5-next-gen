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
 * ml5.js BodyPose reference documentation:
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
 * User provided options object for BodyPose with MoveNet model.
 * @typedef {object} MoveNetOptions
 * @property {string} [modelType]             - The type of MoveNet model to use.
 * @property {boolean} [enableSmoothing]      - Whether to use temporal filter to smooth the
 *                                              keypoints across frames.
 * @property {number} [minPoseScore]          - The minimum confidence score for a pose to be
 *                                              detected.
 * @property {number} [multiPoseMaxDimension] - The target maximum dimension to use as the
 *                                              input to the multi-pose model. Only for
 *                                              `MULTIPOSE_LIGHTNING` model.
 * @property {boolean} [enableTracking]       - Whether to track each person across the frames
 *                                              with a unique ID.
 * @property {string} [trackerType]           - The type of tracker to use.
 * @property {object} [trackerConfig]         - Advanced tracker configurations.
 * @property {string} [modelUrl]              - The file path or URL to the MoveNet model.
 */

/**
 * User provided options object for BodyPose with BlazePose model.
 * @typedef {object} BlazePoseOptions
 * @property {string} [runtime]               - The runtime to use.
 * @property {boolean} [enableSmoothing]      - Whether to use temporal filter to smooth
 *                                              keypoints across frames.
 * @property {boolean} [enableSegmentation]   - Whether to generate the segmentation mask.
 *                                              Only for `mediapipe` runtime.
 * @property {boolean} [smoothSegmentation]   - Whether to filter segmentation masks across
 *                                              different frames to reduce jitter. Only for
 *                                              `mediapipe` runtime.
 * @property {string} [solutionPath]          - The URL to the MediaPipe BlazePose solution.
 *                                              Only for `mediapipe` runtime.
 * @property {string} [modelType]             - The type of BlazePose model to use.
 * @property {string} [detectorModelUrl]      - The file path or URL to the BlazePose detector
 *                                              model. Only for `tfjs` runtime.
 * @property {string} [landmarkModelUrl]      - The file path or URL to the BlazePose landmark
 *                                              model. Only for `tfjs` runtime.
 */

/**
 * Schema for MoveNet model configuration, used by `handleOptions` to
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
 * Schema for BlazePose model configuration, used by `handleOptions` to
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
 * Schema for runtime configuration, used by `handleOptions` to
 * validate the user's options object.
 */
const RuntimeConfigSchema = {
  flipHorizontal: {
    type: "boolean",
    alias: "flipped",
    default: false,
  },
};

class BodyPose {
  /**
   * Creates an instance of BodyPose model.
   * The constructor should be called with the `ml5.bodyPose` method and not directly.
   * @param {string} modelName - The underlying model to use, `MoveNet` or `BlazePose`.
   * @param {MoveNetOptions|BlazePoseOptions} options - An options object for the model.
   * @param {function} callback  - A callback function that is called once the model has been loaded.
   * @private
   */
  constructor(modelName, options, callback) {
    /** The underlying model used. */
    this.modelName = handleModelName(
      modelName,
      ["BlazePose", "MoveNet"],
      "MoveNet",
      "bodyPose"
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
   * Loads the BodyPose instance.
   * @return {BodyPose} the BodyPose instance.
   * @private
   */
  async loadModel() {
    let pipeline;
    let modelConfig;
    // Select the correct model pipeline and config schema based on the model name
    if (this.modelName === "BlazePose") {
      pipeline = poseDetection.SupportedModels.BlazePose;
      modelConfig = handleOptions(
        this.userOptions,
        blazePoseConfigSchema,
        "bodyPose"
      );
    } else {
      pipeline = poseDetection.SupportedModels.MoveNet;
      modelConfig = handleOptions(
        this.userOptions,
        MoveNetConfigSchema,
        "bodyPose"
      );
      // Map the modelType string to the `movenet.modelType` enum
      switch (modelConfig.modelType) {
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
    // Filter out the runtime config options
    this.runtimeConfig = handleOptions(
      this.userOptions,
      RuntimeConfigSchema,
      "bodyPose"
    );
    // Load the TensorFlow.js detector instance
    await tf.ready();
    this.model = await poseDetection.createDetector(pipeline, modelConfig);
    return this;
  }

  /**
   * Asynchronously outputs a single pose prediction result when called.
   * @param {any} media - An HTML or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} callback - A callback function to handle the predictions.
   * @returns {Promise<Array>} an array of poses.
   * @public
   */
  async detect(...inputs) {
    // Parse the input parameters
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for detect()."
    );
    const { image, callback } = argumentObject;
    // Run the detection
    await mediaReady(image, false);
    const predictions = await this.model.estimatePoses(image);
    let result = predictions;
    // Modify the raw tfjs output to a more usable format
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
      this.mirrorBoundingBoxes(result);
    }
    this.addKeypoints(result);
    this.resizeBoundingBoxes(result, image.width, image.height);
    // Output the result via callback and promise
    if (typeof callback === "function") callback(result);
    return result;
  }

  /**
   * Repeatedly outputs pose predictions through a callback function.
   * Calls the internal detectLoop() function.
   * @param {any} media - An HTML or p5.js image, video, or canvas element to run the prediction on.
   * @param {gotPoses} callback - A callback function to handle the predictions.
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
   * Internal function that calls underlying `estimatePoses` repeatedly.
   * Can be started by `detectStart` and terminated by `detectStop`.
   * @private
   */
  async detectLoop() {
    await mediaReady(this.detectMedia, false);
    while (!this.signalStop) {
      const predictions = await this.model.estimatePoses(this.detectMedia);
      let result = predictions;
      // Modify the raw tfjs output to a more usable format
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
        this.mirrorBoundingBoxes(result);
      }
      this.addKeypoints(result);
      this.resizeBoundingBoxes(
        result,
        this.detectMedia.width,
        this.detectMedia.height
      );
      // Call the user provided callback function with the detection results
      this.detectCallback(result);
      // wait for the frame to update
      await tf.nextFrame();
    }
    this.detecting = false;
    this.signalStop = false;
  }

  /**
   * Stops the detection loop before next detection runs.
   * @public
   */
  detectStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
  }

  /**
   * Rename the `score` property in the detection results to `confidence` for consistency.
   * @param {object[]} poses - the original detection results.
   * @private
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
   * Mirror the keypoints in the detection results around the x-axis.
   * @param {object} poses - the original detection results.
   * @param {number} mediaWidth - the media element being detected.
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
   * Mirror the bounding box in the detection results around the x-axis.
   * This method should be call before `resizeBoundingBoxes` method.
   * @param {Object} poses - the original detection results.
   * @private
   */
  mirrorBoundingBoxes(poses) {
    poses.forEach((pose) => {
      if (!pose.box) return;
      const tempXMin = pose.box.xMin;
      pose.box.xMin = 1 - pose.box.xMax;
      pose.box.xMax = 1 - tempXMin;
    });
  }

  /**
   * Resize the keypoints of MoveNet model to match the video size.
   * This method should only be used when the input media is a video element and the model is MoveNet.
   * @param {object} poses - the original detection results.
   * @param {number} intrinsicWidth - the actual width of the video.
   * @param {number} intrinsicHeight - the actual height of the video.
   * @param {number} displayWidth - the display width of the video.
   * @param {number} displayHeight - the display height of the video.
   */
  resizeKeypoints(
    poses,
    intrinsicWidth,
    intrinsicHeight,
    displayWidth,
    displayHeight
  ) {
    poses.forEach((pose) => {
      pose.keypoints.forEach((keypoint) => {
        keypoint.x = (keypoint.x / intrinsicWidth) * displayWidth;
        keypoint.y = (keypoint.y / intrinsicHeight) * displayHeight;
      });
    });
  }

  /**
   * Add named keypoints to the detection results for easier access.
   * @param {Array} poses - the original detection results.
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
   * Resize the bounding box values of the detection results from between 0-1
   * to the original media size.
   * @param {Array} poses - the original detection results.
   * @param {number} imageWidth - the width of the media being detected.
   * @param {number} imageHeight - the height of the media being detected.
   * @private
   */
  resizeBoundingBoxes(poses, imageWidth, imageHeight) {
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
   * @returns {number[][]} an array of pairs of indices containing the connected keypoints.
   * @public
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
 * @param {string} modelName - The underlying model to use, `MoveNet` or `BlazePose`.
 * @param {MoveNetOptions|BlazePoseOptions} options - A user-defined options object for the model.
 * @param {function} callback  - A callback function that is called once the model has been loaded.
 * @returns {BodyPose} A BodyPose instance.
 */
const bodyPose = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  const instance = new BodyPose(string, options, callback);
  return instance;
};

export default bodyPose;
