// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
    COCO-SSD Object detection model
    Wraps the coco-ssd model in tfjs to be used in ml5
*/
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { mediaReady } from "../utils/imageUtilities";

const DEFAULTS = {
  base: "lite_mobilenet_v2",
  modelUrl: undefined,
};

export class CocoSsd {
  constructor(options = {}) {
    this.model = null;
    this.config = {
      base: options.base || DEFAULTS.base,
      modelUrl: options.modelUrl || DEFAULTS.modelUrl,
    };
  }

  async load() {
    await tf.setBackend("webgl"); // this line resolves warning : performance is poor on webgpu backend
    await tf.ready();

    this.model = await cocoSsd.load(this.config);
    return this;
  }

  /**
   * Detect objects that are in the image/video/canvas
   * @param {HTMLVideoElement|HTMLImageElement|HTMLCanvasElement|ImageData} imgToPredict - Subject of the detection.
   * @returns {Array} Array of detection detections
   */
  async detect(imgToPredict) {
    mediaReady(imgToPredict, true);
    
    await tf.nextFrame();

    const detections = await this.model.detect(imgToPredict);
    const formattedDetections = detections.map(prediction => {
      return {
        label: prediction.class,
        confidence: prediction.score,
        x: prediction.bbox[0],
        y: prediction.bbox[1],
        width: prediction.bbox[2],
        height: prediction.bbox[3],
        normalized: {
          x: prediction.bbox[0] / imgToPredict.width,
          y: prediction.bbox[1] / imgToPredict.height,
          width: prediction.bbox[2] / imgToPredict.width,
          height: prediction.bbox[3] / imgToPredict.height,
        },
      };
    });

    return formattedDetections;
  }
}

export async function load(modelConfig = {}) {
  const cocoSsdInstance = new CocoSsd(modelConfig);
  await cocoSsdInstance.load();
  return cocoSsdInstance;
}