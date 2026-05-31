import * as tf from "@tensorflow/tfjs";
import configureBackend from "../../src/utils/configureBackend";

const WEBGPU_VIDEO_TEXTURE_FLAG = "WEBGPU_IMPORT_EXTERNAL_TEXTURE";

describe("configureBackend", () => {
  it("forces the WebGPU video-texture flag off when it is registered", () => {
    // Simulate the WebGPU backend having registered its flag (default: true),
    // which is what happens once tfjs-backend-webgpu is bundled.
    tf.env().registerFlag(WEBGPU_VIDEO_TEXTURE_FLAG, () => true);
    expect(tf.env().getBool(WEBGPU_VIDEO_TEXTURE_FLAG)).toBe(true);

    configureBackend();

    // Keeps faceMesh / handPose / bodyPose keypoints aligned on iOS (#302).
    expect(tf.env().getBool(WEBGPU_VIDEO_TEXTURE_FLAG)).toBe(false);
  });

  it("is safe to call again and keeps the flag off", () => {
    expect(() => configureBackend()).not.toThrow();
    expect(tf.env().getBool(WEBGPU_VIDEO_TEXTURE_FLAG)).toBe(false);
  });
});
