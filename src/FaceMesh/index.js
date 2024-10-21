/**
 * @license
 * Copyright (c) 2020-2024 ml5
 * This software is released under the ml5.js License.
 * https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 */

/**
 * @file HandPose
 *
 * The file contains the main source code of FaceMesh, a pretrained face landmark
 * estimation model that detects and tracks faces and facial features with landmark points.
 * The FaceMesh model is built on top of the face detection model of TensorFlow.
 *
 * TensorFlow Face Detection repo:
 * https://github.com/tensorflow/tfjs-models/tree/master/face-detection
 * ml5.js BodyPose reference documentation:
 * https://docs.ml5js.org/#/reference/facemesh
 */

import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";
import handleOptions from "../utils/handleOptions";
import { handleModelName } from "../utils/handleOptions";

/**
 * User provided options object for FaceMesh. See config schema below for default and available values.
 * @typedef {Object} configOptions
 * @property {number} [maxFaces]           - The maximum number of faces to detect.
 * @property {boolean} [refineLandmarks]   - Whether to refine the landmarks.
 * @property {boolean} [flipHorizontal]    - Whether to mirror the results.
 * @property {string} [runtime]            - The runtime to use.
 * @property {string} [solutionPath]       - The file path or URL to the MediaPipe solution. Only
 *                                           for `mediapipe` runtime.
 * @property {string} [detectorModelUrl]   - The file path or URL to the detector model. Only for
 *                                           `tfjs` runtime.
 * @property {string} [landmarkModelUrl]   - The file path or URL to the landmark model. Only for
 *                                           `tfjs` runtime.
 */

/**
 * Schema for initialization options, used by `handleOptions` to
 * validate the user's options object.
 */
