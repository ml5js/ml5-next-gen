// Copyright (c) 2018-2024 ml5
//
// This software is open source and the ml5.js license.
// https://github.com/ml5js/ml5-next-gen/blob/88f7a3b260c59de84a7e4dab181cd3f69ba19bb1/LICENSE.md

import * as tf from "@tensorflow/tfjs";
import p5Utils from "./p5Utils";

/**
 * @typedef {Object} GeneratedImageResult
 * @property {ImageData} segmentationResult - raw segmentation results
 * @property {Blob} blob - image blob
 * @property {p5.Image | null} image - p5 Image, if p5 is available.
 */

/**
 * Utility function for returning an image in multiple formats.
 *
 * Takes a Tensor and returns an object containing `blob`, `raw`, `image`, and optionally `tensor`.
 * Will dispose of the Tensor if not returning it.
 *
 * Accepts options as an object with property `returnTensors` so that models can pass this.config.
 *
 * @param {ImageData}
 * @return {Promise<GeneratedImageResult>}
 */
export default async function generatedImageResult(segmentationResult) {
  const height = segmentationResult.height;
  const width = segmentationResult.width;
  const blob = await p5Utils.ImageDataToBlob(segmentationResult, width, height);
  const image = await p5Utils.blobToP5Image(blob);
  return { segmentationResult, blob, image };
}
