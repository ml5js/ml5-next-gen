import { pipeline } from "@huggingface/transformers";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";
import handleOptions from "../utils/handleOptions";
import {
  createImageDataFromDepthValues,
  generateP5Image,
} from "./utils/imageDataUtils";
import { chooseDevice, chooseDtype } from "../utils/transformersUtilities";

/**
 * @typedef {Object} TransformersDepthEstimationRuntimeOptions Estimation runtime options.
 * @property {number} [minDepth=0] - The minimum depth value (0-1) used for fixed normalization. Ignored if `normalizeDynamically` is true.
 * @property {number} [maxDepth=1] - The maximum depth value (0-1) used for fixed normalization. Ignored if `normalizeDynamically` is true.
 * @property {boolean} [normalizeDynamically=false] - If true, calculate min/max depth from each frame for normalization, overriding `minDepth` and `maxDepth`.
 * @property {number} [normalizationSmoothingFactor=0.5] - Smoothing factor (0-1) for dynamic normalization range. Higher values react faster to changes. Only used if `normalizeDynamically` is true.
 * @property {boolean} [flipHorizontal=false] - Whether to flip the input image horizontally. Alias: `flipped`.
 * @property {ColormapName | string} [colormap='GRAYSCALE'] - The colormap for `result.image` output. Options: 'color', 'grayscale'.
 * @property {number | null} [targetFps=null] - Target FPS for continuous estimation (`estimateStart`). If set, skips frames to approximate the target. `null` runs as fast as possible.
 * @property {DeviceName | string} [device='webgpu'] - The backend device to run the model on. Options: 'webgpu' or 'wasm'. Gets passed to transformers.js.
 * @property {string} [dtype] - The data type for the model. Options: 'fp32', 'fp16', 'q8' and 'q4'. Defaults to 'fp16' on webgpu and 'q8' on wasm. Gets passed to transformers.js.
 */

/**
 * @typedef {Object} TransformersDepthEstimationResult The result object from a depth estimation.
 * @property {number[][]} data - Normalized depth map (0-1, 0 is closest) as a 2D array.
 * @property {p5.Image | ImageData} image - p5.Image (if p5 is running, otherwise ImageData) of the depth map with chosen colormap.
 * @property {ImageData} imageData - ImageData visualization (normalized) with chosen colormap.
 * @property {number} width - Width of the depth map.
 * @property {number} height - Height of the depth map.
 * @property {function(number, number): number | null} getDepthAt - Get normalized depth (0-1) at (x, y).
 * @property {p5.Image} sourceFrame - The exact frame used for the depth estimation, as a p5.Image.
 */

/**
 * Maps ml5-friendly model names to their Hugging Face model ids.
 * Add new transformer-based depth estimation models here.
 */
const SUPPORTED_MODELS = {
  DepthAnything: "onnx-community/depth-anything-v2-small",
  DepthAnythingV2Small: "onnx-community/depth-anything-v2-small",
};

/**
 * @class
 * TransformersDepthEstimation class using the transformers.js depth-anything-v2-small model.
 */
class TransformersDepthEstimation {
  /**
   * Initializes the TransformersDepthEstimation class.
   * @param {TransformersDepthEstimationRuntimeOptions} [options] - Model loading and runtime options.
   * @param {function} [callback] - Callback when model is loaded.
   */
  constructor(modelName, options, callback) {
    this.modelName = modelName;
    this.hfModelId = SUPPORTED_MODELS[modelName];
    if (!this.hfModelId) {
      throw new Error(
        `Unknown transformer model "${modelName}". Options: ${Object.keys(
          SUPPORTED_MODELS
        ).join(", ")}`
      );
    }
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
    this.smoothedMinDepth = null; // For dynamic normalization smoothing
    this.smoothedMaxDepth = null; // For dynamic normalization smoothing

    this.maskWarned = false; // only used for the temporary warning message

    this.ready = callCallback(this.loadModel(), callback);
  }

  /** Loads and sets up the depth model pipeline and our internal configurations. @private */
  async loadModel() {
    this.runtimeConfig = handleOptions(
      this.config,
      {
        minDepth: { type: "number", min: 0, max: 1, default: 0 },
        maxDepth: { type: "number", min: 0, max: 1, default: 1 },
        normalizeDynamically: { type: "boolean", default: false }, // If true, min/maxDepth are ignored and calculated dynamically per frame.
        normalizationSmoothingFactor: {
          type: "number",
          min: 0,
          max: 1,
          default: 0.5,
        }, // Smoothing for dynamic normalization.
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
          enums: ["webgpu", "wasm"],
          default: chooseDevice,
        },
        dtype: {
          type: "enum",
          enums: ["fp32", "fp16", "q8", "q4"],
          default: chooseDtype,
        },
      },
      "depthEstimation (runtime)"
    );

    // Notify which model is being loaded and the selected device and dtype.
    console.log(
      `ml5.depthEstimation: loading "${this.modelName}" → Hugging Face model "${this.hfModelId}", with device "${this.runtimeConfig.device}" and dtype "${this.runtimeConfig.dtype}"`
    );

    // Warn if the fixed normalization range is inverted
    if (
      !this.runtimeConfig.normalizeDynamically &&
      this.runtimeConfig.minDepth >= this.runtimeConfig.maxDepth
    ) {
      console.warn(
        `🟪ml5.js warns: The "minDepth" option for depthEstimation (received ${this.runtimeConfig.minDepth}) should be smaller than "maxDepth" (received ${this.runtimeConfig.maxDepth}). ml5.js is using the default values of 0 and 1 instead.`
      );
      this.runtimeConfig.minDepth = 0;
      this.runtimeConfig.maxDepth = 1;
    }

