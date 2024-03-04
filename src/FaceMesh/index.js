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
import ImageDetector from "../ImageDetector";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";

/**
 * @implements {SpecificDetectorImplementation}
 */
class FaceMesh {
  /**
   * An options object to configure FaceMesh settings
   * @typedef {Object} configOptions
   * @property {number} maxFaces - The maximum number of faces to detect. Defaults to 2.
   * @property {boolean} refineLandmarks - Refine the landmarks. Defaults to false.
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
  constructor(options, callback) {
    // for compatibility with p5's preload()
    if (this.p5PreLoadExists()) window._incrementPreload();

    this.model = null;
    this.config = options;
    this.runtimeConfig = {};

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
    const modelConfig = {
      runtime: "mediapipe",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
      maxFaces: this.config?.maxFaces ?? 1,
      refineLandmarks: this.config?.refineLandmarks ?? false,
    };
    this.runtimeConfig = {
      flipHorizontal: this.config?.flipHorizontal ?? false,
    };

    await tf.ready();
    this.model = await faceLandmarksDetection.createDetector(
      pipeline,
      modelConfig
    );

    // for compatibility with p5's preload()
    if (this.p5PreLoadExists()) window._decrementPreload();

    return this;
  }

  /**
   * Asynchronously output a single face prediction result when called
   * @param {*} [media] - An HTML or p5.js image, video, or canvas element to run the prediction on.
   * @returns {Promise<Array>} an array of predictions.
   */
  async detect(media) {
    const predictions = await this.model.estimateFaces(
      media,
      this.runtimeConfig
    );
    return this.addKeypoints(predictions);
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

    for (let face of faces) {
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
   * Check if p5.js' preload() function is present
   * @returns {boolean} true if preload() exists
   *
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
 * Factory function that returns a FaceMesh instance
 * @returns {ImageDetector} A new faceMesh instance
 */
const faceMesh = (...inputs) => {
  const { options = {}, callback } = handleArguments(...inputs);
  const instance = new FaceMesh(options, callback);
  return new ImageDetector(instance);
};

export default faceMesh;
