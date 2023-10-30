// Copyright (c) 2019-2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 * BodyPix: Real-time Person Segmentation in the Browser
 * Ported and integrated from all the hard work by: https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation/src/body_pix
 */

import * as tf from "@tensorflow/tfjs";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import callCallback from "../utils/callcallback";
import generatedImageResult from "../utils/generatedImageResult";
import handleArguments from "../utils/handleArguments";
import BODYPIX_PALETTE from "./BODYPIX_PALETTE";
import { mediaReady } from "../utils/imageUtilities";

class BodyPix {
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
    this.modelReady = false;
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
    if (this.modelName === "BodyPix") {
      pipeline = bodySegmentation.SupportedModels.BodyPix;
      modelConfig = {
        architecture: this.config.architecture ?? "ResNet50", // MobileNetV1 or ResNet 50
        multiplier: this.config.multiplier ?? 1, // 0.5, 0.75 or 1, only for MobileNetV1
        outputStride: this.config.outputStride ?? 16, // 8 or 16 for MobileNetV1, 16 or 32 for ResNet50
        quantBytes: this.config.quantBytes ?? 2, // 1, 2 or 4, accuracy and model siz increase correspondingly
        maskType: this.config.maskType ?? "background", // "person", "background", or "color"
      };
      this.runtimeConfig = {
        multiSegmentation: this.config?.multiSegmentation ?? false, // whether we need multiple outputs when multiple people detected
        segmentBodyParts: this.config?.segmentBodyParts ?? true, // if bodyparts are segmented
        flipHorizontal: this.config?.flipHorizontal ?? false, // set to true for webcam
      };
    } else {
      if (this.modelName !== "SelfieSegmentation") {
        console.warn(
          `Expect model name to be "BodyPix" or "SelfieSegmentation", but got "${this.modelName}". Using "SelfieSegmentation" instead.`
        );
      }
      pipeline = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
      modelConfig = {
        runtime: this.config.runtime ?? "mediapipe",
        solutionPath:
          this.config.solution ??
          "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
        modelType: this.config.modelType ?? "general", // "general" or "landscape"

        maskType: this.config.maskType ?? "background", // "person", "background", or "color"
      };
      this.runtimeConfig = {
        flipHorizontal: this.config?.flipHorizontal ?? false, // set to true for webcam
      };
    }

    await tf.ready();
    this.model = await bodySegmentation.createSegmenter(pipeline, modelConfig);
    this.modelReady = true;

    // for compatibility with p5's preload()
    if (this.p5PreLoadExists) window._decrementPreload();

    return this;
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

      const result = {
        segmentation,
        raw: {
          personMask: null,
          backgroundMask: null,
          partMask: null,
        },
        personMask: null,
        backgroundMask: null,
        partMask: null,
        bodyParts: BODYPIX_PALETTE,
      };

      result.raw.personMask = await bodySegmentation.toBinaryMask(
        segmentation,
        { r: 0, g: 0, b: 0, a: 255 },
        { r: 0, g: 0, b: 0, a: 0 }
      );
      result.raw.backgroundMask = await bodySegmentation.toBinaryMask(
        segmentation
      );
      if (this.runtimeConfig.segmentBodyParts) {
        result.raw.partMask = await bodySegmentation.toColoredMask(
          segmentation,
          bodySegmentation.bodyPixMaskValueToRainbowColor,
          { r: 255, g: 255, b: 255, a: 255 }
        );
      }

      result.personMask = this.generateP5Image(result.raw.personMask);
      //result.backgroundMask = await generatedImageResult(result.raw.backgroundMask) || result.raw.backgroundMask;
      //result.partMask = await generatedImageResult(result.raw.partMask) || result.raw.partMask;

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
      img.loadPixels();
      for (let i = 0; i < img.pixels.length; i++) {
        img.pixels[i] = imageData.data[i];
      }
      img.updatePixels();
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
 * @param {(HTMLVideoElement | p5.Video | BodyPixOptions |  ML5Callback<BodyPix>)[]} [inputs]
 * @return {BodyPix | Promise<BodyPix>}
 */
const bodyPix = (...inputs) => {
  const { string, options = {}, callback } = handleArguments(...inputs);
  const instance = new BodyPix(string, options, callback);
  return instance;
};

export default bodyPix;
