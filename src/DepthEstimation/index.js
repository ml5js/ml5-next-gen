// Copyright (c) 2019-2025 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import handleArguments from "../utils/handleArguments";
import TensorflowDepthEstimation from "./tensorflowDepthEstimation";

/**
 * Creates a new DepthEstimation instance.
 * @param {string} [modelName="ARPortraitDepth"] - Model name.
 * @param {DepthEstimationOptions & DepthEstimationRuntimeOptions} [options] - Options.
 * @param {function(): void} [callback] - Callback when loaded.
 * @returns {DepthEstimation} A new depthEstimation instance.
 */
const depthEstimation = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  const instance = new TensorflowDepthEstimation(string, options, callback);
  return instance;
};

export default depthEstimation;
