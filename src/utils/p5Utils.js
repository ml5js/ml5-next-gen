// Copyright (c) 2018 - 2024 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

function isP5Constructor(source) {
  return Boolean(
    source &&
      typeof source === "function" &&
      source.prototype &&
      source.prototype.registerMethod // p5 1.x only
  );
}

function isP5Extensions(source) {
  return Boolean(source && typeof source.loadImage === "function");
}

function promisifyModel(model) {
  return (...args) => {
    const result = model(...args);
    if (result.ready) return result.ready.then(() => result);
    return Promise.resolve(result);
  };
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
     * Keep a reference to the arguments of `setupP5Integration()` so that preloads
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
      this.registerPreloads();
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
      this.registerPreloads();
    } else {
      console.warn("Invalid p5 object provided to ml5.setP5().");
    }
  }

  /**
   * @internal
   * Pass in the ml5 methods which require p5 preload behavior.
   * Preload functions must return an object with a property `ready` which is a `Promise`.
   * Preloading will be set up immediately if p5 is available on the window.
   * Store the references in case p5 is added later.
   *
   * @param {*} ml5Library - the `ml5` variable.
   * @param {Array<string>} withPreloadMethods - an array of ml5 functions to preload.
   * @param {Array<string>} withoutAsyncMethods - an array of ml5 functions to not promiseify.
   */
  setupP5Integration(ml5Library, withPreloadMethods, withoutAsyncMethods) {
    this.methodsToPreload = withPreloadMethods;
    this.ml5Library = ml5Library;

    // checkP5 returns true only with p5 1.x, because p5 2.x does not have registerMethod method,
    // which is checked in isP5Constructor function.
    if (this.checkP5()) {
      this.registerPreloads();
    } else {
      this.registerAsyncConstructors(ml5Library, withoutAsyncMethods);
    }
  }

  /**
   * @private
   * Register the async constructor for the ml5 library.
   * @param {*} ml5Library - the `ml5` variable.
   * @param {Array<string>} withoutAsyncMethods - an array of ml5 functions to not promiseify.
   */
  registerAsyncConstructors(ml5Library, withoutAsyncMethods) {
    this.methodsToPreload.forEach((method) => {
      if (withoutAsyncMethods.includes(method)) return;
      ml5Library[method] = promisifyModel(ml5Library[method]);
    });
  }

  /**
   * @private
   * Execute the p5 preload setup using the stored references, provided by setupP5Integration().
   * Won't do anything if `setupP5Integration()` has not been called or if p5 is not found.
   */
  registerPreloads() {
    if (this.didSetupPreload) return;
    const p5 = this.p5Constructor;
    const ml5 = this.ml5Library;
    const preloadMethods = this.methodsToPreload;
    if (!p5 || !ml5) return;

    // Must shallow copy so that it doesn't reference the replaced method.
    const original = { ...ml5 };
    // Must alias `this` so that it can be used inside functions with their own `this` context.
    const self = this;

    // Function to be called when a sketch is created, either in global or instance mode.
    p5.prototype.ml5Init = function () {
      // Bind to this specific p5 instance.
      const increment = this._incrementPreload.bind(this);
      const decrement = this._decrementPreload.bind(this);
      // Replace each preloaded on the ml5 object with a wrapped version which
      // increments and decrements the p5 preload counter when called.
      preloadMethods.forEach((method) => {
        ml5[method] = function (...args) {
          increment();
          const result = original[method](...args);
          result.ready.then(() => {
            decrement();
          });
          return result;
        };
      });
      self.didSetupPreload = true;
    };

    // Function to be called when a sketch is destroyed.
    p5.prototype.ml5Remove = function () {
      // Resets each ml5 method back to its original version.
      preloadMethods.forEach((method) => {
        ml5[method] = original[method];
      });
      self.didSetupPreload = false;
    };

    p5.prototype.registerMethod("init", p5.prototype.ml5Init);
    p5.prototype.registerMethod("remove", p5.prototype.ml5Remove);
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
