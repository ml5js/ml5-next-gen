import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";
import handleOptions from "../utils/handleOptions";
import { loadTransformersFromCDN } from "../utils/transformersLoader";
import {
  createImageDataFromDepthValues,
  generateP5Image,
} from "./utils/imageDataUtils";

/**
 * @typedef {Object} TransformersDepthEstimationRuntimeOptions Estimation runtime options.
 * @property {boolean} [flipHorizontal=false] - Whether to flip the input image horizontally. Alias: `flipped`.
 * @property {ColormapName | string} [colormap='GRAYSCALE'] - The colormap for `result.image` output. Options: 'color', 'grayscale'.
 * @property {number | null} [targetFps=null] - Target FPS for continuous estimation (`estimateStart`). If set, skips frames to approximate the target. `null` runs as fast as possible.
 * @property {DeviceName | string} [device='webgpu'] - The backend device to run the model on. Options: 'webgpu', 'webgl', 'cpu', 'wasm'. Gets passed to transformers.js.
 * @property {string} [dtype='fp16'] - The data type for the model. Options: 'fp32' (default for webgpu), 'fp16', 'q8' (default for wasm) and 'q4'. Gets passed to transformers.js.
 */

/**
 * @typedef {Object} TransformersDepthEstimationResult The result object from a depth estimation.
 * @property {number[][]} data - Raw depth map as a 2D array.
 * @property {p5.Image | ImageData} image - p5.Image (if p5 is running, otherwise ImageData) of the depth map with chosen colormap.
 * @property {ImageData} imageData - ImageData visualization (normalized) with chosen colormap.
 * @property {number} width - Width of the depth map.
 * @property {number} height - Height of the depth map.
 * @property {function(number, number): number | null} getDepthAt - Get raw depth at (x, y).
 */

/**
 * @class
 * TransformersDepthEstimation class using the TensorFlow.js ARPortraitDepth model.
 */
class TransformersDepthEstimation {
  /**
   * Initializes the TransformersDepthEstimation class.
   * @param {TransformersDepthEstimationRuntimeOptions} [options] - Model loading and runtime options.
   * @param {function} [callback] - Callback when model is loaded.
   */
  constructor(options, callback) {
    this.modelName = "depth-anything-v2-small";
    this.model = null;
    this.config = options; // Store original options
    this.runtimeConfig = {};
    this.detectMedia = null;
    this.detectCallback = null;
    this.detecting = false;
    this.signalStop = false;
    this.prevCall = null;
    this.lastFrameTime = 0; // For FPS control
    this.sourceFrameCanvas = null; // Store the exact frame used in estimation

    this.ready = callCallback(this.loadModels(), callback); // Renamed loadModel -> loadModels
  }

  /** Loads and set up the model pipeline and our internal configurations (Depth and optionally Segmentation). @private */
  async loadModels() {
    let pipeline;
    this.runtimeConfig = handleOptions(
      this.config,
      {
        flipHorizontal: { type: "boolean", alias: "flipped", default: false }, // Flips the input horizontally before estimation.
        colormap: {
          type: "enum",
          enums: ["color", "grayscale"],
          default: "GRAYSCALE",
          transform: (v) => v.toUpperCase(),
        },
        targetFps: { type: "number", min: 1, default: null },
        device: {
          type: "enum",
          enums: ["webgpu", "webgl", "cpu", "wasm"],
          default: "webgpu",
        },
        dtype: {
          type: "enum",
          enums: ["fp32", "fp16", "q8", "q4"],
          default: "fp16",
        },
      },
      "depthEstimation (runtime)"
    );

    // Ensure transformers loader is available
    await loadTransformersFromCDN();

    // Call the global loadTransformers function
    pipeline = await window.loadTransformers();
    this.model = await pipeline(
      "depth-estimation", // Model task
      "onnx-community/depth-anything-v2-small",
      {
        device: this.runtimeConfig.device,
        dtype: this.runtimeConfig.dtype,
      }
    );

    return this;
  }

  /** Creates or returns the reusable canvas for the source frame. @private */
  getSourceFrameCanvas(width, height) {
    if (
      !this.sourceFrameCanvas ||
      this.sourceFrameCanvas.width !== width ||
      this.sourceFrameCanvas.height !== height
    ) {
      this.sourceFrameCanvas = document.createElement("canvas");
      this.sourceFrameCanvas.width = width;
      this.sourceFrameCanvas.height = height;
    }
    return this.sourceFrameCanvas;
  }

