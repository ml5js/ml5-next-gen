// Copyright (c) 2019-2026 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import handleArguments from "../utils/handleArguments";
import TensorflowDepthEstimation from "./tensorflowDepthEstimation";
import TransformersDepthEstimation from "./transformersDepthEstimation";
import { handleModelName } from "../utils/handleOptions";

/**
 * Creates a new DepthEstimation instance.
 * @param {string} [modelName="ARPortraitDepth"] - Model name.
 * @param {TensorflowDepthEstimationOptions & TensorflowDepthEstimationRuntimeOptions | TransformersDepthEstimationRuntimeOptions} [options] - Options.
 * @param {function(): void} [callback] - Callback when loaded.
 * @returns {TensorflowDepthEstimation | TransformersDepthEstimation} A new depthEstimation instance.
 */
const depthEstimation = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  // Validate and normalize the model name
  const modelName = handleModelName(
    string,
    ["ARPortraitDepth", "DepthAnything", "DepthAnythingV2Small"],
    "ARPortraitDepth",
    "depthEstimation"
  );

  // Route to the appropriate implementation based on modelName
  if (modelName === "ARPortraitDepth") {
    return new TensorflowDepthEstimation(options, callback);
  }
  
  // We assume the name is a transformers.js model if it is not ARPortraitDepth.
  // If it isn't, an error is thrown in the constructor of TransformersDepthEstimation
  return new TransformersDepthEstimation(modelName, options, callback);
};

export default depthEstimation;