    // Load the model
    this.model = await pipeline(
      "depth-estimation", // Model task
      this.hfModelId, // Model ID
      {
        ...this.config, // Pass thru any other options set for transformers.js
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

      // We need to make the first call to this canvas's context sets willReadFrequently to true
      // This yields better performance when reading pixel data from the canvas frequently,
      // since it keeps the canvas in CPU instead of GPU.
      // More information here: https://stackoverflow.com/questions/74101155/chrome-warning-willreadfrequently-attribute-set-to-true
      this.sourceFrameCanvas.getContext("2d", { willReadFrequently: true });
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
    const { image, callback } = argumentObject;

    await this.ready;
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
    const { image, callback } = argumentObject;

    this.detectMedia = image;
    this.detectCallback = callback;

    // Reset smoothing if dynamic normalization is enabled and we restart
    if (this.runtimeConfig.normalizeDynamically) {
      this.smoothedMinDepth = null;
      this.smoothedMaxDepth = null;
    }

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
    await this.ready;
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

    // Run the model on the canvas
    let depthResult = await this.model(ctx.canvas);

    // Raw float depth values from the model (larger values are closer to the camera)
    const { predicted_depth } = depthResult; // This is the raw data output from the model, before transformers does its own normalization which results in the 'depth' property.
    const [height, width] = predicted_depth.dims; // Dimensions of the depth map, which match the input image dimensions
    const rawData = predicted_depth.data; // Float32Array of raw depth values, one per pixel, greater or equal to 0.

    // Find this frame's raw min and max
    let frameMin = Infinity;
    let frameMax = -Infinity;
    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i] < frameMin) frameMin = rawData[i];
      if (rawData[i] > frameMax) frameMax = rawData[i];
    }

    // By default, stretch using this frame's own min and max
    let stretchMin = frameMin;
    let stretchMax = frameMax;

    // Dynamic Normalization: smooth the min/max across frames
    if (this.runtimeConfig.normalizeDynamically) {
      const factor = this.runtimeConfig.normalizationSmoothingFactor;
      if (this.smoothedMinDepth === null || this.smoothedMaxDepth === null) {
        this.smoothedMinDepth = frameMin;
        this.smoothedMaxDepth = frameMax;
      } else {
        this.smoothedMinDepth =
          frameMin * factor + this.smoothedMinDepth * (1 - factor);
        this.smoothedMaxDepth =
          frameMax * factor + this.smoothedMaxDepth * (1 - factor);
      }
      stretchMin = this.smoothedMinDepth;
      stretchMax = this.smoothedMaxDepth;
    }

    // The crop to apply after stretching (only for fixed mode, this uses the minDepth and maxDepth set in options)
    let cropMin = 0;
    let cropMax = 1;
    if (!this.runtimeConfig.normalizeDynamically) {
      cropMin = this.runtimeConfig.minDepth;
      cropMax = this.runtimeConfig.maxDepth;
    }

    const stretchRange = stretchMax - stretchMin;
    const cropRange = cropMax - cropMin;

    // Normalization step: build the 2D depth array
    const depth2D = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const rawValue = rawData[y * width + x];
        let value = 0;

        // Map raw values by stretchMin and stretchMax to 0-1, inverted so 0 is closest and 1 is farthest
        if (stretchRange > 0) {
          value = (stretchMax - rawValue) / stretchRange;
        }

        // Apply the crop: cropMin moves to 0, cropMax moves to 1
        if (cropRange > 0) {
          value = (value - cropMin) / cropRange;
        } else {
          value = 0;
        }

        // Clip anything outside the 0-1 range
        value = Math.min(1, Math.max(0, value));

        row.push(value);
      }
      depth2D.push(row);
    }

    let result = {
      data: depth2D,
      width: width,
      height: height,
      getDepthAt: (x, y) => {
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        if (xi >= 0 && xi < width && yi >= 0 && yi < height) {
          return depth2D[yi][xi];
        }
        return null;
      },
    };

    // Create ImageData visualization
    result.imageData = createImageDataFromDepthValues(
      depth2D,
      width,
      height,
      0,
      1,
      this.runtimeConfig.colormap
    );

    // Create p5.Image versions
    result.image = generateP5Image(result.imageData);
    result.sourceFrame = generateP5Image(
      this.getSourceFrameCanvas(width, height)
    );

    // Error message
    /* 
     * This is a placeholder for a more robust way to handle these friendly error messages.
     *
     * Ideally, we should have a utility that creates a Proxy with a get trap that checks 
     * what the user tried to get from an object and, if it is an undefined property, log
     * a message explaining this. The utility could then be reused across all models.
     * 
     * When removing, don't forget to get rid of the "maskWarned" property in the constructor
     */
    Object.defineProperty(result, "mask", {
      get: () => {
        if(!this.maskWarned) {
          this.maskWarned = true;
        }else {
          return undefined;
        }
        console.warn(
          "🟪ml5.js warns: The 'mask' property is not available for transformers depth estimation models. Masks in depth estimation are only available in the ARPortraitDepth model."
        );
        return undefined;
      },
      enumerable: false,
    });


    return result;
  }
}

export default TransformersDepthEstimation;
