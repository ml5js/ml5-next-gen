// Copyright (c) 2019-2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 * BodyPix: Real-time Person Segmentation in the Browser
 * Ported and integrated from all the hard work by: https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation/src/body_pix
 */

import * as tf from "@tensorflow/tfjs";
import * as tfBodySegmentation from "@tensorflow-models/body-segmentation";
import callCallback from "../utils/callcallback";
import handleArguments from "../utils/handleArguments";
import BODYPIX_PALETTE from "./BODYPIX_PALETTE";
import { mediaReady } from "../utils/imageUtilities";
import handleOptions from "../utils/handleOptions";
import { handleModelName } from "../utils/handleOptions";

class BodySegmentation {
  /**
   * Create BodyPix.
   * @param {HTMLVideoElement} [video] - An HTMLVideoElement.
   * @param {object} [options] - An object with options.
   * @param {function} [callback] - A callback to be called when the model is ready.
   */
  constructor(modelName = "SelfieSegmentation", options, callback) {
    // for compatibility with p5's preload()
    if (this.p5PreLoadExists()) window._incrementPreload();

    this.modelName = modelName;
    this.video = video;
    this.model = null;
    this.config = options;
    this.runtimeConfig = {};
    this.detectMedia = null;
    this.detectCallback = null;
    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Load the model and set it to this.model
   * @return {this} the Bodypix model.
   */
  async loadModel() {
    let pipeline;
    let modelConfig;

    this.modelName = handleModelName(
      this.modelName,
      ["BodyPix", "SelfieSegmentation"],
      "SelfieSegmentation",
      "bodySegmentation"
    );

    //select the correct model based on mask type
    // if (!this.modelName) {
    //   this.modelName =
    //     this.config.maskType === "parts" ? "BodyPix" : "SelfieSegmentation";
    // } else {
    //   if (this.config.maskType === "parts") {
    //     if (this.modelName !== "BodyPix") {
    //       console.warn(
    //         `Expect model name to be "BodyPix" when maskType is "parts", but got "${this.modelName}". Using "BodyPix" instead.`
    //       );
    //       this.modelName = "BodyPix";
    //     }
    //   } else {
    //     if (
    //       this.modelName !== "SelfieSegmentation" &&
    //       this.modelName !== "BodyPix"
    //     ) {
    //       console.warn(
    //         `Expect model name to be "SelfieSegmentation" or "BodyPix", but got "${this.modelName}". Using "SelfieSegmentation" instead.`
    //       );
    //       this.modelName = "SelfieSegmentation";
    //     }
    //   }
    // }

    if (this.modelName === "BodyPix") {
      pipeline = tfBodySegmentation.SupportedModels.BodyPix;
      modelConfig = handleOptions(
        this.config,
        {
          architecture: {
            type: "enum",
            enums: ["MobileNetV1", "ResNet50"],
            default: "ResNet50",
          },
          multiplier: {
            type: "enum",
            enums: [0.5, 0.75, 1],
            default: 1,
            ignore: (config) => config.architecture !== "MobileNetV1",
          },
          outputStride: {
            type: "enum",
            enums: (config) =>
              config.architecture === "MobileNetV1" ? [8, 16] : [16, 32],
            default: 16,
          },
          quantBytes: {
            type: "enum",
            enums: [1, 2, 4],
            default: 2,
          },
          modelURL: {
            type: "string",
            default: undefined,
          },
        },
        "bodySegmentation"
      );
      this.runtimeConfig = handleOptions(
        this.config,
        {
          maskType: {
            type: "enum",
            enums: ["person", "background", "parts"],
            default: "background",
          },
          multiSegmentation: {
            type: "boolean",
            default: false,
          },
          segmentBodyParts: {
            type: "boolean",
            default: true,
          },
          flipHorizontal: {
            type: "boolean",
            default: false,
          },
        },
        "bodySegmentation"
      );
    } else {
      pipeline = tfBodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
      modelConfig = handleOptions(
        this.config,
        {
          runtime: {
            type: "enum",
            enums: ["mediapipe, tfjs"],
            default: "mediapipe",
          },
          modelType: {
            type: "enum",
            enums: ["general", "landscape"],
            default: "general",
          },
          solutionPath: {
            type: "string",
            default:
              "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
            ignore: (config) => config.runtime !== "mediapipe",
          },
          modelURL: {
            type: "string",
            default: undefined,
          },
        },
        "bodySegmentation"
      );

      this.runtimeConfig = handleOptions(
        this.config,
        {
          maskType: {
            type: "enum",
            enums: ["person", "background"],
            default: "background",
          },
          flipHorizontal: {
            type: "boolean",
            default: false,
          },
        },
        "bodySegmentation"
      );
    }

    await tf.ready();
    this.model = await tfBodySegmentation.createSegmenter(
      pipeline,
      modelConfig
    );

    // for compatibility with p5's preload()
    if (this.p5PreLoadExists) window._decrementPreload();

    return this;
  }
  /**
   * Calls segmentPeople in a loop.
   * Can be started by detectStart() and terminated by detectStop().
   * @private
   */
  async detect(...inputs) {
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for detectStart()."
    );
    const { image, callback } = argumentObject;

    await mediaReady(image, false);

    const segmentation = await this.model.segmentPeople(
      image,
      this.runtimeConfig
    );

    const result = {};
    switch (this.runtimeConfig.maskType) {
      case "background":
        result.maskImageData = await tfBodySegmentation.toBinaryMask(
          segmentation,
          { r: 0, g: 0, b: 0, a: 255 },
          { r: 0, g: 0, b: 0, a: 0 }
        );
        break;
      case "person":
        result.maskImageData = await tfBodySegmentation.toBinaryMask(
          segmentation
        );
        break;
      case "parts":
        result.maskImageData = await tfBodySegmentation.toColoredMask(
          segmentation,
          tfBodySegmentation.bodyPixMaskValueToRainbowColor,
          { r: 255, g: 255, b: 255, a: 255 }
        );
        result.bodyParts = BODYPIX_PALETTE;
    }
    result.mask = this.generateP5Image(result.maskImageData);

    if (callback) callback(result);
    return result;
  }
  /**
   * Repeatedly outputs hand predictions through a callback function.
   * @param {*} [media] - An HMTL or p5.js image, video, or canvas element to run the prediction on.
   * @param {gotHands} [callback] - A callback to handle the hand detection results.
   */
  detectStart(...inputs) {
    // Parse out the input parameters
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for detectStart()."
    );
    argumentObject.require(
      "callback",
      "A callback function argument is required for detectStart()."
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
        "detectStart() was called more than once without calling detectStop(). Only the latest detectStart() call will take effect."
      );
    }
    this.prevCall = "start";
  }

  /**
   * Stops the detection loop before next detection loop runs.
   */
  detectStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
  }

  /**
   * Calls segmentPeople in a loop.
   * Can be started by detectStart() and terminated by detectStop().
   * @private
   */
  async detectLoop() {
    await mediaReady(this.detectMedia, false);
    while (!this.signalStop) {
      const segmentation = await this.model.segmentPeople(
        this.detectMedia,
        this.runtimeConfig
      );

      const result = {};
      switch (this.runtimeConfig.maskType) {
        case "background":
          result.maskImageData = await tfBodySegmentation.toBinaryMask(
            segmentation,
            { r: 0, g: 0, b: 0, a: 255 },
            { r: 0, g: 0, b: 0, a: 0 }
          );
          break;
        case "person":
          result.maskImageData = await tfBodySegmentation.toBinaryMask(
            segmentation
          );
          break;
        case "parts":
          result.maskImageData = await tfBodySegmentation.toColoredMask(
            segmentation,
            tfBodySegmentation.bodyPixMaskValueToRainbowColor,
            { r: 255, g: 255, b: 255, a: 255 }
          );
          result.bodyParts = BODYPIX_PALETTE;
      }
      result.mask = this.generateP5Image(result.maskImageData);

      this.detectCallback(result);
      await tf.nextFrame();
    }

    this.detecting = false;
    this.signalStop = false;
  }

  /**
   * Generate a p5 image from the image data
   * @param imageData - a ImageData object
   * @param width - the width of the p5 image
   * @param height - the height of the p5 image
   * @return a p5.Image object
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

  /**
   * Check if p5.js' preload() function is present
   * @returns {boolean} true if preload() exists
   *
   * @private
   */
  p5PreLoadExists() {
    if (typeof window === "undefined") return false;
    if (typeof window.p5 === "undefined") return false;
    if (typeof window.p5.prototype === "undefined") return false;
    if (typeof window.p5.prototype.registerPreloadMethod === "undefined")
      return false;
    return true;
  }
}

/**
 * Factory function that returns a Facemesh instance
 * @returns {Object} A new bodySegmentation instance
 */
const bodySegmentation = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  const instance = new BodySegmentation(string, options, callback);
  return instance;
};

export default bodySegmentation;
