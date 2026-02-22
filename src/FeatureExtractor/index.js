import handleArguments from "../utils/handleArguments";
import Mobilenet from "./Mobilenet";

/**
 * @typedef {Object} FeatureExtractorOptions
 * @property {'classification'|'regression'} [task='classification'] - The task type
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
 * The task type (classification or regression) is specified in the options.
 *
 * @example
 * // Classification
 * const fe = ml5.featureExtractor('MobileNet', { task: 'classification' }, modelReady);
 *
 * @example
 * // Regression
 * const fe = ml5.featureExtractor('MobileNet', { task: 'regression' }, modelReady);
 *
 * @param {string} model - The model name. Currently only 'MobileNet' is supported (case-insensitive).
 * @param {FeatureExtractorOptions|Function} [optionsOrCallback] - Options object or callback function.
 * @param {Function} [cb] - Callback function called when the model is loaded.
 * @returns {Mobilenet} A FeatureExtractor instance.
 */
const featureExtractor = (model, optionsOrCallback, cb) => {
  const {
    string: modelName,
    options = {},
    callback,
  } = handleArguments(model, optionsOrCallback, cb);

  if (modelName && modelName.toLowerCase() !== "mobilenet") {
    throw new Error(`${modelName} is not a valid model.`);
  }

  return new Mobilenet(options, callback);
};

export default featureExtractor;
