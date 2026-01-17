import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";
import handleOptions from "../utils/handleOptions";
import { loadTransformersFromCDN } from "../utils/transformersLoader";

/**
 * @typedef {Object} DepthEstimationOptions Model loading options.
 * @property {string} [segmentationModelUrl] - Optional URL to a custom segmentation model. Alias: `modelUrl`.
 * @property {string} [depthModelUrl] - Optional URL to a custom depth estimation model.
 */

/**
 * @typedef {Object} DepthEstimationRuntimeOptions Estimation runtime options.
 * @property {number} [minDepth=0] - The minimum depth value (0-1) used for fixed normalization. Ignored if `normalizeDynamically` is true.
 * @property {number} [maxDepth=1] - The maximum depth value (0-1) used for fixed normalization. Ignored if `normalizeDynamically` is true.
 * @property {boolean} [normalizeDynamically=false] - If true, calculate min/max depth from each frame for normalization, overriding `minDepth` and `maxDepth`.
 * @property {number} [normalizationSmoothingFactor=0.5] - Smoothing factor (0-1) for dynamic normalization range. Higher values react faster to changes. Only used if `normalizeDynamically` is true.
 * @property {boolean} [flipHorizontal=false] - Whether to flip the input image horizontally. Alias: `flipped`.
 * @property {ColormapName | string} [colormap='GRAYSCALE'] - The colormap for `result.image` output. Options: 'color', 'grayscale'.
 * @property {number | null} [targetFps=null] - Target FPS for continuous estimation (`estimateStart`). If set, skips frames to approximate the target. `null` runs as fast as possible.
 * @property {boolean} [applySegmentationMask=false] - If true, applies a body segmentation mask to the input before depth estimation. May improve focus on foreground subjects but adds overhead.
 * @property {number} [segmentationOpacity=1.0] - Opacity of the background mask when `applySegmentationMask` is true.
 * @property {number} [segmentationMaskBlur=0] - Blur radius for the segmentation mask edge when `applySegmentationMask` is true.
 * @property {number} [dilationFactor=4] - How many pixels to dilate the segmentation mask. 0 to 10, as the greater the number, the more loops necessary, slowing down execution.
 */

/**
 * @typedef {Object} DepthEstimationResult The result object from a depth estimation.
 * @property {number[][]} data - Raw depth map as a 2D array.
 * @property {p5.Image | ImageData} image - p5.Image (if p5 is running, otherwise ImageData) of the depth map with chosen colormap.
 * @property {ImageData} imageData - ImageData visualization (normalized) with chosen colormap.
 * @property {number} width - Width of the depth map.
 * @property {number} height - Height of the depth map.
 * @property {number} minDepth - The minimum depth value used for normalization in this result (either fixed or dynamically calculated/smoothed).
 * @property {number} maxDepth - The maximum depth value used for normalization in this result (either fixed or dynamically calculated/smoothed).
 * @property {function(number, number): number | null} getDepthAt - Get raw depth at (x, y).
 * @property {p5.Image | ImageData} mask - The segmentation mask applied to the depth map, including any dilation applied.
 * @property {p5.Image} sourceFrame - The exact frame used for the depth estimation, as a p5.Image.
 */

const COLORMAPS = {
  /** Color colormap: yellow (close) -> green -> cyan -> blue -> purple (far). */
  COLOR: (value) => {
    let r = 0,
      g = 0,
      b = 0;
    const v = Math.max(0, Math.min(1, value)); // Clamp value to [0, 1]

    if (v < 0.25) {
      // Yellow (1,1,0) -> Green (0,1,0)
      const t = v * 4; // t goes from 0 to 1
      r = 1 - t;
      g = 1;
      b = 0;
    } else if (v < 0.5) {
      // Green (0,1,0) -> Cyan (0,1,1)
      const t = (v - 0.25) * 4; // t goes from 0 to 1
      r = 0;
      g = 1;
      b = t;
    } else if (v < 0.75) {
      // Cyan (0,1,1) -> Blue (0,0,1)
      const t = (v - 0.5) * 4; // t goes from 0 to 1
      r = 0;
      g = 1 - t;
      b = 1;
    } else {
      // Blue (0,0,1) -> Purple (0.5, 0, 1)
      const t = (v - 0.75) * 4; // t goes from 0 to 1
      r = t * 0.5; // Increase red towards purple
      g = 0;
      b = 1;
    }
    // Scale to 0-255
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  },
  /** Grayscale colormap: black to white. */
  GRAYSCALE: (value) => {
    const v = 255 - Math.round(value * 255);
    return [v, v, v];
  },
};

/**
 * @class
 * DepthEstimation class using the TensorFlow.js ARPortraitDepth model.
 */
