import * as tf from "@tensorflow/tfjs";
import configureBackend from "../../src/utils/configureBackend";

const WEBGPU_VIDEO_TEXTURE_FLAG = "WEBGPU_IMPORT_EXTERNAL_TEXTURE";

const IPHONE_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

const MAC_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.5 Safari/605.1.15";

describe("configureBackend", () => {
  const mockedKeys = [];

  // Simulate the WebGPU backend having registered its flag (default: true),
  // which is what happens once tfjs-backend-webgpu is bundled.
  beforeAll(() => {
    tf.env().registerFlag(WEBGPU_VIDEO_TEXTURE_FLAG, () => true);
  });

  beforeEach(() => {
    tf.env().set(WEBGPU_VIDEO_TEXTURE_FLAG, true);
  });

  // `resetMocks` does not undo defineProperty, so remove the mocked own
  // properties by hand to restore jsdom's defaults.
  afterEach(() => {
    while (mockedKeys.length) delete navigator[mockedKeys.pop()];
  });

  function mockNavigator(props) {
    Object.entries(props).forEach(([key, value]) => {
      Object.defineProperty(navigator, key, { value, configurable: true });
      mockedKeys.push(key);
    });
  }

  it("disables the WebGPU video-texture flag on iOS", () => {
    mockNavigator({ userAgent: IPHONE_USER_AGENT });

    configureBackend();

    // Keeps faceMesh / handPose / bodyPose keypoints aligned on iOS (#302).
    expect(tf.env().getBool(WEBGPU_VIDEO_TEXTURE_FLAG)).toBe(false);
  });

  it("disables the flag on iPadOS, which reports a desktop platform", () => {
    mockNavigator({
      userAgent: MAC_USER_AGENT,
      platform: "MacIntel",
      maxTouchPoints: 5,
    });

    configureBackend();

    expect(tf.env().getBool(WEBGPU_VIDEO_TEXTURE_FLAG)).toBe(false);
  });

  it("leaves the flag alone off iOS so WebGPU keeps its zero-copy path", () => {
    configureBackend();

    expect(tf.env().getBool(WEBGPU_VIDEO_TEXTURE_FLAG)).toBe(true);
  });

  it("is safe to call again and keeps the flag off", () => {
    mockNavigator({ userAgent: IPHONE_USER_AGENT });

    configureBackend();

    expect(() => configureBackend()).not.toThrow();
    expect(tf.env().getBool(WEBGPU_VIDEO_TEXTURE_FLAG)).toBe(false);
  });

  it("logs a notice on iOS when WebGPU is available", () => {
    const infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    mockNavigator({ userAgent: IPHONE_USER_AGENT, gpu: {} });

    configureBackend();

    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy.mock.calls[0][0]).toContain("importExternalTexture");
  });

  it("does not log a notice off iOS", () => {
    const infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});

    configureBackend();

    expect(infoSpy).not.toHaveBeenCalled();
  });
});
