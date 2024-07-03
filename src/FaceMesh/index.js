// Copyright (c) 2020-2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 * FaceMesh: Face landmarks tracking in the browser
 * Ported and integrated from all the hard work by: https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
 */

import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";
import handleOptions from "../utils/handleOptions";
import { handleModelName } from "../utils/handleOptions";

class FaceMesh {
  /**
   * An options object to configure FaceMesh settings
   * @typedef {Object} configOptions
   * @property {number} maxFacess - The maximum number of faces to detect. Defaults to 2.
   * @property {boolean} refineLandmarks - Refine the ladmarks. Defaults to false.
   * @property {boolean} flipHorizontal - Flip the result horizontally. Defaults to false.
   * @property {string} runtime - The runtime to use. "mediapipe"(default) or "tfjs".
   *
   * // For using custom or offline models
   * @property {string} solutionPath - The file path or URL to the model.
   */

  /**
   * Create FaceMesh.
   * @param {configOptions} options - An object with options.
   * @param {function} callback - A callback to be called when the model is ready.
   *
   * @private
   */
  constructor(modelName, options, callback) {
    this.modelName = handleModelName(
      modelName,
      ["FaceMesh"],
      "FaceMesh",
      "faceMesh"
    );
    this.model = null;
    this.config = options;
    this.runtimeConfig = {};
    this.detectMedia = null;
    this.detectCallback = null;

    // flags for detectStart() and detectStop()
    this.detecting = false; // true when detection loop is running
    this.signalStop = false; // true when detectStop() is called and detecting is true
    this.prevCall = ""; // "start" or "stop", used for giving warning messages with detectStart() is called twice in a row

    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Load the model and set it to this.model
   * @return {this} the FaceMesh model.
   *
   * @private
   */
  async loadModel() {
    const pipeline = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    // filter out model config options
    const modelConfig = handleOptions(
      this.config,
      {
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
      },
      "faceMesh"
    );

    this.runtimeConfig = handleOptions(
      this.config,
      {
        flipHorizontal: {
          type: "boolean",
          alias: "flipped",
          default: false,
        },
      },
      "faceMesh"
    );

    await tf.ready();
    this.model = await faceLandmarksDetection.createDetector(
      pipeline,
      modelConfig
    );

    return this;
  }

  /**
   * Asynchronously output a single face prediction result when called
   * @param {*} [media] - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} [callback] - A callback function to handle the predictions.
   * @returns {Promise<Array>} an array of predictions.
   */
  async detect(...inputs) {
    // Parse out the input parameters
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for detect()."
    );
    const { image, callback } = argumentObject;

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
   * Repeatedly output face predictions through a callback function
   * @param {*} [media] - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {function} [callback] - A callback function to handle the predictions.
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
        "detectStart() was called more than once without calling detectStop(). The lastest detectStart() call will be used and the previous calls will be  ignored."
      );
    }
    this.prevCall = "start";
  }

  /**
   * Stop the detection loop before next detection loop runs.
   */
  detectStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
  }

  /**
   * Internal function to call estimateFaces in a loop
   * Can be started by detectStart() and terminated by detectStop()
   *
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
   * Return a new array of results with named keypoints added
   * @param {Array} faces - the original detection results
   * @return {Array} the detection results with named keypoints added
   *
   * @private
   */
  addKeypoints(faces) {
    const contours = faceLandmarksDetection.util.getKeypointIndexByContour(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
    );
    // Remove the following line when the tfjs fix the lips issue
    if (contours.lips[20] !== 291) contours.lips.splice(20, 0, 291);
    for (let face of faces) {
      // Remove the following line when the tfjs fix the lips issue
      // https://github.com/tensorflow/tfjs/issues/8221
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
}

/**
 * Factory function that returns a FaceMesh instance
 * @returns {Object} A new faceMesh instance
 */
const faceMesh = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  const instance = new FaceMesh(string, options, callback);
  return instance;
};

export default faceMesh;
