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
    console.log('You would load the face-landmarks-detection model here');
    return this;
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
