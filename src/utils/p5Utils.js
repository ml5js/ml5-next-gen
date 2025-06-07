// Copyright (c) 2018 - 2024 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

function isP5Constructor(source) {
  return Boolean(
    source &&
      typeof source === "function" &&
      source.prototype &&
      source.prototype.registerMethod
  );
}

function isP5Extensions(source) {
  return Boolean(source && typeof source.loadImage === "function");
}

class P5Util {
  constructor() {
    /**
     * @type {boolean}
     */
    this.didSetupPreload = false;

    /**
     * The `p5` variable, which can be instantiated via `new p5()` and has a `.prototype` property.
     * In browser environments this is `window.p5`.
     * When loading p5 via npm it must be manually provided using `ml5.setP5()`.
     */
    this.p5Constructor = undefined;
    /**
     * Object with all of the constants (HSL etc.) and methods like loadImage().
     * In global mode, this is the Window object.
     */
    this.p5Extensions = undefined;

    /**
     * Keep a reference to the arguments of `shouldPreload()` so that preloads
     * can be set up after the fact if p5 becomes available.
     */
    this.ml5Library = undefined;
    this.methodsToPreload = [];

    // Check for p5 on the window.
    this.findAndSetP5();
  }

  /**
   * @private
   * Check the window or globalThis for p5.
   * Can run this repeatedly in case p5 is loaded after ml5 is loaded.
   */
  findAndSetP5() {
    let source;
    if (typeof window !== "undefined") {
      source = window;
    } else if (typeof globalThis !== "undefined") {
      source = globalThis;
    }

    if (!source) return;

    if (isP5Constructor(source.p5)) {
      this.p5Constructor = source.p5;
    }
    if (isP5Extensions(source)) {
      this.p5Extensions = source;
    }
  }

  /**
   * @public
   * Set p5 in order to enable p5 features throughout ml5.
   * This manual setup is only necessary when importing `p5` as a module
   * rather than loading it on the window.
   * Can be used in ml5 unit tests to check p5 behavior.
   *
   * @example
   * import p5 from "p5";
   * import ml5 "ml5";
   *
   * ml5.setP5(p5);
   *
   * @param {import('p5')} p5
   */
  setP5(p5) {
    if (isP5Constructor(p5)) {
      this.p5Constructor = p5;
      this.p5Extensions = p5.prototype;
    } else {
      console.warn("Invalid p5 object provided to ml5.setP5().");
    }
  }

  /**
   * @internal
   * Register a preload function for a model. If p5 is not loaded or the sketch is not created,
   * the model will be returned as is. Otherwise, the model will be wrapped to increment and
   * decrement the p5 preload counter when called, which is for allowing the model to be used in
   * p5 preload function.
   * @param {Function} model - The model function to register.
   * @returns {Function} The wrapped model function.
   */
  maybeRegisterPreload(model) {
    const p5 = this.p5Constructor;
    if (!p5) return model;

    let sketchCreated = false;
    let p5Instance;
    let loaded = false;

    // Function to be called when a sketch is created.
    p5.prototype.registerMethod("init", function () {
      p5Instance = this;
      sketchCreated = true;
    });

    // Function to be called when a sketch is destroyed.
    p5.prototype.registerMethod("remove", function () {
      sketchCreated = false;
      p5Instance = undefined;
    });

    return function (...args) {
      if (!sketchCreated || loaded) return model(...args);
      loaded = true;

      p5Instance._incrementPreload();
      const result = model(...args);
      result.ready.then(() => p5Instance._decrementPreload());
      return result;
    };
  }

  /**
   * @internal
   * Dynamic getter checks if p5 is loaded and will return undefined if p5 cannot be found,
   * or will return an object containing all of the global p5 properties.
   * @returns {import('p5').p5InstanceExtensions | undefined}
   */
  get p5Instance() {
    if (!this.p5Extensions) {
      this.findAndSetP5();
    }
    return this.p5Extensions;
  }

  /**
   * This function will check if the p5 is in the environment
   * Either it is in the p5Instance mode OR it is in the window
   * @returns {boolean} if it is in p5
   */
  checkP5() {
    return !!this.p5Instance;
  }

  /**
   * Convert a canvas to a Blob object.
   * @param {HTMLCanvasElement} inputCanvas
   * @returns {Promise<Blob>}
   */
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["getBlob"] }] */
  getBlob(inputCanvas) {
    return new Promise((resolve, reject) => {
      inputCanvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas could not be converted to Blob."));
        }
      });
    });
  }

  /**
   * Load a p5.Image from a URL in an async way.
   * @param {string} url
   * @return {Promise<import('p5').Image>}
   */
  loadAsync(url) {
    return new Promise((resolve, reject) => {
      this.p5Instance.loadImage(
        url,
        (img) => {
          resolve(img);
        },
        () => {
          reject(new Error(`Could not load image from url ${url}`));
        }
      );
    });
  }

  /**
   * convert raw bytes to blob object
   * @param {number[] | Uint8ClampedArray | ArrayLike<number>} raws
   * @param {number} width
   * @param {number} height
   * @returns {Promise<Blob>}
   */
  async rawToBlob(raws, width, height) {
    const arr = Array.from(raws);
    const canvas = document.createElement("canvas"); // Consider using offScreenCanvas when it is ready?
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    const { data } = imgData;

    for (let i = 0; i < width * height * 4; i += 1) data[i] = arr[i];
    ctx.putImageData(imgData, 0, 0);

    return this.getBlob(canvas);
  }

  /**
   * convert ImageData to blob object
   * @param {ImageData} segmentationResult
   * @param {number} width
   * @param {number} height
   * @returns {Promise<Blob>}
   */
  async ImageDataToBlob(segmentationResult, width, height) {
    const canvas = document.createElement("canvas"); // Consider using offScreenCanvas when it is ready?
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    ctx.putImageData(segmentationResult, 0, 0);

    return this.getBlob(canvas);
  }

  /**
   * Convert Blob to P5.Image
   * @param {Blob} blob
   * Note: may want to reject instead of returning null.
   * @returns {Promise<import('p5').Image | null>}
   */
  async blobToP5Image(blob) {
    if (this.checkP5() && typeof URL !== "undefined") {
      return this.loadAsync(URL.createObjectURL(blob));
    }
    return null;
  }
}

const p5Utils = new P5Util();

export default p5Utils;
