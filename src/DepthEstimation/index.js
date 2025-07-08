// Copyright (c) 2019-2025 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 * DepthEstimation: Real-time Depth Estimation in the Browser
 * Ported and integrated from all the hard work by: https://github.com/tensorflow/tfjs-models/tree/master/depth-estimation
 */

import * as tf from "@tensorflow/tfjs";
import * as tfDepthEstimation from "@tensorflow-models/depth-estimation";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import { mediaReady } from "../utils/imageUtilities";
import handleOptions from "../utils/handleOptions";
import { handleModelName } from "../utils/handleOptions";

/**
 * @typedef {'COLOR' | 'GRAYSCALE'} ColormapName
 */

/**
 * @typedef {function(number): [number, number, number]} ColormapFunction
 * A function that takes a normalized value (0-1) and returns an [R, G, B] array (0-255).
 */

/**
 * @type {Object.<ColormapName, ColormapFunction>}
 * A collection of colormap functions for visualizing depth data.
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
    const v = Math.round(value * 255);
    return [v, v, v];
  },
};

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
 */

/**
 * @typedef {Object} DepthEstimationResult The result object from a depth estimation.
 * @property {number[][]} data - Raw depth map as a 2D array.
 * @property {p5.Image | ImageData} image - p5.Image (if p5 is running) or ImageData of depth map with chosen colormap.
 * @property {ImageData} imageData - ImageData visualization (normalized) with chosen colormap.
 * @property {number} width - Width of the depth map.
 * @property {number} height - Height of the depth map.
 * @property {number} minDepth - The minimum depth value used for normalization in this result (either fixed or dynamically calculated/smoothed).
 * @property {number} maxDepth - The maximum depth value used for normalization in this result (either fixed or dynamically calculated/smoothed).
 * @property {function(number, number): number | null} getDepthAt - Get raw depth at (x, y).
 * @property {tf.Tensor} tensor - The raw depth tensor (remember to dispose!). Included for advanced use.
 */

/**
 * @class
 * DepthEstimation class using the TensorFlow.js ARPortraitDepth model.
 */
class DepthEstimation {
  /**
   * Initializes the DepthEstimation class.
   * @param {string} [modelName="ARPortraitDepth"] - Model name ("ARPortraitDepth").
   * @param {DepthEstimationOptions & DepthEstimationRuntimeOptions} [options] - Model loading and runtime options.
   * @param {function} [callback] - Callback when model is loaded.
   */
  constructor(modelName, options, callback) {
    this.modelName = handleModelName(
      modelName,
      ["ARPortraitDepth"],
      "ARPortraitDepth",
      "depthEstimation"
    );
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

    this.ready = callCallback(this.loadModels(), callback); // Renamed loadModel -> loadModels
  }

