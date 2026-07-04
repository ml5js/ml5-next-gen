import * as tf from "@tensorflow/tfjs";

const WEBGPU_VIDEO_TEXTURE_FLAG = "WEBGPU_IMPORT_EXTERNAL_TEXTURE";

/**
 * Apply ml5's default TensorFlow.js backend configuration.
 *
 * Works around a TensorFlow.js WebGPU bug where video frames imported through
 * `importExternalTexture` are read with the wrong orientation on iOS / WebKit.
 * This makes faceMesh, handPose, and bodyPose keypoints appear rotated and
 * misaligned with the video (ml5 issue #302). Disabling the flag makes the
 * WebGPU backend copy video frames instead, which keeps keypoints aligned while
 * preserving the WebGPU backend everywhere else.
 *
 * The flag is set globally and unconditionally (it only affects the WebGPU
 * backend, so it is harmless when WebGL is active). Safe to call more than once.
 *
 * Reported upstream as https://github.com/tensorflow/tfjs/issues/8733 — the
 * workaround can be removed once tf.js (or WebKit) fixes the import path.
 *
 * @return {void}
 */
export default function configureBackend() {
  try {
    tf.env().set(WEBGPU_VIDEO_TEXTURE_FLAG, false);
  } catch (e) {
    // The WebGPU backend (and therefore the flag) is not present in this
    // build, so there is nothing to work around.
    return;
  }

  // Only surface the notice on iOS / iPadOS with WebGPU available — the
  // platforms where the misalignment occurs. Elsewhere the flag change is
  // invisible, and logging it for every WebGPU-capable browser is just noise.
  // (iPadOS reports itself as "MacIntel", hence the maxTouchPoints check.)
  if (typeof navigator !== "undefined" && navigator.gpu) {
    const isAppleTouchDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isAppleTouchDevice) {
      console.info(
        "ml5.js: disabled WebGPU importExternalTexture so video keypoints stay aligned. " +
          "See https://github.com/ml5js/ml5-next-gen/issues/302"
      );
    }
  }
}
