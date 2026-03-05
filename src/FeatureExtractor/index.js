import Mobilenet from "./Mobilenet";

/**
 * @typedef {Object} FeatureExtractorOptions
 * @property {1|2} [version=1] - MobileNet version
 * @property {number} [alpha=1.0] - Width multiplier. v1: 0.25, 0.5, 0.75, 1.0. v2: 0.5, 0.75, 1.0
 * @property {number} [hiddenUnits=100] - Hidden layer units in the MLP head
 * @property {number} [learningRate=0.0001] - Learning rate for training
 * @property {number} [epochs=20] - Number of training epochs
 * @property {number} [batchSize=0.4] - Batch size as a fraction of total training data
 */

/**
 * Create a featureExtractor for transfer learning with MobileNet.
 *
 * @example
 * const fe = ml5.featureExtractor(modelLoaded);
 *
 * @example
 * const fe = ml5.featureExtractor({ epochs: 30 }, modelLoaded);
 *
 * @param {FeatureExtractorOptions|Function} [optionsOrCallback] - Options object or callback function.
 * @param {Function} [cb] - Callback function called when the model is loaded.
 * @returns {Mobilenet} A FeatureExtractor instance.
 */
const featureExtractor = (optionsOrCallback, cb) => {
  let options = {};
  let callback;

  if (typeof optionsOrCallback === "function") {
    callback = optionsOrCallback;
  } else if (typeof optionsOrCallback === "object") {
    options = optionsOrCallback;
    callback = cb;
  }

  return new Mobilenet(options, callback);
};

export default featureExtractor;