const configSchema = {
  runtime: {
    type: "enum",
    enums: ["mediapipe", "tfjs"],
    default: "tfjs",
  },
  maxFaces: {
    type: "number",
    min: 1,
    default: 1,
  },
  refineLandmarks: {
    type: "boolean",
    default: false,
  },
  solutionPath: {
    type: "string",
    default: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
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
const runtimeSchema = {
  flipHorizontal: {
    type: "boolean",
    alias: "flipped",
    default: false,
  },
};

class FaceMesh {
  /**
   * Creates an instance of FaceMesh.
   * @param {string} [modelName] - The name of the model to use.
   * @param {configOptions} options - An object with options.
   * @param {function} callback - A callback to be called when the model is ready.
   * @private
   */
  constructor(modelName, options, callback) {
    this.modelName = handleModelName(
      modelName,
      ["FaceMesh"],
      "FaceMesh",
      "faceMesh"
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
   * Load the FaceMesh instance.
   * @return {this} the FaceMesh model.
   * @private
   */
  async loadModel() {
    const pipeline = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    // Filter out model config options
    const modelConfig = handleOptions(
      this.userOptions,
      configSchema,
      "faceMesh"
    );
    this.runtimeConfig = handleOptions(
      this.userOptions,
      runtimeSchema,
      "faceMesh"
    );

    // Load the model once tfjs is ready
    await tf.ready();
    this.model = await faceLandmarksDetection.createDetector(
      pipeline,
      modelConfig
    );

    return this;
  }

  /**
   * Asynchronously outputs a single face prediction result when called.
   * @param {any} media - An HTML or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} [callback] - A callback function to handle the detection result.
   * @returns {Promise<Array>} an array of predicted faces.
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
    // Run the prediction
    await mediaReady(image, false);
    const predictions = await this.model.estimateFaces(
      image,
      this.runtimeConfig
    );
    let result = predictions;
    result = this.addKeypoints(result);
    if (typeof callback === "function") callback(result);
    return result;
  }

  /**
   * Repeatedly outputs face predictions through a callback function.
   * @param {any} media - An HTML or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} [callback] - A callback function to handle the prediction results.
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

    // Set the flags and call the detection loop
    this.signalStop = false;
    if (!this.detecting) {
      this.detecting = true;
      this.detectLoop();
    }
    if (this.prevCall === "start") {
      console.warn(
        "detectStart() was called more than once without calling detectStop(). The lastest detectStart() call will be used and the previous calls will be  ignored."
      );
    }
    this.prevCall = "start";
  }

  /**
   * Stop the continuous detection before next detection loop runs.
   * @public
   */
  detectStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
  }

  /**
   * Calls estimateFaces in a loop.
   * Can be started by `detectStart` and terminated by `detectStop`.
   * @private
   */
  async detectLoop() {
    await mediaReady(this.detectMedia, false);
    while (!this.signalStop) {
      const predictions = await this.model.estimateFaces(
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
   * Return a new array of results with named features added.
   * The keypoints in each named feature is sorted the order of the contour.
   * @param {Array} faces - The original detection results.
   * @return {Array} - The detection results with named keypoints added.
   * @private
   */
  addKeypoints(faces) {
    const contours = faceLandmarksDetection.util.getKeypointIndexByContour(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
    );
    // Add the missing keypoint to the lips contour
    // Remove the following line when the tfjs fix the lips issue
    // https://github.com/tensorflow/tfjs/issues/8221
    if (contours.lips[20] !== 291) contours.lips.splice(20, 0, 291);
    for (let face of faces) {
      // Remove the following line when the tfjs fix the lips issue
      face.keypoints[291].name = "lips";
      for (let contourLabel in contours) {
        for (let keypointIndex of contours[contourLabel]) {
          // check if face has this keypoint
          if (keypointIndex >= face.keypoints.length) {
            continue;
          }
          // if this doesn't exist yet, create an object to hold the contour
          if (face[contourLabel] === undefined) {
            face[contourLabel] = { keypoints: [] };
          }
          // add the keypoint
          let keypoint = face.keypoints[keypointIndex];
          face[contourLabel].keypoints.push({
            x: keypoint.x,
            y: keypoint.y,
            z: keypoint.z,
          });
          // track the extent of contour coordinates
          face[contourLabel].xMin =
            face[contourLabel].xMin === undefined ||
            keypoint.x < face[contourLabel].xMin
              ? keypoint.x
              : face[contourLabel].xMin;
          face[contourLabel].xMax =
            face[contourLabel].xMax === undefined ||
            keypoint.x > face[contourLabel].xMax
              ? keypoint.x
              : face[contourLabel].xMax;
          face[contourLabel].yMin =
            face[contourLabel].yMin === undefined ||
            keypoint.y < face[contourLabel].yMin
              ? keypoint.y
              : face[contourLabel].yMin;
          face[contourLabel].yMax =
            face[contourLabel].yMax === undefined ||
            keypoint.y > face[contourLabel].yMax
              ? keypoint.y
              : face[contourLabel].yMax;
        }
        // finalize contour coordinates
        if (face[contourLabel]) {
          face[contourLabel].x = face[contourLabel].xMin;
          face[contourLabel].y = face[contourLabel].yMin;
          face[contourLabel].width =
            face[contourLabel].xMax - face[contourLabel].xMin;
          face[contourLabel].height =
            face[contourLabel].yMax - face[contourLabel].yMin;
          face[contourLabel].centerX =
            face[contourLabel].x + face[contourLabel].width / 2;
          face[contourLabel].centerY =
            face[contourLabel].y + face[contourLabel].height / 2;
          delete face[contourLabel].xMin;
          delete face[contourLabel].xMax;
          delete face[contourLabel].yMin;
          delete face[contourLabel].yMax;
        }
      }
    }
    return faces;
  }

  /**
   * Returns the trio of keypoint indices that form each triangle in the face mesh.
   * @returns {number[][]} an array of triangles, each containing three keypoint indices.
   * @public
   */
  getTriangles() {
    const connectingPairs = faceLandmarksDetection.util.getAdjacentPairs(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
    );

    const triangles = [];
    for (let i = 0; i < connectingPairs.length; i += 3) {
      const triangle = [
        connectingPairs[i][0],
        connectingPairs[i + 1][0],
        connectingPairs[i + 2][0],
      ];
      triangles.push(triangle);
    }

    return triangles;
  }
}

/**
 * Factory function that returns a FaceMesh instance.
 * @param {string} [modelName] - The name of the model to use.
 * @param {configOptions} [options] - A user-defined options object.
 * @param {function} [callback] - A callback to be called when the model is ready.
 * @returns {Object} A new faceMesh instance.
 */
const faceMesh = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  const instance = new FaceMesh(string, options, callback);
  return instance;
};

export default faceMesh;
