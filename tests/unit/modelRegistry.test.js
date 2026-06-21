import {
  ML5_CACHE_PREFIX,
  getFaceMeshUrls,
  getFaceMeshCacheKeys,
  getHandPoseUrls,
  getHandPoseCacheKeys,
  getBodyPoseMoveNetUrl,
  getBodyPoseMoveNetCacheKey,
  getBodyPoseBlazePoseUrls,
  getBodyPoseBlazePoseCacheKeys,
} from "../../src/utils/modelRegistry";

describe("modelRegistry", () => {
  // ── ML5_CACHE_PREFIX ────────────────────────────────────────────────────────
  describe("ML5_CACHE_PREFIX", () => {
    it("is a non-empty string", () => {
      expect(typeof ML5_CACHE_PREFIX).toBe("string");
      expect(ML5_CACHE_PREFIX.length).toBeGreaterThan(0);
    });

    it("equals 'ml5-cache'", () => {
      expect(ML5_CACHE_PREFIX).toBe("ml5-cache");
    });
  });

  // ── FaceMesh ────────────────────────────────────────────────────────────────
  describe("getFaceMeshUrls", () => {
    it("returns the default (mesh) URLs when called with no options", () => {
      const { detector, landmark } = getFaceMeshUrls();
      expect(detector).toContain("tfhub.dev");
      expect(detector).toContain("face_detection");
      expect(landmark).toContain("face_mesh");
    });

    it("returns mesh URLs when refineLandmarks is false", () => {
      const { landmark } = getFaceMeshUrls({ refineLandmarks: false });
      expect(landmark).toContain("face_mesh");
      expect(landmark).not.toContain("attention_mesh");
    });

    it("returns attention URLs when refineLandmarks is true", () => {
      const { landmark } = getFaceMeshUrls({ refineLandmarks: true });
      expect(landmark).toContain("attention_mesh");
      expect(landmark).not.toContain("face_mesh");
    });

    it("returns the same detector URL regardless of refineLandmarks", () => {
      const a = getFaceMeshUrls({ refineLandmarks: false });
      const b = getFaceMeshUrls({ refineLandmarks: true });
      expect(a.detector).toBe(b.detector);
    });

    it("returns objects with detector and landmark keys", () => {
      const urls = getFaceMeshUrls();
      expect(urls).toHaveProperty("detector");
      expect(urls).toHaveProperty("landmark");
    });
  });

  describe("getFaceMeshCacheKeys", () => {
    it("returns keys prefixed with ML5_CACHE_PREFIX", () => {
      const keys = getFaceMeshCacheKeys();
      expect(keys.detector).toMatch(new RegExp(`^${ML5_CACHE_PREFIX}`));
      expect(keys.landmark).toMatch(new RegExp(`^${ML5_CACHE_PREFIX}`));
    });

    it("returns the mesh landmark key when refineLandmarks is false", () => {
      const { landmark } = getFaceMeshCacheKeys({ refineLandmarks: false });
      expect(landmark).toContain("mesh");
      expect(landmark).not.toContain("attention");
    });

    it("returns the attention landmark key when refineLandmarks is true", () => {
      const { landmark } = getFaceMeshCacheKeys({ refineLandmarks: true });
      expect(landmark).toContain("attention");
    });

    it("returns different landmark keys for the two variants", () => {
      const mesh = getFaceMeshCacheKeys({ refineLandmarks: false });
      const attention = getFaceMeshCacheKeys({ refineLandmarks: true });
      expect(mesh.landmark).not.toBe(attention.landmark);
    });

    it("returns the same detector key regardless of refineLandmarks", () => {
      const mesh = getFaceMeshCacheKeys({ refineLandmarks: false });
      const attention = getFaceMeshCacheKeys({ refineLandmarks: true });
      expect(mesh.detector).toBe(attention.detector);
    });
  });

  // ── HandPose ────────────────────────────────────────────────────────────────
  describe("getHandPoseUrls", () => {
    it("defaults to the full model URLs", () => {
      const { detector, landmark } = getHandPoseUrls();
      expect(detector).toContain("full");
      expect(landmark).toContain("full");
    });

    it("returns full URLs when modelType is 'full'", () => {
      const { detector, landmark } = getHandPoseUrls({ modelType: "full" });
      expect(detector).toContain("full");
      expect(landmark).toContain("full");
    });

    it("returns lite URLs when modelType is 'lite'", () => {
      const { detector, landmark } = getHandPoseUrls({ modelType: "lite" });
      expect(detector).toContain("lite");
      expect(landmark).toContain("lite");
    });

    it("returns different detector URLs for full vs lite", () => {
      const full = getHandPoseUrls({ modelType: "full" });
      const lite = getHandPoseUrls({ modelType: "lite" });
      expect(full.detector).not.toBe(lite.detector);
      expect(full.landmark).not.toBe(lite.landmark);
    });

    it("returns TFHub URLs", () => {
      const { detector, landmark } = getHandPoseUrls();
      expect(detector).toContain("tfhub.dev");
      expect(landmark).toContain("tfhub.dev");
    });
  });

  describe("getHandPoseCacheKeys", () => {
    it("defaults to full model keys", () => {
      const { detector, landmark } = getHandPoseCacheKeys();
      expect(detector).toContain("full");
      expect(landmark).toContain("full");
    });

    it("returns lite keys when modelType is 'lite'", () => {
      const { detector, landmark } = getHandPoseCacheKeys({
        modelType: "lite",
      });
      expect(detector).toContain("lite");
      expect(landmark).toContain("lite");
    });

    it("keys are prefixed with ML5_CACHE_PREFIX", () => {
      const keys = getHandPoseCacheKeys();
      expect(keys.detector).toMatch(new RegExp(`^${ML5_CACHE_PREFIX}`));
      expect(keys.landmark).toMatch(new RegExp(`^${ML5_CACHE_PREFIX}`));
    });

    it("full and lite keys are different", () => {
      const full = getHandPoseCacheKeys({ modelType: "full" });
      const lite = getHandPoseCacheKeys({ modelType: "lite" });
      expect(full.detector).not.toBe(lite.detector);
      expect(full.landmark).not.toBe(lite.landmark);
    });
  });

  // ── BodyPose MoveNet ─────────────────────────────────────────────────────────
  describe("getBodyPoseMoveNetUrl", () => {
    it("defaults to MULTIPOSE_LIGHTNING", () => {
      const url = getBodyPoseMoveNetUrl();
      expect(url).toContain("multipose");
      expect(url).toContain("lightning");
    });

    it("returns the correct URL for SINGLEPOSE_LIGHTNING", () => {
      const url = getBodyPoseMoveNetUrl({ modelType: "SINGLEPOSE_LIGHTNING" });
      expect(url).toContain("singlepose");
      expect(url).toContain("lightning");
    });

    it("returns the correct URL for SINGLEPOSE_THUNDER", () => {
      const url = getBodyPoseMoveNetUrl({ modelType: "SINGLEPOSE_THUNDER" });
      expect(url).toContain("singlepose");
      expect(url).toContain("thunder");
    });

    it("returns the correct URL for MULTIPOSE_LIGHTNING", () => {
      const url = getBodyPoseMoveNetUrl({ modelType: "MULTIPOSE_LIGHTNING" });
      expect(url).toContain("multipose");
      expect(url).toContain("lightning");
    });

    it("returns a TFHub URL", () => {
      const url = getBodyPoseMoveNetUrl();
      expect(url).toContain("tfhub.dev");
    });

    it("returns different URLs for different modelTypes", () => {
      const a = getBodyPoseMoveNetUrl({ modelType: "SINGLEPOSE_LIGHTNING" });
      const b = getBodyPoseMoveNetUrl({ modelType: "SINGLEPOSE_THUNDER" });
      const c = getBodyPoseMoveNetUrl({ modelType: "MULTIPOSE_LIGHTNING" });
      expect(a).not.toBe(b);
      expect(a).not.toBe(c);
      expect(b).not.toBe(c);
    });
  });

  describe("getBodyPoseMoveNetCacheKey", () => {
    it("defaults to MULTIPOSE_LIGHTNING key", () => {
      const key = getBodyPoseMoveNetCacheKey();
      expect(key).toContain("multipose");
      expect(key).toContain("lightning");
    });

    it("is prefixed with ML5_CACHE_PREFIX", () => {
      const key = getBodyPoseMoveNetCacheKey();
      expect(key).toMatch(new RegExp(`^${ML5_CACHE_PREFIX}`));
    });

    it("uses hyphens, not underscores", () => {
      const key = getBodyPoseMoveNetCacheKey({
        modelType: "SINGLEPOSE_LIGHTNING",
      });
      expect(key).not.toContain("_");
    });

    it("returns different keys for different modelTypes", () => {
      const a = getBodyPoseMoveNetCacheKey({
        modelType: "SINGLEPOSE_LIGHTNING",
      });
      const b = getBodyPoseMoveNetCacheKey({ modelType: "SINGLEPOSE_THUNDER" });
      const c = getBodyPoseMoveNetCacheKey({
        modelType: "MULTIPOSE_LIGHTNING",
      });
      expect(a).not.toBe(b);
      expect(a).not.toBe(c);
    });
  });

  // ── BodyPose BlazePose ───────────────────────────────────────────────────────
  describe("getBodyPoseBlazePoseUrls", () => {
    it("defaults to the full landmark model", () => {
      const { landmark } = getBodyPoseBlazePoseUrls();
      expect(landmark).toContain("full");
    });

    it("returns lite landmark URL for modelType 'lite'", () => {
      const { landmark } = getBodyPoseBlazePoseUrls({ modelType: "lite" });
      expect(landmark).toContain("lite");
    });

    it("returns heavy landmark URL for modelType 'heavy'", () => {
      const { landmark } = getBodyPoseBlazePoseUrls({ modelType: "heavy" });
      expect(landmark).toContain("heavy");
    });

    it("returns the same detector URL for all modelTypes", () => {
      const a = getBodyPoseBlazePoseUrls({ modelType: "lite" });
      const b = getBodyPoseBlazePoseUrls({ modelType: "full" });
      const c = getBodyPoseBlazePoseUrls({ modelType: "heavy" });
      expect(a.detector).toBe(b.detector);
      expect(b.detector).toBe(c.detector);
    });

    it("returns TFHub URLs", () => {
      const { detector, landmark } = getBodyPoseBlazePoseUrls();
      expect(detector).toContain("tfhub.dev");
      expect(landmark).toContain("tfhub.dev");
    });

    it("returns different landmark URLs for lite/full/heavy", () => {
      const lite = getBodyPoseBlazePoseUrls({ modelType: "lite" });
      const full = getBodyPoseBlazePoseUrls({ modelType: "full" });
      const heavy = getBodyPoseBlazePoseUrls({ modelType: "heavy" });
      expect(lite.landmark).not.toBe(full.landmark);
      expect(full.landmark).not.toBe(heavy.landmark);
    });
  });

  describe("getBodyPoseBlazePoseCacheKeys", () => {
    it("defaults to full landmark key", () => {
      const { landmark } = getBodyPoseBlazePoseCacheKeys();
      expect(landmark).toContain("full");
    });

    it("keys are prefixed with ML5_CACHE_PREFIX", () => {
      const keys = getBodyPoseBlazePoseCacheKeys();
      expect(keys.detector).toMatch(new RegExp(`^${ML5_CACHE_PREFIX}`));
      expect(keys.landmark).toMatch(new RegExp(`^${ML5_CACHE_PREFIX}`));
    });

    it("returns different landmark keys for lite/full/heavy", () => {
      const lite = getBodyPoseBlazePoseCacheKeys({ modelType: "lite" });
      const full = getBodyPoseBlazePoseCacheKeys({ modelType: "full" });
      const heavy = getBodyPoseBlazePoseCacheKeys({ modelType: "heavy" });
      expect(lite.landmark).not.toBe(full.landmark);
      expect(full.landmark).not.toBe(heavy.landmark);
    });

    it("returns the same detector key regardless of modelType", () => {
      const lite = getBodyPoseBlazePoseCacheKeys({ modelType: "lite" });
      const full = getBodyPoseBlazePoseCacheKeys({ modelType: "full" });
      const heavy = getBodyPoseBlazePoseCacheKeys({ modelType: "heavy" });
      expect(lite.detector).toBe(full.detector);
      expect(full.detector).toBe(heavy.detector);
    });
  });
});