  /** Loads the TFJS models (Depth and optionally Segmentation). @private */
  async loadModels() {
    // Renamed
    // --- Load Depth Model ---
    const pipeline = tfDepthEstimation.SupportedModels.ARPortraitDepth;
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
        maxDepth: { type: "number", min: 0, max: 1, default: 0.9 }, // Default changed from 1
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
        applySegmentationMask: { type: "boolean", default: false },
        segmentationOpacity: { type: "number", min: 0, max: 1, default: 1.0 },
        segmentationMaskBlur: { type: "number", min: 0, default: 0 },
      },
      "depthEstimation (runtime)"
    );

    // Initialize smoothed values based on initial config if dynamic normalization is off
    if (!this.runtimeConfig.normalizeDynamically) {
      this.smoothedMinDepth = this.runtimeConfig.minDepth;
      this.smoothedMaxDepth = this.runtimeConfig.maxDepth;
    }

    await tf.ready();
    this.model = await tfDepthEstimation.createEstimator(pipeline, modelConfig);

    // --- Conditionally Load Segmentation Model ---
    // Load segmentation model immediately if the option is initially true,
    // otherwise, it will be loaded lazily on first use if the option is enabled later.
    if (this.runtimeConfig.applySegmentationMask) {
      await this.loadSegmenter();
    }

    return this;
  }

  /** Loads the body segmentation model if not already loaded. @private */
  async loadSegmenter() {
    if (this.segmenter) return; // Already loaded
    console.log("Loading body segmentation model for masking...");
    try {
      const modelType =
        bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
      // Use 'tfjs' runtime for broader compatibility
      this.segmenter = await bodySegmentation.createSegmenter(modelType, {
        runtime: "tfjs",
      });
      console.log("Body segmentation model loaded.");
    } catch (error) {
      console.error("Failed to load body segmentation model:", error);
      this.segmenter = null; // Ensure it's null on failure
      // Disable the segmentation feature if loading failed to prevent repeated errors
      this.runtimeConfig.applySegmentationMask = false;
      console.warn(
        "Segmentation mask feature disabled due to model loading error."
      );
    }
  }

  /** Creates or returns the reusable canvas for segmentation masking. @private */
  getSegmentationMaskCanvas(width, height) {
    if (
      !this.segmentationMaskCanvas ||
      this.segmentationMaskCanvas.width !== width ||
      this.segmentationMaskCanvas.height !== height
    ) {
      this.segmentationMaskCanvas = document.createElement("canvas");
      this.segmentationMaskCanvas.width = width;
      this.segmentationMaskCanvas.height = height;
      // console.log(`Created/Resized segmentation mask canvas: ${width}x${height}`);
    }
    return this.segmentationMaskCanvas;
  }

  /** Estimates depth from a single input. */
  async estimate(...inputs) {
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "Input image/video/canvas required for estimate()."
    );
    const { image, options = {}, callback } = argumentObject;

    await this.ready; // Ensure model is loaded
    await mediaReady(image, false);

    const currentRuntimeConfig = { ...this.runtimeConfig, ...options };
    let inputForDepth = image; // Default to original image

    // --- Apply Segmentation Mask (if enabled) ---
    if (currentRuntimeConfig.applySegmentationMask) {
      await this.loadSegmenter(); // Ensure segmenter is loaded
      if (this.segmenter) {
        try {
          const segmentation = await this.segmenter.segmentPeople(image);
          if (segmentation && segmentation.length > 0) {
            const foregroundColor = { r: 0, g: 0, b: 0, a: 0 }; // Transparent foreground
            const backgroundColor = { r: 0, g: 0, b: 0, a: 255 }; // Opaque background (will be drawn over)
            // Note: TFJS Body Segmentation `toBinaryMask` might be async
            const backgroundDarkeningMask = await bodySegmentation.toBinaryMask(
              segmentation,
              foregroundColor,
              backgroundColor
            );

            const maskCanvas = this.getSegmentationMaskCanvas(
              image.width,
              image.height
            );
            // Draw the original image, then the mask over it
            await bodySegmentation.drawMask(
              maskCanvas,
              image,
              backgroundDarkeningMask,
              currentRuntimeConfig.segmentationOpacity,
              currentRuntimeConfig.segmentationMaskBlur,
              false // Let estimateDepth handle the flip based on its config
            );
            inputForDepth = maskCanvas; // Use the masked canvas as input

            // Dispose segmentation tensor(s) - crucial!
            if (backgroundDarkeningMask && backgroundDarkeningMask.dispose) {
              backgroundDarkeningMask.dispose();
            } else if (Array.isArray(segmentation)) {
              // Newer versions might return segmentation objects directly
              segmentation.forEach((seg) => {
                if (seg.mask && seg.mask.dispose) seg.mask.dispose(); // Dispose mask if it's a tensor
              });
            }
          } else {
            console.warn(
              "Segmentation did not find people, using original image for depth."
            );
          }
        } catch (segError) {
          console.error("Error during segmentation pre-processing:", segError);
          // Fallback to original image if segmentation fails
          inputForDepth = image;
        }
      } else {
        console.warn(
          "Segmentation requested but model not loaded, using original image."
        );
      }
    }
    // --- End Segmentation Mask ---

    const estimationConfig = {
      minDepth: currentRuntimeConfig.normalizeDynamically
        ? 0
        : currentRuntimeConfig.minDepth,
      maxDepth: currentRuntimeConfig.normalizeDynamically
        ? 1
        : currentRuntimeConfig.maxDepth,
      flipHorizontal: currentRuntimeConfig.flipHorizontal, // Apply flip here
    };

    let depthMapResult;
    let result = null;
    try {
      // Use the potentially masked input
      depthMapResult = await this.model.estimateDepth(
        inputForDepth,
        estimationConfig
      );
      if (depthMapResult) {
        // Pass original sourceElement for dimensions in result, not the maskCanvas
        result = await this.processDepthMap(
          depthMapResult,
          image,
          currentRuntimeConfig
        );
      } else {
        console.warn("Depth estimation returned no result for this input.");
      }
    } catch (error) {
      console.error("Error estimating depth:", error);
      // Cannot dispose depthMapResult here as it's not a tensor.
      // Tensor disposal (if created) is handled within processDepthMap or by the user via result.tensor.
    }

    if (callback) callback(result);
    return result;
  }

  /** Processes the DepthMap result object from the model. @private */
  async processDepthMap(depthMapResult, sourceElement, currentRuntimeConfig) {
    // Renamed parameter
    const result = {};
    let minDepthActual, maxDepthActual;
    let actualTensor; // To hold the actual tensor

    try {
      // Get the actual tensor from the DepthMap object
      actualTensor = await depthMapResult.toTensor();

      // --- Dynamic Normalization ---
      if (currentRuntimeConfig.normalizeDynamically) {
        const [minTensor, maxTensor] = tf.tidy(() => [
          actualTensor.min(), // Use actualTensor here
          actualTensor.max(), // Use actualTensor here
        ]);
        [minDepthActual, maxDepthActual] = await Promise.all([
          minTensor.data(),
          maxTensor.data(),
        ]);
        minTensor.dispose(); // Dispose intermediate tensors
        maxTensor.dispose(); // Dispose intermediate tensors
        minDepthActual = minDepthActual[0]; // Extract scalar value
        maxDepthActual = maxDepthActual[0]; // Extract scalar value

        // Initialize or smooth the min/max values
        const factor = currentRuntimeConfig.normalizationSmoothingFactor;
        if (this.smoothedMinDepth === null || this.smoothedMaxDepth === null) {
          this.smoothedMinDepth = minDepthActual;
          this.smoothedMaxDepth = maxDepthActual;
        } else {
          this.smoothedMinDepth =
            minDepthActual * factor + this.smoothedMinDepth * (1 - factor);
          this.smoothedMaxDepth =
            maxDepthActual * factor + this.smoothedMaxDepth * (1 - factor);
        }
        result.minDepth = this.smoothedMinDepth;
        result.maxDepth = this.smoothedMaxDepth;
      } else {
        // Use fixed config values
        result.minDepth = currentRuntimeConfig.minDepth;
        result.maxDepth = currentRuntimeConfig.maxDepth;
      }
      // --- End Dynamic Normalization ---

      // Get depth values as 2D array from the actual tensor
      const depthData = await actualTensor.array(); // Use actualTensor here

      const width = sourceElement.width;
      const height = sourceElement.height;

      result.data = depthData;
      result.tensor = actualTensor; // Provide actual tensor for advanced use (user must dispose)

      // Create an ImageData using the determined min/max range
      result.imageData = this.createImageDataFromDepthValues(
        depthData,
        width,
        height,
        result.minDepth,
        result.maxDepth,
        currentRuntimeConfig.colormap
      );

      // --- Apply Black Background using Segmentation Mask (if enabled) ---
      if (currentRuntimeConfig.applySegmentationMask && this.segmenter) {
        try {
          // Run segmentation on the *original* source element to get the mask
          const segmentation = await this.segmenter.segmentPeople(
            sourceElement
          );
          if (segmentation && segmentation.length > 0) {
            // Create a mask where background is opaque (alpha=255), foreground is transparent (alpha=0)
            const foregroundColor = { r: 0, g: 0, b: 0, a: 0 };
            const backgroundColor = { r: 0, g: 0, b: 0, a: 255 };
            // Note: TFJS Body Segmentation `toBinaryMask` might be async
            let binaryMask = await bodySegmentation.toBinaryMask(
              // Use let
              segmentation,
              foregroundColor,
              backgroundColor
            );

            // If the input was flipped for depth estimation, flip the mask too
            // so it aligns with the visualization derived from the (potentially flipped) depth map.
            if (currentRuntimeConfig.flipHorizontal) {
              binaryMask = this._flipImageDataHorizontally(binaryMask);
            }

            const vizData = result.imageData.data; //this is a reference to the ImageData data array. Changes to this also change imageData
            const maskData = binaryMask.data; // Use potentially flipped mask data

            // Iterate through the imageData pixels and mask with the segmentation result
            for (let i = 0; i < vizData.length; i += 4) {
              // Check the alpha channel of the mask (index i + 3)
              // If mask alpha is 255, it's a background pixel
              if (maskData[i + 3] === 255) {
                vizData[i] = 0; // Set Red to 0 (black)
                vizData[i + 1] = 0; // Set Green to 0 (black)
                vizData[i + 2] = 0; // Set Blue to 0 (black)
                // vizData[i + 3] remains 255 (opaque)
              }
            }

            // Dispose segmentation tensor(s) from this specific operation
            if (binaryMask && binaryMask.dispose) {
              // binaryMask itself is ImageData, check if segmentation has tensor
              // Newer versions might return segmentation objects directly
              if (Array.isArray(segmentation)) {
                segmentation.forEach((seg) => {
                  if (seg.mask && seg.mask.dispose) seg.mask.dispose(); // Dispose mask if it's a tensor
                });
              }
            }
          }
          // No else needed, if no people found, visualization remains unchanged
        } catch (segError) {
          console.error(
            "Error applying segmentation mask to visualization:",
            segError
          );
        }
      }
      // --- End Apply Black Background ---

      //Make the p5.Image version of the depth image
      result.image = this.generateP5Image(result.imageData);

      result.width = width;
      result.height = height;

      result.getDepthAt = (x, y) => {
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        if (xi >= 0 && xi < width && yi >= 0 && yi < height) {
          return depthData[yi][xi];
        }
        return null;
      };

      return result;
    } catch (error) {
      console.error("Error processing depth map:", error);
      if (actualTensor) actualTensor.dispose(); // Dispose tensor if created before error
      throw error; // Re-throw error to be caught by estimate/detectLoop
    }
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
    // Conditionally load segmenter if needed for the loop
    if (this.runtimeConfig.applySegmentationMask && !this.segmenter) {
      // Start loading, but don't await here, detectLoop will await ready
      this.loadSegmenter();
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
    // Await main model readiness
    await this.ready;
    // If segmentation is enabled, also await segmenter readiness
    if (this.runtimeConfig.applySegmentationMask) {
      await this.loadSegmenter(); // Ensures segmenter is loaded before loop continues
    }
    await mediaReady(this.detectMedia, false);

    while (!this.signalStop) {
      const startTime = performance.now();
      // --- FPS Control ---
      if (this.runtimeConfig.targetFps) {
        const elapsed = startTime - this.lastFrameTime;
        const minInterval = 1000 / this.runtimeConfig.targetFps;
        if (elapsed < minInterval) {
          await tf.nextFrame(); // Yield to prevent busy-waiting
          continue; // Skip this frame
        }
        // Adjust lastFrameTime, considering potential overshoot
        this.lastFrameTime = startTime - (elapsed % minInterval);
      } else {
        this.lastFrameTime = startTime; // No FPS limit, just update time
      }
      // --- End FPS Control ---

      let inputForDepth = this.detectMedia;
      // --- Apply Segmentation Mask (if enabled) ---
      if (this.runtimeConfig.applySegmentationMask && this.segmenter) {
        try {
          const segmentation = await this.segmenter.segmentPeople(
            this.detectMedia
          );
          if (segmentation && segmentation.length > 0) {
            const foregroundColor = { r: 0, g: 0, b: 0, a: 0 };
            const backgroundColor = { r: 0, g: 0, b: 0, a: 255 };
            const backgroundDarkeningMask = await bodySegmentation.toBinaryMask(
              segmentation,
              foregroundColor,
              backgroundColor
            );
            const maskCanvas = this.getSegmentationMaskCanvas(
              this.detectMedia.width,
              this.detectMedia.height
            );
            await bodySegmentation.drawMask(
              maskCanvas,
              this.detectMedia,
              backgroundDarkeningMask,
              this.runtimeConfig.segmentationOpacity,
              this.runtimeConfig.segmentationMaskBlur,
              false // Let estimateDepth handle the flip based on its config
            );
            inputForDepth = maskCanvas;
            // Dispose segmentation tensor(s)
            if (backgroundDarkeningMask && backgroundDarkeningMask.dispose) {
              backgroundDarkeningMask.dispose();
            } else if (Array.isArray(segmentation)) {
              segmentation.forEach((seg) => {
                if (seg.mask && seg.mask.dispose) seg.mask.dispose();
              });
            }
          }
          // No else needed, inputForDepth remains original media if no people found
        } catch (segError) {
          console.error(
            "Error during continuous segmentation pre-processing:",
            segError
          );
          // Fallback to original media
          inputForDepth = this.detectMedia;
        }
      }
      // --- End Segmentation Mask ---

      const estimationConfig = {
        minDepth: this.runtimeConfig.normalizeDynamically
          ? 0
          : this.runtimeConfig.minDepth,
        maxDepth: this.runtimeConfig.normalizeDynamically
          ? 1
          : this.runtimeConfig.maxDepth,
        flipHorizontal: this.runtimeConfig.flipHorizontal,
      };
      let depthMapResult;
      let result = null;
      try {
        depthMapResult = await this.model.estimateDepth(
          inputForDepth,
          estimationConfig
        );
        if (depthMapResult) {
          // Pass original detectMedia for dimensions
          result = await this.processDepthMap(
            depthMapResult,
            this.detectMedia,
            this.runtimeConfig
          );
        } else {
          console.warn("Depth estimation returned no result for this frame.");
          await tf.nextFrame();
          continue;
        }
      } catch (error) {
        console.error("Error during continuous depth estimation:", error);
        // Cannot dispose depthMapResult. Tensor disposal handled in processDepthMap or by user.
        await tf.nextFrame();
        continue;
      }

      if (result) {
        this.detectCallback(result);
      }
      await tf.nextFrame(); // Yield after processing
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

  /** Flips ImageData horizontally. @private */
  _flipImageDataHorizontally(imageData) {
    const { width, height, data } = imageData;
    const newData = new Uint8ClampedArray(data.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sourceIndex = (y * width + x) * 4;
        const targetIndex = (y * width + (width - 1 - x)) * 4;
        newData[targetIndex] = data[sourceIndex]; // R
        newData[targetIndex + 1] = data[sourceIndex + 1]; // G
        newData[targetIndex + 2] = data[sourceIndex + 2]; // B
        newData[targetIndex + 3] = data[sourceIndex + 3]; // A
      }
    }
    return new ImageData(newData, width, height);
  }

  /** Converts ImageData to p5.Image if p5 exists. @private */
  generateP5Image(imageData) {
    if (window?.p5) {
      // Ensure p5 instance mode compatibility
      const p5Instance = window._p5Instance || window;
      if (p5Instance.createImage) {
        const img = p5Instance.createImage(imageData.width, imageData.height);
        // Use img.set() for robustness, letting p5 handle density internally
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            // Calculate index for the source imageData.data array
            const idx = (y * imageData.width + x) * 4;
            // Extract RGBA values
            const r = imageData.data[idx + 0];
            const g = imageData.data[idx + 1];
            const b = imageData.data[idx + 2];
            const a = imageData.data[idx + 3];
            // Create a p5 color object
            const c = p5Instance.color(r, g, b, a);
            // Set the pixel in the p5.Image using logical coordinates
            img.set(x, y, c);
          }
        }
        // Update pixels is still needed after using set() multiple times
        img.updatePixels();
        return img;
      }
    }
    return imageData; // Return original ImageData if p5 or createImage not available
  }
}

/**
 * Creates a new DepthEstimation instance.
 * @param {string} [modelName="ARPortraitDepth"] - Model name.
 * @param {DepthEstimationOptions & DepthEstimationRuntimeOptions} [options] - Options.
 * @param {function(): void} [callback] - Callback when loaded.
 * @returns {DepthEstimation} A new depthEstimation instance.
 */
const depthEstimation = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  const instance = new DepthEstimation(string, options, callback);
  return instance;
};

export default depthEstimation;
