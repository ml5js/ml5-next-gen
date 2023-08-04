// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* eslint prefer-destructuring: ["error", {AssignmentExpression: {array: false}}] */
/* eslint no-await-in-loop: "off" */

/*
 * BodyPix: Real-time Person Segmentation in the Browser
 * Ported and integrated from all the hard work by: https://github.com/tensorflow/tfjs-models/tree/master/body-pix
 */

// @ts-check
import * as tf from '@tensorflow/tfjs';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import callCallback from '../utils/callcallback';
import generatedImageResult from '../utils/generatedImageResult';
import handleArguments from '../utils/handleArguments';
import p5Utils from '../utils/p5Utils';
import { mediaReady } from '../utils/imageUtilities';


/**
 * @typedef {Object} BodyPixOptions
 * @property {import('@tensorflow-models/body-segmentation/dist/body_pix/impl/types').BodyPixArchitecture}[architecture] -Can be either MobileNetV1 or ResNet 50.
 * @property {import('@tensorflow-models/body-segmentation/dist/body_pix/impl/types').BodyPixMultiplier} [multiplier]
 * @property {import('@tensorflow-models/body-segmentation/dist/body_pix/impl/types').BodyPixOutputStride} [outputStride]
 * @property {number} [quantBytes]
 * @property {boolean} [returnTensors]
 * @property {boolean} [multiSegmentation]
 * @property {boolean} [segmentBodyParts]

 */

/**
 * @type {BodyPixOptions}
 */
const DEFAULTS = {
  //can we let the users decide which architecture to use?
  //two defaults?
  "architecture": "ResNet50",
  "multiplier": 1,
  "outputStride": 32,
  "quantBytes": 2,
  "returnTensors": false,
}
//Add notes for the params later!


//Similar operations when we want to use MobileNet as the architecture 
//(extra param: multiplier)