class TransformersDepthEstimation {
  /**
   * Initializes the DepthEstimation class.
   * @param {DepthEstimationOptions & DepthEstimationRuntimeOptions} [options] - Model loading and runtime options.
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
    this.smoothedMinDepth = null; // For dynamic normalization smoothing
    this.smoothedMaxDepth = null; // For dynamic normalization smoothing
    this.segmenter = null; // Added: To store the body segmenter
    this.segmentationMaskCanvas = null; // Added: Reusable canvas for masking
    this.sourceFrameCanvas = null; // Store the exact frame used in estimationß

    this.ready = callCallback(this.loadModels(), callback); // Renamed loadModel -> loadModels
  }

  /** Loads the TFJS models (Depth and optionally Segmentation). @private */
  async loadModels() {
    let pipeline;
    const modelConfig = handleOptions(
      this.config,
      {
        segmentationModelUrl: {
          type: "string",
          default: undefined,
          alias: "modelUrl",
        },
        depthModelUrl: { type: "string", default: undefined },
      },
      "depthEstimation (model loading)"
    );
    this.runtimeConfig = handleOptions(
      this.config,
      {
        minDepth: { type: "number", min: 0, max: 1, default: 0.2 }, // Default changed from 0
        maxDepth: { type: "number", min: 0, max: 1, default: 0.75 }, // Default changed from 1
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
        applySegmentationMask: { type: "boolean", default: true },
        segmentationOpacity: { type: "number", min: 0, max: 1, default: 1.0 },
        segmentationMaskBlur: { type: "number", min: 0, default: 0 },
        dilationFactor: { type: "number", min: 0, max: 10, default: 4 }, // How many pixels to dilate the segmentation mask
      },
      "depthEstimation (runtime)"
    );

    this.config.applySegmentationMask = false;

    // Ensure transformers loader is available
    await loadTransformersFromCDN();

    // Call the global loadTransformers function
    pipeline = await window.loadTransformers();
    this.model = await pipeline(
      "depth-estimation", // Model task
      "onnx-community/depth-anything-v2-small",
      {
        device: "webgpu", //'webgpu', 'webgl', 'cpu', 'wasm'
        //webgpu should be the first try, its the newest method
        dtype: "fp16", //Precision of floats, how many decimal places.
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

  /** Creates ImageData from depth values. @private */
  createImageDataFromDepthValues(
    depthValues,
    width,
    height,
    minDepth,
    maxDepth,
    colormap = "GRAYSCALE"
  ) {
    const imageData = new ImageData(width, height);
    const range = maxDepth - minDepth;
    const colormapKey = colormap.toUpperCase();
    const colormapFn = COLORMAPS[colormapKey] || COLORMAPS.GRAYSCALE;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const depthValue = depthValues[y][x];
        const normalizedValue =
          range === 0
            ? 0
            : Math.max(0, Math.min(1, (depthValue - minDepth) / range));
        const pixelIndex = (y * width + x) * 4;
        const [r, g, b] = colormapFn(normalizedValue);
        imageData.data[pixelIndex] = r;
        imageData.data[pixelIndex + 1] = g;
        imageData.data[pixelIndex + 2] = b;
        imageData.data[pixelIndex + 3] = 255; // Alpha
      }
    }
    return imageData;
  }

  /** Converts ImageData or Canvas to p5.Image if p5 exists. @private */
  generateP5Image(inputImage) {
    if (window?.p5) {
      // Ensure p5 instance mode compatibility
      const p5Instance = window._p5Instance || window;
      if (p5Instance.createImage) {
        const img = p5Instance.createImage(inputImage.width, inputImage.height);
        if (inputImage instanceof ImageData) {
          img.loadPixels(); // Load pixels to prepare for setting
          img.pixels.set(inputImage.data); // Bulk copy pixel data
          img.updatePixels(); // Update pixels to apply changes
        } else if (inputImage instanceof HTMLCanvasElement) {
          // If inputImage is an HTMLCanvasElement, we can use it directly
          img.drawingContext.drawImage(inputImage, 0, 0);
        }
        return img;
      }
    }
    return inputImage; // Return original ImageData/Canvas if p5 or createImage not available
  }

  /** Dilates a mask by a certain number of edge pixels. It also inverts it, so that the silouette is opaque and the background transparent @private */
  dilateMask(imageData, dilationFactor) {
    if (!imageData || !imageData.data) {
      return imageData; // No dilation if no data
    }

    const { width, height, data } = imageData;
    const newData = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let index = (y * width + x) * 4;

        newData[index] = 0; // R
        newData[index + 1] = 0; // G
        newData[index + 2] = 0; // B
        newData[index + 3] = 255 - imageData.data[index + 3]; // Alpha from received mask, inverted

        // If this pixel has alpha = 0 (foreground pixel), check if it should become 255 (background)
        if (imageData.data[index + 3] === 0) {
          let dilated = false;

          // Check within the threshold radius
          for (
            let dy = -dilationFactor;
            dy <= dilationFactor && !dilated;
            dy++
          ) {
            for (
              let dx = -dilationFactor;
              dx <= dilationFactor && !dilated;
              dx++
            ) {
              let checkX = x + dx;
              let checkY = y + dy;

              // Make sure we're within bounds
              if (
                checkX >= 0 &&
                checkX < width &&
                checkY >= 0 &&
                checkY < height
              ) {
                let checkIndex = (checkY * width + checkX) * 4;

                // If we find a neighboring pixel with alpha = 255, grow background into this pixel
                if (imageData.data[checkIndex + 3] === 255) {
                  newData[index + 3] = 0; // Set alpha to 0 (background, because we inverted it, normally 255 is background)
                  dilated = true;
                }
              }
            }
          }
        }
      }
    }

    return new ImageData(newData, width, height);
  }

  async getDepthResult(image) {
    //Save a snapshot of the current frame onto our sourceFrameCanvas
    const ctx = this.getSourceFrameCanvas(image.width, image.height).getContext(
      "2d"
    );
    ctx.clearRect(0, 0, image.width, image.height);
    ctx.drawImage(image, 0, 0, image.width, image.height);

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
      minDepth: 0,
      maxDepth: 1,
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
    result.imageData = this.createImageDataFromDepthValues(
      depth2D,
      depth.width, // Use depth.width
      depth.height, // Use depth.height
      result.minDepth,
      result.maxDepth,
      this.runtimeConfig.colormap
    );

    // Create p5.Image versions
    result.image = this.generateP5Image(result.imageData);
    result.sourceFrame = this.generateP5Image(
      this.getSourceFrameCanvas(depth.width, depth.height) // Fix here too
    );
    result.mask = null; // No segmentation for this model

    return result;
  }
}

export default TransformersDepthEstimation;
