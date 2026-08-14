import { pipeline } from "@huggingface/transformers";
import handleArguments, { isVideo } from "../utils/handleArguments";
import { drawToCanvas } from "../utils/imageUtilities";

/**
 * Maps ml5-friendly model names to their Hugging Face model ids.
 * Add new transformer-based classifiers here.
 * For reference, the list of foods identifiable by this api: https://github.com/alpapado/food-101/blob/master/data/meta/classes.txt
 */
const TRANSFORMER_MODELS = {
  ViTBase: "Xenova/vit-base-patch16-224",
  SwinFood101: "onnx-community/swin-finetuned-food101-ONNX",
};

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
   * @param {string} modelName - Key into TRANSFORMER_MODELS (e.g. "ViTBase", "SwinFood101")
   * @param {Object} options
   * @param {function} callback
   */
  constructor(modelName, options, callback) {
    this.classifier = null;
    this.needToStop = false;
    this.isClassifying = false;
    this.topk = options.topk || 3;
    this.device = options.device || chooseDevice();

    const hfModelId = TRANSFORMER_MODELS[modelName];
    if (!hfModelId) {
      throw new Error(
        `Unknown transformer model "${modelName}". Options: ${Object.keys(
          TRANSFORMER_MODELS
        ).join(", ")}`
      );
    }

    // Print which underlying HF model is being loaded
    console.log(
      `ml5.imageClassifier: loading "${modelName}" → Hugging Face model "${hfModelId}"`
    );

    this.ready = pipeline("image-classification", hfModelId, {
      device: this.device,
      ...options,
    }).then((classifier) => {
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

    // Convert topk to top_k for transformers.js and get the results
    const topk = number !== undefined ? number : this.topk;
    const results = await this.classifier(input, { top_k: topk });

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
        requestAnimationFrame(next);
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
