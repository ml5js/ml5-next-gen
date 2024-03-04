import * as tf from '@tensorflow/tfjs';
import handleArguments from '../utils/handleArguments';
import { mediaReady } from '../utils/imageUtilities';

/**
 * @typedef {Object} SpecificDetectorImplementation
 *
 * @property {Promise<boolean>} ready - lets the parent detector know that the
 * specific implementation is ready.
 *
 * @property {(input: tf.Tensor3D) => Promise<Array>} detect - core detection method.
 * the ImageDetector will call the `detect` method of the specific implementation.
 * It should accept a TensorFlow tensor?? or an image??
 * And return an array of detections??
 */

/**
 * Helper class for handling the public API of detector models (facemesh, etc.)
 * Exposes the public methods for single and continuous detection.
 * Executes the detection using whatever model is passed to the constructor.
 */
export default class ImageDetector {

  /**
   * @param {SpecificDetectorImplementation} specificImplementation
   */
  constructor(specificImplementation) {
    /**
     * @type {SpecificDetectorImplementation}
     */
    this.implementation = specificImplementation;

    /**
     * @type {Promise<boolean>}
     * TODO: do we need to handle onReady callbacks?
     */
    this.ready = this.implementation.ready;

    /**
     * @type {InputImage | null}
     * The video or image used for continuous detection.
     */
    this.detectMedia = null;
    /**
     * @type {function | null}
     * Function to call with the results of each detection.
     */
    this.detectCallback = null;

    // flags for detectStart() and detectStop()
    /**
     * @type {boolean}
     * true when detection loop is running
     */
    this.detecting = false;
    /**
     * @type {boolean}
     * Signal to stop the loop
     */
    this.signalStop = false;
    /**
     * @type {"start" | "stop" | ""}
     * Track previous call to detectStart() or detectStop(),
     * used for giving warning messages when detectStart() is called twice in a row.
     */
    this.prevCall = "";
  }

  /**
   * Repeatedly output detections through a callback function
   * @param {*} media - An HTML or p5.js image, video, or canvas element to run the detection on.
   * @param {function} callback - A callback function to handle each detection.
   * @void
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
        "detectStart() was called more than once without calling detectStop(). The latest detectStart() call will be used and the previous calls will be  ignored."
      );
    }
    this.prevCall = "start";
  }

  /**
   * Stop the detection loop before next detection runs.
   */
  detectStop() {
    if (this.detecting) this.signalStop = true;
    this.prevCall = "stop";
  }

  /**
   * Internal function to call the detect method repeatedly in a loop
   * Can be started by detectStart() and terminated by detectStop()
   *
   * @private
   */
  async detectLoop() {
    // Make sure that both the model and the media are loaded before beginning.
    await Promise.all([
      this.ready,
      mediaReady(this.detectMedia, false)
    ]);

    // Continuous detection loop.
    while (!this.signalStop) {
      const result = await this.implementation.detect(this.detectMedia);
      this.detectCallback(result);
      // wait for the frame to update
      await tf.nextFrame();
    }

    // Update flags when done.
    this.detecting = false;
    this.signalStop = false;
  }

  /**
   * Asynchronously output a single detection result when called
   * @param {*} media - An HTML or p5.js image, video, or canvas element to run the detection on.
   * @param {function} [callback] - A callback function to handle the detection results.
   * @returns {Promise<Array>} an array of detections.
   */
  async detect(...inputs) {
    // Parse out the input parameters
    const argumentObject = handleArguments(...inputs);
    argumentObject.require(
      "image",
      "An html or p5.js image, video, or canvas element argument is required for detect()."
    );
    const { image, callback } = argumentObject;

    // Make sure that both the model and the media are loaded before beginning.
    await Promise.all([
      this.ready,
      mediaReady(this.detectMedia, false)
    ]);

    const result = await this.implementation.detect(image);
    if (typeof callback === "function") callback(result);
    return result;
  }

}
