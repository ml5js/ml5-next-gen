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
import BODYPIX_PALETTE from './PALETTE';
import { mediaReady } from '../utils/imageUtilities';

/**
 * @typedef {Record<string, {color: [number, number, number], id: number}>} BodyPixPalette
 */

/**
 * @typedef {Object} BodyPixOptions
 * @property {string}[architecture] -Can be either MobileNetV1 or ResNet 50.
 * @property {import('@tensorflow-models/body-pix/dist/mobilenet').MobileNetMultiplier} [multiplier]
 * @property {import('@tensorflow-models/body-pix/dist/mobilenet').OutputStride} [outputStride]
 * @property {number} [quantBytes]
 * @property {BodyPixPalette} [palette]
 * @property {boolean} [returnTensors]
 * @property {boolean} [multiSegmentation]
 * @property {boolean} [segmentBodyParts]
 * @property {boolean} [flipHorizontal]
 * @property {string} [internalResolution]
 * @property {number} [segmentationThreshold]
 * @property {number} [maxDetections]
 * @property {number} [scoreThreshold]
 * @property {number} [nmsRadius]
 
 */

/**
 * @type {BodyPixOptions}
 */
const DEFAULTS = {
  //can we let the users decide which architecture to use?
  //two defaults?
  "architecture": "ResNet50",
  "multiplier": 0.75,
  "outputStride": 32,
  "quantBytes": 2,
  "returnTensors": false,
  "flipHorizontal": false,
  "internalResolution": "medium",
  "segmentationThreshold": 0.7,
  "maxDetections": 10,
  "scoreThreshold": 0.3,
  "nmsRadius": 20,
  "palette": BODYPIX_PALETTE
}
//Add notes for the params later!

//Should I add multiSeg params?
//Some ideas in mind:
//if multiSegmentation is True, add two extra items to SEGDEFAULTS

