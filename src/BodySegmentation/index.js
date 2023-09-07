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
import { EventEmitter } from "events";
import callCallback from "../utils/callcallback";
import generatedImageResult from "../utils/generatedImageResult";
import handleArguments from "../utils/handleArguments";
import BODYPIX_PALETTE from "./BODYPIX_PALETTE";
import { mediaReady } from "../utils/imageUtilities";

class BodyPix extends EventEmitter {
  /**
   * Create BodyPix.
   * @param {HTMLVideoElement} [video] - An HTMLVideoElement.
   * @param {object} [options] - An object with options.
   * @param {function} [callback] - A callback to be called when the model is ready.
   */
  constructor(video, options, callback) {
    super();

    // for compatibility with p5's preload()
    if (this.p5PreLoadExists()) window._incrementPreload();

    this.video = video;
    this.model = null;
    this.modelReady = false;
    this.config = options;

    this.ready = callCallback(this.loadModel(), callback);
  }

  /**
   * Load the model and set it to this.model
   * @return {this} the Bodypix model.
   */
  async loadModel() {
    const pipeline = bodySegmentation.SupportedModels.BodyPix;
    const modelConfig = {
      architecture: this.config?.architecture ?? "ResNet50", // MobileNetV1 or ResNet 50
      multiplier: this.config?.multiplier ?? 1, // 0.5, 0.75 or 1, only for MobileNetV1
      outputStride: this.config?.outputStride ?? 16, // 8 or 16 for MobileNetV1, 16 or 32 for ResNet50
      quantBytes: this.config?.quantBytes ?? 2, //1, 2 or 4, accuracy and model siz increase correspondingly
    };
    await tf.setBackend("webgl");
    this.model = await bodySegmentation.createSegmenter(pipeline, modelConfig);
    this.modelReady = true;
    if (this.video) {
      this.segment();
    }

    // for compatibility with p5's preload()
    if (this.p5PreLoadExists) window._decrementPreload();

    return this;
  }

  /**
   * @typedef {Object} SegmentationResult
   * @property {{maskValueToLabel: Function, mask: Object}} segmentation
   * @property {p5.Image | Uint8ClampedArray} personMask - will be a p5 Image if p5 is available,
   * or imageData otherwise.
   * @property {p5.Image | Uint8ClampedArray} backgroundMask - backgroundMask
   * @property {p5.Image | Uint8ClampedArray} partMask - partMask which plots 24 parts of your body.
   * @property {{personMask: ImageData, backgroundMask: ImageData, partMask?: ImageData}} raw
   * @property {tf.Tensor | null} tensor -
   * return the Tensor objects for the person and the background if option `returnTensors` is true.
   * @property {Object} bodyParts - An object that maps body parts to id and RGB color.
   */

  /**
   * Segments the image with partSegmentation, return result object
   * @param {InputImage} [imgToSegment]
   * @param {function} [cb] - config params for the segmentation
   * @return {Promise<SegmentationResult>} a result object with image, raw, bodyParts
   */
  async segment(imgToSegment, cb) {
    const { image, callback } = handleArguments(this.video, imgToSegment, cb);
    if (!image) {
      throw new Error(
        "No input image provided. If you want to classify a video, pass the video element in the constructor."
      );
    }
    await mediaReady(image, false);
    const options = {
      multiSegmentation: this.config?.multiSegmentation ?? false, // whether we need multiple outputs when multiple people detected
      segmentBodyParts: this.config?.segmentBodyParts ?? true, // if bodyparts are segmented
      flipHorizontal: this.config?.flipHorizontal ?? false, // set to true for webcam
    };

    const segmentation = await this.model.segmentPeople(image, options);

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
      tensor: null,
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
    if (this.config.segmentBodyParts) {
      result.raw.partMask = await bodySegmentation.toColoredMask(
        segmentation,
        bodySegmentation.bodyPixMaskValueToRainbowColor,
        { r: 255, g: 255, b: 255, a: 255 }
      );
    }
    if (this.config.returnTensors) {
      result.tensor = await segmentation[0].mask.toTensor();
    }
    const personMaskRes = await generatedImageResult(result.raw.personMask);
    const bgMaskRes = await generatedImageResult(result.raw.backgroundMask);
    const partMaskRes = await generatedImageResult(result.raw.partMask);

    result.personMask = personMaskRes.image || result.raw.personMask;
    result.backgroundMask = bgMaskRes.image || result.raw.backgroundMask;
    result.partMask = partMaskRes.image || result.raw.partMask;

    this.emit("bodypix", result);

    if (this.video) {
      return tf.nextFrame().then(() => this.segment());
    }

    if (typeof callback === "function") {
      callback(result);
    }

    return result;
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
  const { video, options = {}, callback } = handleArguments(...inputs);
  const instance = new BodyPix(video, options, callback);
  return instance;
};

export default bodyPix;
