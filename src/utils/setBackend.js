// Copyright (c) 2018-2024 ml5
//
// This software is open source and the ml5.js license.
// https://github.com/ml5js/ml5-next-gen/blob/88f7a3b260c59de84a7e4dab181cd3f69ba19bb1/LICENSE.md

import * as tf from "@tensorflow/tfjs";

/**
 * Manually set the Tensorflow.js Backend to the specified backend.
 * Determines how the operation is done for the following features:
 * - handpose under "tfjs" runtime
 * - poseDetection
 * - facemesh
 * - neuralNetwork
 *
 * @param {string} backend the backend to set to. Must be "cpu", "webgl", or "webgpu".
 * @return {boolean} true if the backend was set successfully.
 */
export default function setBackend(backend) {
  switch (backend) {
    case "cpu":
      tf.setBackend("cpu");
      break;
    case "webgl":
      tf.setBackend("webgl");
      break;
    case "webgpu":
      tf.setBackend("webgpu");
      break;
    default:
      throw new Error(
        `Invalid backend: ${backend}. The backend parameter must be set to one of the following strings: "cpu", "webgl", or "webgpu".`
      );
  }

  return true;
}