  /** Estimates depth from a single input. */
  async estimate(...inputs) {
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "Input image/video/canvas required for estimate()."
    );
    const { image, options = {}, callback } = argumentObject;

    await mediaReady(image, false);

    const result = await this.getDepthResult(image);

    if (callback) callback(result);
    return result;
  }

  /** Starts continuous estimation. */
  estimateStart(...inputs) {
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "Input image/video/canvas required for estimateStart()."
    );
    argumentObject.require(
      "callback",
      "Callback function required for estimateStart()."
    );
    const { image, options = {}, callback } = argumentObject; // Allow runtime options override

    this.detectMedia = image;
    this.detectCallback = callback;
    // Merge runtime options if provided for the continuous loop
    this.runtimeConfig = { ...this.runtimeConfig, ...options };

    this.signalStop = false;
    if (!this.detecting) {
      this.detecting = true;
      this.lastFrameTime = performance.now(); // Initialize for FPS control
      this.detectLoop(); // detectLoop will handle awaiting models
    }
    if (this.prevCall === "start") {
      console.warn(
        "estimateStart() called again without estimateStop(). Overwriting previous loop."
      );
    }
    this.prevCall = "start";
  }

  /** Stops continuous estimation. */
  estimateStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
  }

  /** Internal loop for continuous estimation. @private */
  async detectLoop() {
    await mediaReady(this.detectMedia, false);

    while (!this.signalStop) {
      const startTime = performance.now();
      // --- FPS Control ---
      if (this.runtimeConfig.targetFps) {
        const elapsed = startTime - this.lastFrameTime;
        const minInterval = 1000 / this.runtimeConfig.targetFps;
        if (elapsed < minInterval) {
          // Wait for the remaining time
          await new Promise((resolve) =>
            setTimeout(resolve, minInterval - elapsed)
          );
          continue; // Skip this frame
        }
        // Adjust lastFrameTime, considering potential overshoot
        this.lastFrameTime = startTime - (elapsed % minInterval);
      } else {
        this.lastFrameTime = startTime; // No FPS limit, just update time
      }
      // --- End FPS Control ---

      let inputForDepth = this.detectMedia;

      const result = await this.getDepthResult(inputForDepth);

      if (result) {
        this.detectCallback(result);
      }
    }

    this.detecting = false;
    this.signalStop = false;
  }

  async getDepthResult(image) {
    //Save a snapshot of the current frame onto our sourceFrameCanvas
    const ctx = this.getSourceFrameCanvas(image.width, image.height).getContext(
      "2d"
    );
    ctx.clearRect(0, 0, image.width, image.height);

    // Apply horizontal flip if selected through options
    if (this.runtimeConfig.flipHorizontal) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(image, -image.width, 0, image.width, image.height);
      ctx.restore();
    } else {
      ctx.drawImage(image, 0, 0, image.width, image.height);
    }

    let depthResult = await this.model(ctx.canvas.toDataURL());
    let { depth } = depthResult;
    const depth2D = [];

    for (let y = 0; y < depth.height; y++) {
      // Get the row slice and normalize each element
      const row = depth.data.slice(y * depth.width, (y + 1) * depth.width);
      const normalizedRow = Array.from(row).map((value) => (255 - value) / 255);
      depth2D.push(normalizedRow);
    }

    let result = {
      data: depth2D,
      width: depth.width,
      height: depth.height,
      getDepthAt: (x, y) => {
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        if (xi >= 0 && xi < depth.width && yi >= 0 && yi < depth.height) {
          return depth2D[yi][xi];
        }
        return null;
      },
    };

    // Create ImageData visualization
    result.imageData = createImageDataFromDepthValues(
      depth2D,
      depth.width,
      depth.height,
      0,
      1,
      this.runtimeConfig.colormap
    );

    // Create p5.Image versions
    result.image = generateP5Image(result.imageData);
    result.sourceFrame = generateP5Image(
      this.getSourceFrameCanvas(depth.width, depth.height) // Fix here too
    );

    return result;
  }
}

export default TransformersDepthEstimation;
