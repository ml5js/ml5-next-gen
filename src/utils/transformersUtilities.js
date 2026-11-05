/**
 * Chooses the best available device for running a transformers.js model.
 * Prefers WebGPU for better performance, falls back to WASM.
 * @returns {string} the device to use ("webgpu" or "wasm").
 */
function chooseDevice() {
  if (typeof navigator !== "undefined" && navigator.gpu) return "webgpu";
  return "wasm";
}

/**
 * Chooses the best dtype for a transformers.js model based on the device it runs on.
 * By default, uses half precision on WebGPU and 8-bit quantization on other devices.
 * You can override the defaults by providing an object with the desired dtypes for each device.
 * @param {string} device - the device the model will run on.
 * @param {object} defaults - an object containing the default dtypes for each device.
 * @param {string} defaults.webgpu - the default dtype for WebGPU.
 * @param {string} defaults.general - the default dtype for other devices.
 * @returns {string} the dtype to use (by default "fp16" or "q8").
 */
function chooseDtypeForDevice(
  device,
  defaults = { webgpu: "fp16", general: "q8" }
) {
  if (device === "webgpu") return defaults.webgpu;
  return defaults.general;
}

/**
 * Wraps the chooseDtypeForDevice function to be used easily with handleOptions.
 * Can be passed directly as a handleOptions default: `default: chooseDtype`,
 * because it will receive a filtered options object containing the selected `device`.
 * Make sure `device` is listed before `dtype` in handleOptions so it is already set.
 * @param {object} options - the filtered options object, containing a `device` property.
 * @param {object} [defaults] - optional default dtypes for each device, see `chooseDtypeForDevice`.
 * @returns {string} the dtype to use (by default "fp16" or "q8").
 */
function chooseDtype(options, defaults) {
  return chooseDtypeForDevice(options.device, defaults);
}

export { chooseDevice, chooseDtype, chooseDtypeForDevice };
