import * as tf from "@tensorflow/tfjs";
import callCallback from "../utils/callcallback";
import modelLoader from "../utils/modelLoader";
import handleArguments from "../utils/handleArguments";
import { handleModelName } from "../utils/handleOptions";
/**
 * Initializes the Sentiment demo.
 */

const OOV_CHAR = 2;
const PAD_CHAR = 0;

function padSequences(
  sequences,
  maxLen,
  padding = "pre",
  truncating = "pre",
  value = PAD_CHAR
) {
  return sequences.map((seq) => {
    // Perform truncation.
    if (seq.length > maxLen) {
      if (truncating === "pre") {
        seq.splice(0, seq.length - maxLen);
      } else {
        seq.splice(maxLen, seq.length - maxLen);
      }
    }
    // Perform padding.
    if (seq.length < maxLen) {
      const pad = [];
      for (let i = 0; i < maxLen - seq.length; i += 1) {
        pad.push(value);
      }
      if (padding === "pre") {
        // eslint-disable-next-line no-param-reassign
        seq = pad.concat(seq);
      } else {
        // eslint-disable-next-line no-param-reassign
        seq = seq.concat(pad);
      }
    }
    return seq;
  });
}

class Sentiment {
  /**
   * Create Sentiment model. Currently the supported model name is 'moviereviews'. ml5 may support different models in the future.
   * @param {String} modelName - A string to the path of the JSON model.
   * @param {function} callback - Optional. A callback function that is called once the model has loaded. If no callback is provided, it will return a promise that will be resolved once the model has loaded.
   */
  constructor(modelName, callback) {
    /**
     * Promise that resolves when the model has loaded.
     * @type {Promise<Sentiment>}
     * @public
     */
    this.modelName = handleModelName(
      modelName,
      ["MovieReviews"],
      "MovieReviews",
      "sentiment"
    );
    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Initializes the Sentiment demo.
   */

  async loadModel(modelName) {
    await tf.ready();
    const modelUrl =
      this.modelName.toLowerCase() === "moviereviews"
        ? "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/"
        : this.modelName;

    const loader = modelLoader(modelUrl, "model");

    // load in parallel
    const [model, sentimentMetadata] = await Promise.all([
      loader.loadLayersModel(),
      loader.loadMetadataJson(),
    ]);

    /**
     * The model being used.
     * @type {tf.LayersModel}
     * @public
     */
    this.model = model;

    this.indexFrom = sentimentMetadata.index_from;
    this.maxLen = sentimentMetadata.max_len;

    this.wordIndex = sentimentMetadata.word_index;
    this.vocabularySize = sentimentMetadata.vocabulary_size;

    return this;
  }

  /**
   * Scores the sentiment of given text with a value between 0 ("negative") and 1 ("positive").
   * @param {string} text - string of text to predict.
   * @param {function} callback - Optional. A callback function that is called once the prediction is done.
   * @returns {{confidence: number}}
   */
  async predict(...inputs) {
    const argumentObject = handleArguments(...inputs);
    const { string, callback } = argumentObject;
    argumentObject.require(
      "string",
      "A string argument is required for sentiment.predict function."
    );
    // Convert to lower case and remove all punctuations.
    const inputText = string
      .trim()
      .toLowerCase()
      .replace(/[.,?!]/g, "")
      .split(" ");
    // Convert the words to a sequence of word indices.

    const sequence = inputText.map((word) => {
      let wordIndex = this.wordIndex[word] + this.indexFrom;
      if (wordIndex > this.vocabularySize) {
        wordIndex = OOV_CHAR;
      }
      return wordIndex;
    });

    // Perform truncation and padding.
    const paddedSequence = padSequences([sequence], this.maxLen);
    const input = tf.tensor2d(paddedSequence, [1, this.maxLen]);
    const predictOut = this.model.predict(input);
    const predictData = await predictOut.data();
    const confidence = predictData[0];
    predictOut.dispose();
    input.dispose();

    if (callback) callback({ confidence });
    return { confidence };
  }
}

const sentiment = (...inputs) => {
  const { string, callback } = handleArguments(...inputs);
  const instance = new Sentiment(string, callback);
  return instance;
};

export default sentiment;
