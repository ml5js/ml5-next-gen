// Copyright (c) 2019-2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 * DepthEstimation: Real-time Depth Estimation in the Browser
 * Ported and integrated from all the hard work by: https://github.com/tensorflow/tfjs-models/tree/master/depth-estimation
 */

import * as tf from "@tensorflow/tfjs";
import * as tfDepthEstimation from "@tensorflow-models/depth-estimation";
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
 * Each function maps a normalized depth value (0 to 1) to an RGB color array (0 to 255).
 */
/**
 * Returns a pair of transform from an interval to another interval.
 * @param {number} fromMin - min of the start interval.
 * @param {number} fromMax - max of the start interval.
 * @param {number} toMin - min of the ending interval.
 * @param {number} toMax - max of the ending interval.
 */
const COLORMAPS = {
  /**
   * Color colormap (formerly Jet): blue -> cyan -> yellow -> red.
   * Commonly used but can sometimes distort perception of detail.
   * @param {number} value - Normalized depth value (0-1).
   * @returns {[number, number, number]} RGB color array.
   */
  COLOR: (value) => {
    // value should be between 0 and 1
    let r, g, b;
    if (value < 0.125) {
      r = 0;
      g = 0;
      b = 0.5 + value * 4;
    } else if (value < 0.375) {
      r = 0;
      g = (value - 0.125) * 4;
      b = 1;
    } else if (value < 0.625) {
      r = (value - 0.375) * 4;
      g = 1;
      b = 1 - (value - 0.375) * 4;
    } else if (value < 0.875) {
      r = 1;
      g = 1 - (value - 0.625) * 4;
      b = 0;
    } else {
      r = 1 - (value - 0.875) * 4;
      g = 0;
      b = 0;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  },
  /**
   * Grayscale colormap: black to white.
   * Simple linear mapping.
   * @param {number} value - Normalized depth value (0-1).
   * @returns {[number, number, number]} RGB color array.
   */
  GRAYSCALE: (value) => {
    const v = Math.round(value * 255);
    return [v, v, v];
  }
};

/**
 * @typedef {Object} DepthEstimationOptions Model loading options.
 * @property {string} [segmentationModelUrl] - Optional URL to a custom segmentation model (part of ARPortraitDepth). Alias: `modelUrl`.
 * @property {string} [depthModelUrl] - Optional URL to a custom depth estimation model (part of ARPortraitDepth).
 */

/**
 * @typedef {Object} DepthEstimationRuntimeOptions Estimation runtime options.
 * @property {number} [minDepth=0] - The minimum depth value (0-1) used for normalization in visualization. Values below this are clamped.
 * @property {number} [maxDepth=1] - The maximum depth value (0-1) used for normalization in visualization. Values above this are clamped.
 * @property {boolean} [flipHorizontal=false] - Whether to flip the input image horizontally before estimation. Useful for webcam feeds. Alias: `flipped`.
 * @property {ColormapName | string} [colormap='COLOR'] - The name of the colormap to use for the `visualization` and `visualizationImage` outputs. Case-insensitive. Options: 'color', 'grayscale'.
 */

/**
 * @typedef {Object} DepthEstimationResult The result object from a depth estimation.
 * @property {number[][]} data - A 2D array representing the raw depth map. Values typically range from 0 to 1, but depend on the model and scene. Higher values usually mean further away.
 * @property {ImageData} depthMap - An ImageData object representing the depth map in grayscale (black=near, white=far, normalized by min/maxDepth).
 * @property {ImageData} visualization - An ImageData object representing the depth map visualized with the selected colormap (normalized by min/maxDepth).
 * @property {p5.Image | ImageData} depthMapImage - A p5.Image object (if p5 is available) of the grayscale depth map, otherwise the ImageData object.
 * @property {p5.Image | ImageData} visualizationImage - A p5.Image object (if p5 is available) of the colormapped visualization, otherwise the ImageData object.
 * @property {number} width - The width of the depth map.
 * @property {number} height - The height of the depth map.
 * @property {number} minDepth - The minimum depth value used for normalization during processing.
 * @property {number} maxDepth - The maximum depth value used for normalization during processing.
 * @property {function(number, number): number | null} getDepthAt - A function to get the raw depth value at a specific (x, y) coordinate. Returns `null` if coordinates are out of bounds. Coordinates are relative to the depth map dimensions.
 */

/**
 * @class
 * DepthEstimation class using the TensorFlow.js ARPortraitDepth model.
 * Estimates depth from a single image.
 *
 * @example
 * ```javascript
 * let depthEstimator;
 * let video;
 * let depthResult;
 *
 * function preload() {
 *   depthEstimator = ml5.depthEstimation({ colormap: 'viridis' });
 * }
 *
 * function setup() {
 *   createCanvas(640, 480);
 *   video = createCapture(VIDEO);
 *   video.size(width, height);
 *   video.hide();
 *
 *   // Estimate depth on the video feed continuously
 *   depthEstimator.estimateStart(video, gotDepth);
 * }
 *
 * function gotDepth(result) {
 *   depthResult = result;
 * }
 *
 * function draw() {
 *   background(0);
 *   if (depthResult) {
 *     image(depthResult.visualizationImage, 0, 0, width, height);
 *
 *     // Get depth at mouse position
 *     let d = depthResult.getDepthAt(mouseX, mouseY);
 *     if (d !== null) {
 *       fill(255);
 *       noStroke();
 *       text(`Depth: ${nf(d, 1, 3)}`, mouseX + 10, mouseY + 10);
 *     }
 *   }
 * }
 * ```
 */
class DepthEstimation {
  /**
   * Initializes the DepthEstimation class.
   * @param {string} [modelName="ARPortraitDepth"] - The name of the model to use. Currently only "ARPortraitDepth" is supported.
   * @param {DepthEstimationOptions & DepthEstimationRuntimeOptions} [options] - An object containing options for model loading and runtime estimation.
   * @param {function} [callback] - A callback function called when the model is loaded and ready.
   */
  constructor(modelName, options, callback) {
    this.modelName = handleModelName(
      modelName,
      ["ARPortraitDepth"],
      "ARPortraitDepth",
      "depthEstimation"
    );
    this.model = null;
    this.config = options;
    this.runtimeConfig = {};
    this.detectMedia = null;
    this.detectCallback = null;
    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Loads the underlying TensorFlow.js model.
   * @private
   * @async
   * @returns {Promise<this>} The DepthEstimation instance, once the model is loaded.
   */
  async loadModel() {
    let pipeline;
    let modelConfig;

    pipeline = tfDepthEstimation.SupportedModels.ARPortraitDepth;
    modelConfig = handleOptions(
      this.config,
      {
        segmentationModelUrl: {
          type: "string",
          default: undefined,
          alias: "modelUrl"
        },
        depthModelUrl: {
          type: "string",
          default: undefined
        }
      },
      "depthEstimation"
    );

    this.runtimeConfig = handleOptions(
      this.config,
      {
        minDepth: {
          type: "number",
          min: 0,
          max: 1,
          default: 0,
        },
        maxDepth: {
          type: "number",
          min: 0,
          max: 1,
          default: 1,
        },
        flipHorizontal: {
          type: "boolean",
          alias: "flipped",
          default: false,
        },
        colormap: {
          type: "enum",
          enums: ["color", "grayscale"],
          default: "COLOR", // Default to the renamed 'COLOR' map
          transform: (value) => value.toUpperCase()
        }
      },
      "depthEstimation"
    );

    await tf.ready();
    this.model = await tfDepthEstimation.createEstimator(
      pipeline,
      modelConfig
    );

    return this;
  }

  /**
   * Estimates depth from a single image, video frame, or canvas.
   *
   * @param {HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | p5.Image | p5.Graphics | p5.Element} input - The input element to estimate depth from.
   * @param {DepthEstimationRuntimeOptions} [options] - Optional runtime configuration overrides for this specific estimation.
   * @param {function(DepthEstimationResult): void} [callback] - Optional callback function that is called once the estimation is complete, receiving the result object.
   * @returns {Promise<DepthEstimationResult>} A promise that resolves with the depth estimation result object.
   *
   * @example
   * ```javascript
   * const img = document.getElementById('myImage');
   * const result = await depthEstimator.estimate(img);
   * console.log(result.depthMap); // ImageData of grayscale depth
   * console.log(result.visualization); // ImageData of colormapped depth
   * console.log(result.data[10][20]); // Raw depth value at y=10, x=20
   * ```
   */
  async estimate(...inputs) {
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for estimate()."
    );
    const { image, callback } = argumentObject;

    await mediaReady(image, false);

    const estimationConfig = {
      minDepth: this.runtimeConfig.minDepth,
      maxDepth: this.runtimeConfig.maxDepth,
      flipHorizontal: this.runtimeConfig.flipHorizontal
    };

    let depthMap;
    let result = null; // Initialize result to null
    try {
      depthMap = await this.model.estimateDepth(image, estimationConfig);
      // Process the depth map only if estimation succeeded
      if (depthMap) {
        result = await this.processDepthMap(depthMap, image);
      }
    } catch (error) {
      console.error("Error estimating depth:", error);
      // Result remains null
    }

    if (callback) callback(result); // Pass null if error occurred
    return result;
  }

  /**
   * Processes the raw depth map tensor from the model into a more usable result object.
   * This includes creating visualizations (ImageData, p5.Image) and adding metadata.
   * @param {tfDepthEstimation.DepthMap} depthMap - The raw depth map object from the TFJS model.
   * @param {HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | p5.Image | p5.Graphics | p5.Element} sourceElement - The original source element used for estimation, needed for dimensions.
   * @returns {Promise<DepthEstimationResult>} An object containing processed depth data and visualizations.
   * @private
   */
  async processDepthMap(depthMap, sourceElement) {
    const result = {};
    
    // Get the depth values as a 2D array
    const depthData = await depthMap.toArray();
    
    // Get dimensions
    const width = sourceElement.width;
    const height = sourceElement.height;
    
    // Store raw depth data
    result.data = depthData;
    
    // Create visualizations
    result.depthMap = this.createImageDataFromDepthValues(depthData, width, height, "GRAYSCALE");
    result.visualization = this.createImageDataFromDepthValues(depthData, width, height, this.runtimeConfig.colormap);
    
    // Convert to p5 image if p5 is available
    result.depthMapImage = this.generateP5Image(result.depthMap);
    result.visualizationImage = this.generateP5Image(result.visualization);
    
    // Add metadata
    result.width = width;
    result.height = height;
    result.minDepth = this.runtimeConfig.minDepth;
    result.maxDepth = this.runtimeConfig.maxDepth;
    
    // Add utility methods
    result.getDepthAt = (x, y) => {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        return depthData[y][x];
      }
      return null;
    };
    
    return result;
  }

  /**
   * Starts continuous depth estimation on a video or canvas element.
   * Results are passed to the provided callback function repeatedly.
   *
   * @param {HTMLVideoElement | HTMLCanvasElement | p5.Element | p5.Graphics} media - The video or canvas element to continuously estimate depth from. Must be playing or updating.
   * @param {function(DepthEstimationResult): void} callback - The function to call repeatedly with the depth estimation results.
   * @param {DepthEstimationRuntimeOptions} [options] - Optional runtime configuration overrides for the continuous estimation.
   *
   * @example
   * ```javascript
   * let video;
   * function setup() {
   *   createCanvas(640, 480);
   *   video = createCapture(VIDEO);
   *   video.size(width, height);
   *   video.hide();
   *   depthEstimator.estimateStart(video, (result) => {
   *     console.log('New depth map estimated!');
   *     image(result.visualizationImage, 0, 0, width, height);
   *   });
   * }
   * ```
   */
  estimateStart(...inputs) {
    // Parse out the input parameters
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for estimateStart()."
    );
    argumentObject.require(
      "callback",
      "A callback function argument is required for estimateStart()."
    );
    this.detectMedia = argumentObject.image;
    this.detectCallback = argumentObject.callback;

    this.signalStop = false;
    if (!this.detecting) {
      this.detecting = true;
      this.detectLoop();
    }
    if (this.prevCall === "start") {
      console.warn(
        "estimateStart() was called more than once without calling estimateStop(). Only the latest estimateStart() call will take effect."
      );
    }
    this.prevCall = "start";
  }

  /**
   * Stops the continuous estimation loop initiated by `estimateStart()`.
   * The loop will finish its current estimation before stopping.
   */
  estimateStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
  }

  /**
   * The internal loop for continuous estimation started by `estimateStart()`.
   * @private
   * @async
   */
  async detectLoop() {
    await mediaReady(this.detectMedia, false);
    while (!this.signalStop) {
      const estimationConfig = {
        minDepth: this.runtimeConfig.minDepth,
        maxDepth: this.runtimeConfig.maxDepth,
        flipHorizontal: this.runtimeConfig.flipHorizontal
      };

      let depthMap;
      let result = null;
      try {
        depthMap = await this.model.estimateDepth(this.detectMedia, estimationConfig);
        if (depthMap) {
          result = await this.processDepthMap(depthMap, this.detectMedia);
        } else {
          // Handle case where estimateDepth returns null/undefined without erroring
          console.warn("Depth estimation returned no data for this frame.");
          await tf.nextFrame(); // Ensure we yield even if processing skipped
          continue; // Skip to next frame
        }
      } catch (error) {
        console.error("Error during continuous depth estimation:", error);
        await tf.nextFrame(); // Ensure we yield even if error occurred
        continue; // Skip this frame and continue the loop
      }

      // Only call callback and yield if estimation and processing were successful
      if (result) {
          this.detectCallback(result);
      }
      await tf.nextFrame();
    }

    this.detecting = false;
    this.signalStop = false;
  }

  /**
   * Creates an ImageData object from a 2D array of depth values using a specified colormap.
   * Normalizes values based on `this.runtimeConfig.minDepth` and `this.runtimeConfig.maxDepth`.
   * @param {number[][]} depthValues - 2D array of raw depth values.
   * @param {number} width - The width of the desired ImageData.
   * @param {number} height - The height of the desired ImageData.
   * @param {ColormapName | string} [colormap='GRAYSCALE'] - The name of the colormap to apply. Defaults to 'GRAYSCALE'. Case-insensitive.
   * @returns {ImageData} The generated ImageData object.
   * @private
   */
  createImageDataFromDepthValues(depthValues, width, height, colormap = "GRAYSCALE") {
    // Create an ImageData object
    const imageData = new ImageData(width, height);
    
    // Normalize depth values to 0-1 range for visualization
    const minDepth = this.runtimeConfig.minDepth;
    const maxDepth = this.runtimeConfig.maxDepth;
    const range = maxDepth - minDepth;
    
    // Get the colormap function
    const colormapKey = colormap.toUpperCase(); // Ensure uppercase for lookup
    const colormapFn = COLORMAPS[colormapKey] || COLORMAPS.GRAYSCALE;

    // Iterate through the 2D array of depth values
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Get the depth value from the 2D array
        const depthValue = depthValues[y][x];
        
        // Normalize the depth value between 0 and 1
        // Handle potential division by zero if minDepth === maxDepth
        const normalizedValue = range === 0 ? 0 : Math.max(0, Math.min(1, (depthValue - minDepth) / range));
        
        // Calculate the index in the ImageData 1D array
        const pixelIndex = (y * width + x) * 4;
        
        // Apply the colormap
        const [r, g, b] = colormapFn(normalizedValue);

        // Set RGB values and full alpha
        imageData.data[pixelIndex] = r;
        imageData.data[pixelIndex + 1] = g;
        imageData.data[pixelIndex + 2] = b;
        imageData.data[pixelIndex + 3] = 255; // A (fully opaque)
      }
    }
    
    return imageData;
  }

  /**
   * Converts an ImageData object to a p5.Image object if p5 is available in the global scope.
   * Otherwise, returns the original ImageData.
   * @param {ImageData} imageData - The ImageData object to convert.
   * @returns {p5.Image | ImageData} A p5.Image if p5 is loaded, otherwise the input ImageData.
   * @private
   */
  generateP5Image(imageData) {
    if (window?.p5) {
      const img = new p5.Image(imageData.width, imageData.height);
      img.drawingContext.putImageData(imageData, 0, 0);
      return img;
    } else {
      return imageData;
    }
  }
}

/**
 * Creates a new DepthEstimation instance.
 *
 * @param {string} [modelName="ARPortraitDepth"] - The name of the model to use. Currently only "ARPortraitDepth" is supported.
 * @param {DepthEstimationOptions & DepthEstimationRuntimeOptions} [options] - An object containing options for model loading and runtime estimation.
 * @param {function(): void} [callback] - Optional callback function called when the model is loaded and ready.
 * @returns {DepthEstimation} A new depthEstimation instance.
 */
const depthEstimation = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  const instance = new DepthEstimation(string, options, callback);
  return instance;
};

export default depthEstimation;