//"minKeypointScore": 0.3,
//"refineSteps": 10,

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
    this.config = {
      architecture: options.architecture || DEFAULTS.architecture,
      multiplier: options.multiplier || DEFAULTS.multiplier,
      outputStride: options.outputStride || DEFAULTS.outputStride,
      quantBytes: options.quantBytes || DEFAULTS.quantBytes,
      palette: options.palette || DEFAULTS.palette,
      multiSegmentation: options.multiSegmentation,
      segmentBodyParts: options.segmentBodyParts,
      flipHorizontal: options.flipHorizontal || DEFAULTS.flipHorizontal,
      internalResolution: options.internalResolution || DEFAULTS.internalResolution,
      segmentationThreshold: options.segmentationThreshold || DEFAULTS.segmentationThreshold,
      maxDetections: options.maxDetections || DEFAULTS.maxDetections,
      scoreThreshold: options.scoreThreshold || DEFAULTS.maxDetections,
      nmsRadius: options.nmsRadius || DEFAULTS.nmsRadius,
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
    this.segmenter = await bodySegmentation.createSegmenter(this.model,this.config);
    this.modelReady = true;
    return this;
  }

  /**
   * Returns an rgb array
   * @param {Object} p5ColorObj - a p5.Color obj
   * @return {Array} an [r,g,b] array
   */
  /* eslint class-methods-use-this: "off" */
  p5Color2RGB(p5ColorObj) {
    const regExp = /\(([^)]+)\)/;
    const match = regExp.exec(p5ColorObj.toString('rgb'));
    const [r, g, b] = match[1].split(',')
    return [r, g, b]
  }

  /**
   * Returns a bodyPartsSpec object
   * @param {Array} colorOptions - an array of [r,g,b] colors
   * @return {object} an object with the bodyParts by color and id
   */
  /* eslint class-methods-use-this: "off" */
  bodyPartsSpec(colorOptions) {
    const result = colorOptions !== undefined || Object.keys(colorOptions).length >= 24 ? colorOptions : this.config.palette;

    // Check if we're getting p5 colors, make sure they are rgb
    const p5 = p5Utils.p5Instance;
    if (p5 && result !== undefined && Object.keys(result).length >= 24) {
      // Ensure the p5Color object is an RGB array
      Object.keys(result).forEach(part => {
        if (result[part].color instanceof p5.Color) {
          result[part].color = this.p5Color2RGB(result[part].color);
        }
      });
    }

    return result;
  }


  /**
   * @typedef {Object} SegmentationResult
   * @property {{maskValueToLabel: Function, mask: Object}} segmentation
   * @property {p5.Image | Uint8ClampedArray} personMask - will be a p5 Image if p5 is available,
   * or an array of pixel values otherwise.
   * @property {p5.Image | Uint8ClampedArray} backgroundMask
   * @property {{personMask: tf.Tensor | null, backgroundMask: tf.Tensor | null, partMask?: tf.Tensor | null}} tensor -
   * return the Tensor objects for the person and the background if option `returnTensors` is true.
   * @property {{personMask: ImageData, backgroundMask: ImageData, partMask?: ImageData}} raw
   * @property {BodyPixPalette} [bodyParts] - body parts are included when calling `segmentWithParts`.
   */

  /**
   * Segments the image with partSegmentation, return result object
   * @param {InputImage} [imgToSegment]
   * @param {BodyPixOptions} [segmentationOptions] - config params for the segmentation
   *    includes outputStride, segmentationThreshold
   * @return {Promise<SegmentationResult>} a result object with image, raw, bodyParts
   */
  async segmentWithPartsInternal(imgToSegment, segmentationOptions) {
    // estimatePartSegmentation
    await this.ready;
    await mediaReady(imgToSegment, true);

    this.config.palette = segmentationOptions.palette || this.config.palette;
    this.config.outputStride = segmentationOptions.outputStride || this.config.outputStride;
    this.config.segmentationThreshold = segmentationOptions.segmentationThreshold || this.config.segmentationThreshold;
    this.config.multiSegmentation = segmentationOptions.multiSegmentation || false;
    //what if the argument does not contain multiSegmentation?
    this.config.segmentBodyParts = segmentationOptions.segmentBodyParts || true

    const segmentation = await this.segmenter.segmentPeople(imgToSegment, {multiSegmentation: this.config.multiSegmentation, segmentBodyParts:this.config.segmentBodyParts});
    //will use default function instead
    //const bodyPartsMeta = this.bodyPartsSpec(this.config.palette);
    //const colorsArray = Object.keys(bodyPartsMeta).map(part => bodyPartsMeta[part].color)


    const result = {
      segmentation,
      raw: {
        personMask: null,
        backgroundMask: null,
        partMask: null
      },
      tensor: {
        personMask: null,
        backgroundMask: null,
        partMask: null,
      },
      personMask: null,
      backgroundMask: null,
      partMask: null,
      bodyParts: bodySegmentation.bodyPixMaskValueToRainbowColor
    };
    //TBD: 
    //How can we let the user DIY the color of the mask
    //and get rid of personMask and backgroundMask
    //need to modify the structure of the color palette later
    result.raw.backgroundMask = bodySegmentation.toBinaryMask(segmentation);
    result.raw.personMask = bodySegmentation.toBinaryMask(segmentation, {r: 0, g: 0, b: 0, a: 255},  {r: 0, g: 0, b: 0, a: 0});
    result.raw.partMask = bodySegmentation.toColoredMask(segmentation, bodySegmentation.bodyPixMaskValueToRainbowColor,{r: 255, g: 255, b: 255, a: 255});


    const {
      personMask,
      backgroundMask,
      partMask,
    } = tf.tidy(() => {
      let image; /** @type {ImageData} */;
      for (const value of segmentation){
        const mask = value.mask;
        image = mask.toImageData();
        // const tensor = await mask.toTensor();
  
        // const res = tensor.dataToGPU();
      }

      let normTensor = tf.browser.fromPixels(imgToSegment);
      // create a tensor from the input image
      const alpha = tf.ones([image.height, image.width, 1]).tile([1, 1, 1]).mul(255)
      normTensor = normTensor.concat(alpha, 2)

      // create a tensor from the segmentation
      let maskPersonTensor = tf.tensor(image.data, [segmentation.height, segmentation.width, 1]);
      let maskBackgroundTensor = tf.tensor(segmentation.data, [segmentation.height, segmentation.width, 1]);
      let partTensor = tf.tensor([...result.raw.partMask.data], [segmentation.height, segmentation.width, 4]);

      // multiply the segmentation and the inputImage
      maskPersonTensor = tf.cast(maskPersonTensor.add(0.2).sign().relu().mul(normTensor), 'int32')
      maskBackgroundTensor = tf.cast(maskBackgroundTensor.add(0.2).sign().neg().relu().mul(normTensor), 'int32')
      // TODO: handle removing background 
      partTensor = tf.cast(partTensor, 'int32')

      return {
        personMask: maskPersonTensor,
        backgroundMask: maskBackgroundTensor,
        partMask: partTensor
      }
    })



    const personMaskRes = await generatedImageResult(personMask, this.config);
    const bgMaskRes = await generatedImageResult(backgroundMask, this.config);
    const partMaskRes = await generatedImageResult(partMask, this.config);

    // if p5 exists, return p5 image. otherwise, return the pixels.
    result.personMask = personMaskRes.image || personMaskRes.raw;
    result.backgroundMask = bgMaskRes.image || bgMaskRes.raw;
    result.partMask = partMaskRes.image || partMaskRes.raw;

    if (this.config.returnTensors) {
      // return tensors
      result.tensor.personMask = personMask;
      result.tensor.backgroundMask = backgroundMask;
      result.tensor.partMask = partMask;
    }

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
    //const segmentation = await this.model.estimatePersonSegmentation(imgToSegment, this.config.outputStride, this.config.segmentationThreshold)

    const result = {
      segmentation,
      raw: {
        personMask: null,
        backgroundMask: null,
      },
      tensor: {
        personMask: null,
        backgroundMask: null,
      },
      personMask: null,
      backgroundMask: null,
    };
    
    //result.raw.backgroundMask = bp.toMaskImageData(segmentation, true);
    //result.raw.personMask = bp.toMaskImageData(segmentation, false);

    result.raw.backgroundMask = bodySegmentation.toBinaryMask(segmentation, true);
    result.raw.personMask = bodySegmentation.toBinaryMask(segmentation, false);

    // TODO: consider returning the canvas with the bp.drawMask()
    // const bgMaskCanvas = document.createElement('canvas');
    // bgMaskCanvas.width = segmentation.width;
    // bgMaskCanvas.height = segmentation.height;
    // bp.drawMask(bgMaskCanvas, imgToSegment, result.maskBackground, 1, 3, false);

    // const featureMaskCanvas = document.createElement('canvas');
    // featureMaskCanvas.width = segmentation.width;
    // featureMaskCanvas.height = segmentation.height;
    // bp.drawMask(featureMaskCanvas, imgToSegment, result.maskPerson, 1, 3, false);

    // result.backgroundMask = bgMaskCanvas;
    // result.featureMask = featureMaskCanvas;

    const {
      personMask,
      backgroundMask
    } = tf.tidy(() => {
      let normTensor = tf.browser.fromPixels(imgToSegment);
      // create a tensor from the input image
      const alpha = tf.ones([segmentation.height, segmentation.width, 1]).tile([1, 1, 1]).mul(255)
      normTensor = normTensor.concat(alpha, 2)
      // normTensor.print();

      // create a tensor from the segmentation
      let maskPersonTensor = tf.tensor(segmentation.data, [segmentation.height, segmentation.width, 1]);
      let maskBackgroundTensor = tf.tensor(segmentation.data, [segmentation.height, segmentation.width, 1]);

      // multiply the segmentation and the inputImage
      maskPersonTensor = tf.cast(maskPersonTensor.neg().add(1).mul(normTensor), 'int32')
      maskBackgroundTensor = tf.cast(maskBackgroundTensor.mul(normTensor), 'int32')

      return {
        personMask: maskPersonTensor,
        backgroundMask: maskBackgroundTensor,
      }
    })

    const personMaskRes = await generatedImageResult(personMask, this.config);
    const bgMaskRes = await generatedImageResult(backgroundMask, this.config);

    // if p5 exists, return p5 image. otherwise, return the pixels.
    result.personMask = personMaskRes.image || personMaskRes.raw;
    result.backgroundMask = bgMaskRes.image || bgMaskRes.raw;

    if (this.config.returnTensors) {
      // return tensors
      result.tensor.personMask = personMask;
      result.tensor.backgroundMask = backgroundMask;
    }

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
  console.log("Inputs passed to model!");
  const args = handleArguments(...inputs);
  const instance = new BodyPix(args.video, args.options || {}, args.callback);
  return args.callback ? instance : instance.ready;
}

export default bodyPix;