class BodyPix {
  /**
   * Create BodyPix.
     * @param {HTMLVideoElement} [video] - An HTMLVideoElement.
     * @param {BodyPixOptions} [options] - An object with options.
     * @param {ML5Callback<BodyPix>} [callback] - A callback to be called when the model is ready.
   */
  constructor(video, options, callback) {
    this.video = video;
    this.model = null;
    this.modelReady = false;
    this.modelPath = '';
    // TODO: make the code more consise here?
    this.config = {
      architecture: options.architecture || DEFAULTS.architecture,
      multiplier: options.multiplier || DEFAULTS.multiplier,
      outputStride: options.outputStride || DEFAULTS.outputStride,
      quantBytes: options.quantBytes || DEFAULTS.quantBytes,
      multiSegmentation: options.multiSegmentation,
      segmentBodyParts: options.segmentBodyParts,
      // flipHorizontal: options.flipHorizontal || DEFAULTS.flipHorizontal, // true when webcam is on;
      // internalResolution: options.internalResolution || DEFAULTS.internalResolution,
      // segmentationThreshold: options.segmentationThreshold || DEFAULTS.segmentationThreshold,
      // maxDetections: options.maxDetections || DEFAULTS.maxDetections,
      // scoreThreshold: options.scoreThreshold || DEFAULTS.maxDetections,
      // nmsRadius: options.nmsRadius || DEFAULTS.nmsRadius,
      returnTensors: options.returnTensors || DEFAULTS.returnTensors
    }
    this.ready = callCallback(this.loadModel(), callback);
  }
  /**
   * Load the model and set it to this.model
   * @return {Promise<BodyPix>}
   */
  async loadModel() {
    this.model = bodySegmentation.SupportedModels.BodyPix;
    this.segmenter = await bodySegmentation.createSegmenter(this.model, this.config);
    this.modelReady = true;
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
   */

  /**
   * Segments the image with partSegmentation, return result object
   * @param {InputImage} [imgToSegment]
   * @param {BodyPixOptions} [segmentationOptions] - config params for the segmentation
   * @return {Promise<SegmentationResult>} a result object with image, raw, bodyParts
   */
  async segmentWithPartsInternal(imgToSegment, segmentationOptions) {
    // estimatePartSegmentation
    await this.ready;
    await mediaReady(imgToSegment, true);


    this.config.outputStride = segmentationOptions.outputStride || this.config.outputStride;
    //this.config.segmentationThreshold = segmentationOptions.segmentationThreshold || this.config.segmentationThreshold;
    this.config.multiSegmentation = segmentationOptions.multiSegmentation || false;
    this.config.segmentBodyParts = segmentationOptions.segmentBodyParts || true
    const segmentation = await this.segmenter.segmentPeople(imgToSegment, { multiSegmentation: this.config.multiSegmentation, segmentBodyParts: this.config.segmentBodyParts });
    // const segImageData = await segmentation[0].mask.toImageData();


    const result = {
      segmentation,
      raw: {
        personMask: null,
        backgroundMask: null,
        partMask: null
      },
      personMask: null,
      backgroundMask: null,
      partMask: null,
      tensor: null
    };


    result.raw.personMask = await bodySegmentation.toBinaryMask(segmentation, { r: 0, g: 0, b: 0, a: 255 }, { r: 0, g: 0, b: 0, a: 0 });
    result.raw.backgroundMask = await bodySegmentation.toBinaryMask(segmentation);
    result.raw.partMask = await bodySegmentation.toColoredMask(segmentation, bodySegmentation.bodyPixMaskValueToRainbowColor, { r: 255, g: 255, b: 255, a: 255 });
    if (this.config.returnTensors){
      result.tensor = await segmentation[0].mask.toTensor();
    }
    const personMaskRes = await generatedImageResult(result.raw.personMask);
    const bgMaskRes = await generatedImageResult(result.raw.backgroundMask);
    const partMaskRes = await generatedImageResult(result.raw.partMask);

    result.personMask = personMaskRes.image || result.raw.personMask;
    result.backgroundMask = bgMaskRes.image || result.raw.backgroundMask;
    result.partMask = partMaskRes.image || result.raw.partMask;

    return result;

  }

  /**
   * Segments the image with partSegmentation
   *
   * Takes any of the following params:
   * - an image to segment
   * - config params for the segmentation, includes palette, outputStride, segmentationThreshold
   * - a callback function that handles the results of the function.
   * @param {(InputImage | BodyPixOptions | ML5Callback<SegmentationResult>[])} [args]
   * @return {Promise<SegmentationResult>}
   */
  async segmentWithParts(...args) {
    const { options = this.config, callback, image = this.video } = handleArguments(...args);

    if (!image) {
      throw new Error(
        'No input image provided. If you want to classify a video, pass the video element in the constructor.'
      );
    }

    return callCallback(this.segmentWithPartsInternal(image, options), callback);
  }

  /**
   * Segments the image with personSegmentation, return result object
   * @param {InputImage} imgToSegment
   * @param {BodyPixOptions} segmentationOptions - config params for the segmentation
   *    includes outputStride, segmentationThreshold
   * @return {Promise<SegmentationResult>} a result object with maskBackground, maskPerson, raw
   */
  async segmentInternal(imgToSegment, segmentationOptions) {

    await this.ready;
    await mediaReady(imgToSegment, true);

    this.config.outputStride = segmentationOptions.outputStride || this.config.outputStride;
    this.config.segmentationThreshold = segmentationOptions.segmentationThreshold || this.config.segmentationThreshold;
    this.config.multiSegmentation = segmentationOptions.multiSegmentation;

    const segmentation = await this.segmenter.segmentPeople(imgToSegment, this.config.multiSegmentation, this.config.segmentBodyParts);
    const segImageData = await segmentation[0].mask.toImageData();

    const result = {
      segmentation,
      personMask: null,
      backgroundMask: null,
      tensor: null
    };


    result.personMask = await bodySegmentation.toBinaryMask(segmentation, { r: 0, g: 0, b: 0, a: 255 }, { r: 0, g: 0, b: 0, a: 0 });
    result.backgroundMask = await bodySegmentation.toBinaryMask(segmentation);
    result.tensor = await segmentation[0].mask.toTensor();

    return result;

  }

  /**
   * Segments the image with personSegmentation
   *
   * Takes any of the following params:
   * - an image to segment
   * - config params for the segmentation, includes outputStride, segmentationThreshold
   * - a callback function that handles the results of the function.
   * @param {(InputImage | BodyPixOptions | ML5Callback<SegmentationResult>)[]} [args]
   * @return {Promise<SegmentationResult>}
   */
  async segment(...args) {
    const { options = this.config, callback, image = this.video } = handleArguments(...args);

    if (!image) {
      throw new Error(
        'No input image provided. If you want to classify a video, pass the video element in the constructor.'
      );
    }

    return callCallback(this.segmentInternal(image, options), callback);
  }

}

/**
 * @param {(HTMLVideoElement | p5.Video | BodyPixOptions |  ML5Callback<BodyPix>)[]} [inputs]
 * @return {BodyPix | Promise<BodyPix>}
 */
const bodyPix = (...inputs) => {
  const args = handleArguments(...inputs);
  const instance = new BodyPix(args.video, args.options || {}, args.callback);
  return instance;
}

export default bodyPix;
