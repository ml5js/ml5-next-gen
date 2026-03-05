import { pipeline } from "@huggingface/transformers";
import handleArguments, { isVideo } from "../utils/handleArguments";
import { drawToCanvas } from "../utils/imageUtilities";

/**
 * Chooses the best available device for running the model.
 * Prefers WebGPU for better performance, falls back to WASM.
 * @returns {string} The device to use ("webgpu" or "wasm").
 * @private
 */
function chooseDevice() {
  if (typeof navigator !== "undefined" && navigator.gpu) return "webgpu";
  return "wasm";
}

/**
 * Image classifier using Vision Transformer (ViT) model from Hugging Face Transformers.js
 * @reference https://huggingface.co/docs/transformers.js/en/api/pipelines#module_pipelines.ImageClassificationPipeline
 */
export class ImageClassifierTransformer {
  /**
   * Creates an instance of ImageClassifierTransformer.
   * @param {Object} options - An options object for the model.
   * @param {number} [options.topK] - The number of top predictions to return. Default is 3.
   * @param {string} [options.device] - The device to run inference on. Will be auto-detected if not specified.
   * @param {string} [options.dtype] - The data type to use for the model. Default is "fp32".
   * @param {*} [options.*] - Additional options supported by transformers.js pipeline.
   *                          See: https://huggingface.co/docs/transformers.js/en/api/pipelines#module_pipelines.pipeline
   * @param {function} callback - A callback function that is called once the model has been loaded.
   * @returns {ImageClassifierTransformer} The created ImageClassifierTransformer instance.
   */
  constructor(options, callback) {
    this.classifier = null; // The underlying transformers.js classifier instance.
    this.needToStop = false; // A flag to signal stop to the classification loop.
    this.isClassifying = false; // A flag to track if classification is currently in progress.
    this.topK = options.topK || 3; // The number of top predictions to return.
    this.device = options.device || chooseDevice(); // The device to run inference on (webgpu or wasm).
    this.ready = pipeline(
      "image-classification",
      "Xenova/vit-base-patch16-224",
      { device: this.device, ...options }
    ).then((classifier) => {
      this.classifier = classifier;
      callback?.(this);
      return this;
    });
  }

  /**
   * Classifies an image and returns the top predictions.
   * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | p5.Image | p5.Video} inputNumOrCallback - An image to classify, or the number of top predictions, or a callback function.
   * @param {number | function} [numOrCallback] - The number of top predictions to return, or a callback function.
   * @param {function} [cb] - A callback function to handle the classification results.
   * @returns {Promise<Array>} An array of classification results with label and confidence.
   * @public
   */
  async classify(inputNumOrCallback, numOrCallback, cb) {
    if (this.isClassifying || !this.classifier) return;
    this.isClassifying = true;
    // Parse the input parameters
    const { image, number, callback } = handleArguments(
      inputNumOrCallback,
      numOrCallback,
      cb
    ).require(
      "image",
      "No input image provided. If you want to classify a video, use classifyStart."
    );

    // Transformers.js doesn't support HTMLVideoElement directly, so convert to canvas
    const input = isVideo(image) ? drawToCanvas(image) : image;

    // Convert topK to top_k for transformers.js and get the results
    const topK = number !== undefined ? number : this.topK;
    const results = await this.classifier(input, { top_k: topK });

    // Normalize the results to match the format from tensorflowjs
    const normalized = results.map((result) => ({
      label: result.label,
      confidence: result.score,
    }));

    // Output the result via callback and/or promise
    callback(normalized);
    this.isClassifying = false;
    return normalized;
  }

  /**
   * Repeatedly outputs classification predictions through a callback function.
   * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | p5.Image | p5.Video} inputNumOrCallback - An image to classify, or the number of top predictions, or a callback function.
   * @param {number | function} [numOrCallback] - The number of top predictions to return, or a callback function.
   * @param {function} [cb] - A callback function to handle the classification results.
   * @public
   */
  async classifyStart(inputNumOrCallback, numOrCallback, cb) {
    await this.ready;

    if (this.isClassifying || !this.classifier) return;

    this.needToStop = false;

    // Call the classification loop
    const next = () => {
      if (this.needToStop) return;
      this.classify(inputNumOrCallback, numOrCallback, cb).then(() => {
        // WebGPU is very fast, so we can call the next frame immediately
        if (this.device === "webgpu") next();
        // Wasm is slower, so we wait for 1 second before calling the next frame
        else setTimeout(next, 1000);
      });
    };

    next();
  }

  /**
   * Stops the classification loop before the next classification runs.
   * @public
   */
  async classifyStop() {
    this.needToStop = true;
  }
}
