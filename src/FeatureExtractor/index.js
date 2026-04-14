import Mobilenet from "./Mobilenet";

/**
 * @typedef {Object} FeatureExtractorOptions
 * @property {1|2} [version=2] - MobileNet version
 * @property {number} [alpha=1.0] - Width multiplier. v1: 0.25, 0.5, 0.75, 1.0. v2: 0.5, 0.75, 1.0
 * @property {'classification'|'regression'} [task='classification'] - The task type
 */

/**
 * Create a featureExtractor for transfer learning with MobileNet.
 *
 * @example
 * const fe = ml5.featureExtractor(modelLoaded);
 *
 * @example
 * const fe = ml5.featureExtractor({ task: 'classification' }, modelLoaded);
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
