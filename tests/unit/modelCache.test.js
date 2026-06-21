/**
 * Tests for modelCache.js
 *
 * All tf.io interactions are mocked so these tests run entirely in-process
 * with no network requests and no IndexedDB access.
 *
 * Strategy:
 *  - jest.mock("@tensorflow/tfjs") replaces the whole tf namespace.
 *  - Each test configures the mock return values for the specific scenario
 *    under test (cache hit, cache miss, IndexedDB save failure, etc.).
 */

// ── Mock @tensorflow/tfjs before any imports ─────────────────────────────────
jest.mock("@tensorflow/tfjs", () => {
  // Minimal stub — each test configures the functions it needs.
  return {
    io: {
      getLoadHandlers: jest.fn(),
      getSaveHandlers: jest.fn(),
      http: jest.fn(),
      listModels: jest.fn(),
      removeModel: jest.fn(),
    },
  };
});

import * as tf from "@tensorflow/tfjs";
import {
  CachingIOHandler,
  ensureCached,
  cacheModel,
  listCachedModels,
  clearCache,
  isCached,
} from "../../src/utils/modelCache";
import { ML5_CACHE_PREFIX } from "../../src/utils/modelRegistry";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Minimal fake artifacts object returned by load handlers. */
const FAKE_ARTIFACTS = { modelTopology: {}, weightData: new ArrayBuffer(8) };

/** Build a fake IndexedDB load handler that succeeds. */
function makeIdbLoadHandler(artifacts = FAKE_ARTIFACTS) {
  return { load: jest.fn().mockResolvedValue(artifacts) };
}

/** Build a fake IndexedDB save handler that succeeds. */
function makeIdbSaveHandler() {
  return { save: jest.fn().mockResolvedValue(undefined) };
}

/** Build a fake HTTP handler that succeeds. */
function makeHttpHandler(artifacts = FAKE_ARTIFACTS) {
  return { load: jest.fn().mockResolvedValue(artifacts) };
}

// ── CachingIOHandler ──────────────────────────────────────────────────────────

describe("CachingIOHandler", () => {
  afterEach(() => jest.clearAllMocks());

  describe("cache hit — loads from IndexedDB, skips HTTP", () => {
    it("returns the cached artifacts", async () => {
      const idbHandler = makeIdbLoadHandler();
      tf.io.getLoadHandlers.mockReturnValue([idbHandler]);

      const handler = new CachingIOHandler(
        "https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1",
        "ml5-cache-facemesh-detector"
      );
      const artifacts = await handler.load();

      expect(artifacts).toBe(FAKE_ARTIFACTS);
      expect(idbHandler.load).toHaveBeenCalledTimes(1);
      expect(tf.io.http).not.toHaveBeenCalled();
    });
  });

  describe("cache miss — fetches from HTTP, then saves to IndexedDB", () => {
    it("returns the HTTP artifacts", async () => {
      // IndexedDB load throws → cache miss
      tf.io.getLoadHandlers.mockReturnValue([
        { load: jest.fn().mockRejectedValue(new Error("not found")) },
      ]);

      const httpHandler = makeHttpHandler();
      tf.io.http.mockReturnValue(httpHandler);

      const idbSaveHandler = makeIdbSaveHandler();
      tf.io.getSaveHandlers.mockReturnValue([idbSaveHandler]);

      const handler = new CachingIOHandler(
        "https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1",
        "ml5-cache-facemesh-detector"
      );
      const artifacts = await handler.load();

      expect(artifacts).toBe(FAKE_ARTIFACTS);
      expect(httpHandler.load).toHaveBeenCalledTimes(1);
    });

    it("saves the downloaded artifacts to IndexedDB", async () => {
      tf.io.getLoadHandlers.mockReturnValue([
        { load: jest.fn().mockRejectedValue(new Error("not found")) },
      ]);

      const httpHandler = makeHttpHandler();
      tf.io.http.mockReturnValue(httpHandler);

      const idbSaveHandler = makeIdbSaveHandler();
      tf.io.getSaveHandlers.mockReturnValue([idbSaveHandler]);

      const handler = new CachingIOHandler(
        "https://example.com/model",
        "ml5-cache-test"
      );
      await handler.load();

      expect(idbSaveHandler.save).toHaveBeenCalledWith(FAKE_ARTIFACTS);
    });

    it("appends TFHub search param for TFHub URLs", async () => {
      tf.io.getLoadHandlers.mockReturnValue([
        { load: jest.fn().mockRejectedValue(new Error("miss")) },
      ]);
      const httpHandler = makeHttpHandler();
      tf.io.http.mockReturnValue(httpHandler);
      tf.io.getSaveHandlers.mockReturnValue([makeIdbSaveHandler()]);

      const handler = new CachingIOHandler(
        "https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1",
        "ml5-cache-facemesh-detector"
      );
      await handler.load();

      const fetchedUrl = tf.io.http.mock.calls[0][0];
      expect(fetchedUrl).toContain("model.json?tfjs-format=file");
    });

    it("does NOT append TFHub param for non-TFHub URLs", async () => {
      tf.io.getLoadHandlers.mockReturnValue([
        { load: jest.fn().mockRejectedValue(new Error("miss")) },
      ]);
      const httpHandler = makeHttpHandler();
      tf.io.http.mockReturnValue(httpHandler);
      tf.io.getSaveHandlers.mockReturnValue([makeIdbSaveHandler()]);

      const handler = new CachingIOHandler(
        "https://example.com/model/model.json",
        "ml5-cache-custom"
      );
      await handler.load();

      const fetchedUrl = tf.io.http.mock.calls[0][0];
      expect(fetchedUrl).toBe("https://example.com/model/model.json");
    });
  });

  describe("IndexedDB save failure is non-fatal", () => {
    it("still returns the HTTP artifacts when save throws", async () => {
      tf.io.getLoadHandlers.mockReturnValue([
        { load: jest.fn().mockRejectedValue(new Error("miss")) },
      ]);
      const httpHandler = makeHttpHandler();
      tf.io.http.mockReturnValue(httpHandler);

      // Save handler throws
      tf.io.getSaveHandlers.mockReturnValue([
        { save: jest.fn().mockRejectedValue(new Error("quota exceeded")) },
      ]);

      const handler = new CachingIOHandler(
        "https://example.com/model",
        "ml5-cache-test"
      );

      // Should NOT throw
      await expect(handler.load()).resolves.toBe(FAKE_ARTIFACTS);
    });
  });

  describe("no IndexedDB load handler available → falls back to HTTP", () => {
    it("fetches via HTTP when getLoadHandlers returns empty array", async () => {
      tf.io.getLoadHandlers.mockReturnValue([]); // No IDB handler available
      const httpHandler = makeHttpHandler();
      tf.io.http.mockReturnValue(httpHandler);
      tf.io.getSaveHandlers.mockReturnValue([makeIdbSaveHandler()]);

      const handler = new CachingIOHandler(
        "https://example.com/model",
        "ml5-cache-test"
      );
      const artifacts = await handler.load();

      expect(artifacts).toBe(FAKE_ARTIFACTS);
      expect(httpHandler.load).toHaveBeenCalledTimes(1);
    });
  });
});

// ── ensureCached ──────────────────────────────────────────────────────────────

describe("ensureCached", () => {
  afterEach(() => jest.clearAllMocks());

  describe("already cached", () => {
    it("returns the indexeddb:// URL without fetching", async () => {
      tf.io.listModels.mockResolvedValue({
        "indexeddb://ml5-cache-test": { dateSaved: new Date() },
      });

      const result = await ensureCached(
        "https://example.com/model",
        "ml5-cache-test"
      );

      expect(result).toBe("indexeddb://ml5-cache-test");
      expect(tf.io.http).not.toHaveBeenCalled();
    });
  });

  describe("not yet cached", () => {
    it("downloads via HTTP, saves to IndexedDB, returns indexeddb:// URL", async () => {
      tf.io.listModels.mockResolvedValue({}); // empty — not cached

      const httpHandler = makeHttpHandler();
      tf.io.http.mockReturnValue(httpHandler);

      const idbSaveHandler = makeIdbSaveHandler();
      tf.io.getSaveHandlers.mockReturnValue([idbSaveHandler]);

      const result = await ensureCached(
        "https://example.com/model",
        "ml5-cache-test"
      );

      expect(httpHandler.load).toHaveBeenCalledTimes(1);
      expect(idbSaveHandler.save).toHaveBeenCalledWith(FAKE_ARTIFACTS);
      expect(result).toBe("indexeddb://ml5-cache-test");
    });

    it("falls back to the HTTP URL when no save handler is available", async () => {
      tf.io.listModels.mockResolvedValue({});

      const httpHandler = makeHttpHandler();
      tf.io.http.mockReturnValue(httpHandler);
      tf.io.getSaveHandlers.mockReturnValue([]); // No IDB

      const result = await ensureCached(
        "https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1",
        "ml5-cache-test"
      );

      // Falls back to the fetch URL (includes TFHub param)
      expect(result).toContain("model.json?tfjs-format=file");
    });

    it("falls back to the HTTP URL when save throws", async () => {
      tf.io.listModels.mockResolvedValue({});

      const httpHandler = makeHttpHandler();
      tf.io.http.mockReturnValue(httpHandler);
      tf.io.getSaveHandlers.mockReturnValue([
        { save: jest.fn().mockRejectedValue(new Error("quota exceeded")) },
      ]);

      // Should not throw
      const result = await ensureCached(
        "https://example.com/model",
        "ml5-cache-test"
      );
      expect(typeof result).toBe("string");
    });
  });
});

// ── listCachedModels ──────────────────────────────────────────────────────────

describe("listCachedModels", () => {
  afterEach(() => jest.clearAllMocks());

  it("returns only ml5 entries from tf.io.listModels()", async () => {
    tf.io.listModels.mockResolvedValue({
      [`indexeddb://${ML5_CACHE_PREFIX}-facemesh-detector`]: {
        dateSaved: new Date(),
      },
      [`indexeddb://${ML5_CACHE_PREFIX}-handpose-detector-full`]: {
        dateSaved: new Date(),
      },
      "indexeddb://some-other-app-model": { dateSaved: new Date() },
      "localstorage://other": { dateSaved: new Date() },
    });

    const result = await listCachedModels();

    expect(Object.keys(result)).toHaveLength(2);
    expect(result).toHaveProperty(
      `indexeddb://${ML5_CACHE_PREFIX}-facemesh-detector`
    );
    expect(result).toHaveProperty(
      `indexeddb://${ML5_CACHE_PREFIX}-handpose-detector-full`
    );
    expect(result).not.toHaveProperty("indexeddb://some-other-app-model");
  });

  it("returns an empty object when no ml5 models are cached", async () => {
    tf.io.listModels.mockResolvedValue({
      "indexeddb://other-app-model": { dateSaved: new Date() },
    });

    const result = await listCachedModels();
    expect(result).toEqual({});
  });

  it("returns an empty object when IndexedDB is empty", async () => {
    tf.io.listModels.mockResolvedValue({});
    const result = await listCachedModels();
    expect(result).toEqual({});
  });
});

// ── clearCache ────────────────────────────────────────────────────────────────

describe("clearCache", () => {
  afterEach(() => jest.clearAllMocks());

  it("removes all ml5 entries and returns the count", async () => {
    tf.io.listModels.mockResolvedValue({
      [`indexeddb://${ML5_CACHE_PREFIX}-facemesh-detector`]: {},
      [`indexeddb://${ML5_CACHE_PREFIX}-handpose-detector-full`]: {},
      "indexeddb://unrelated-model": {},
    });
    tf.io.removeModel.mockResolvedValue(undefined);

    const count = await clearCache();

    expect(count).toBe(2);
    // removeModel should have been called exactly for the two ml5 entries
    expect(tf.io.removeModel).toHaveBeenCalledTimes(2);
    expect(tf.io.removeModel).toHaveBeenCalledWith(
      `indexeddb://${ML5_CACHE_PREFIX}-facemesh-detector`
    );
    expect(tf.io.removeModel).toHaveBeenCalledWith(
      `indexeddb://${ML5_CACHE_PREFIX}-handpose-detector-full`
    );
    // Non-ml5 entry must NOT be removed
    expect(tf.io.removeModel).not.toHaveBeenCalledWith(
      "indexeddb://unrelated-model"
    );
  });

  it("returns 0 when there are no ml5 entries to clear", async () => {
    tf.io.listModels.mockResolvedValue({
      "indexeddb://unrelated-model": {},
    });
    tf.io.removeModel.mockResolvedValue(undefined);

    const count = await clearCache();

    expect(count).toBe(0);
    expect(tf.io.removeModel).not.toHaveBeenCalled();
  });

  it("returns 0 when IndexedDB is empty", async () => {
    tf.io.listModels.mockResolvedValue({});
    const count = await clearCache();
    expect(count).toBe(0);
  });
});

// ── isCached ──────────────────────────────────────────────────────────────────

describe("isCached", () => {
  afterEach(() => jest.clearAllMocks());

  describe("faceMesh", () => {
    it("returns true when both detector and landmark are cached", async () => {
      tf.io.listModels.mockResolvedValue({
        [`indexeddb://${ML5_CACHE_PREFIX}-facemesh-detector`]: {},
        [`indexeddb://${ML5_CACHE_PREFIX}-facemesh-landmark-mesh`]: {},
      });
      await expect(isCached("faceMesh")).resolves.toBe(true);
    });

    it("returns false when only detector is cached", async () => {
      tf.io.listModels.mockResolvedValue({
        [`indexeddb://${ML5_CACHE_PREFIX}-facemesh-detector`]: {},
      });
      await expect(isCached("faceMesh")).resolves.toBe(false);
    });

    it("returns true for the attention variant when both parts are cached", async () => {
      tf.io.listModels.mockResolvedValue({
        [`indexeddb://${ML5_CACHE_PREFIX}-facemesh-detector`]: {},
        [`indexeddb://${ML5_CACHE_PREFIX}-facemesh-landmark-attention`]: {},
      });
      await expect(
        isCached("faceMesh", { refineLandmarks: true })
      ).resolves.toBe(true);
    });
  });

  describe("handPose", () => {
    it("returns true when both detector and landmark are cached (full)", async () => {
      tf.io.listModels.mockResolvedValue({
        [`indexeddb://${ML5_CACHE_PREFIX}-handpose-detector-full`]: {},
        [`indexeddb://${ML5_CACHE_PREFIX}-handpose-landmark-full`]: {},
      });
      await expect(isCached("handPose")).resolves.toBe(true);
    });

    it("returns true for the lite variant", async () => {
      tf.io.listModels.mockResolvedValue({
        [`indexeddb://${ML5_CACHE_PREFIX}-handpose-detector-lite`]: {},
        [`indexeddb://${ML5_CACHE_PREFIX}-handpose-landmark-lite`]: {},
      });
      await expect(isCached("handPose", { modelType: "lite" })).resolves.toBe(
        true
      );
    });

    it("returns false when nothing is cached", async () => {
      tf.io.listModels.mockResolvedValue({});
      await expect(isCached("handPose")).resolves.toBe(false);
    });
  });

  describe("bodyPose (MoveNet)", () => {
    it("returns true when the MoveNet model is cached", async () => {
      tf.io.listModels.mockResolvedValue({
        [`indexeddb://${ML5_CACHE_PREFIX}-bodypose-movenet-multipose-lightning`]:
          {},
      });
      await expect(isCached("bodyPose")).resolves.toBe(true);
    });

    it("returns false when MoveNet is not cached", async () => {
      tf.io.listModels.mockResolvedValue({});
      await expect(isCached("bodyPose")).resolves.toBe(false);
    });
  });

  describe("bodyPose-BlazePose", () => {
    it("returns true when both detector and landmark are cached (full)", async () => {
      tf.io.listModels.mockResolvedValue({
        [`indexeddb://${ML5_CACHE_PREFIX}-bodypose-blazepose-detector`]: {},
        [`indexeddb://${ML5_CACHE_PREFIX}-bodypose-blazepose-landmark-full`]:
          {},
      });
      await expect(isCached("bodyPose-BlazePose")).resolves.toBe(true);
    });

    it("returns false when only the detector is cached", async () => {
      tf.io.listModels.mockResolvedValue({
        [`indexeddb://${ML5_CACHE_PREFIX}-bodypose-blazepose-detector`]: {},
      });
      await expect(isCached("bodyPose-BlazePose")).resolves.toBe(false);
    });
  });

  describe("case-insensitivity and name normalization", () => {
    it("accepts 'FACEMESH' (uppercase)", async () => {
      tf.io.listModels.mockResolvedValue({
        [`indexeddb://${ML5_CACHE_PREFIX}-facemesh-detector`]: {},
        [`indexeddb://${ML5_CACHE_PREFIX}-facemesh-landmark-mesh`]: {},
      });
      await expect(isCached("FACEMESH")).resolves.toBe(true);
    });

    it("accepts 'face-mesh' (hyphenated)", async () => {
      tf.io.listModels.mockResolvedValue({
        [`indexeddb://${ML5_CACHE_PREFIX}-facemesh-detector`]: {},
        [`indexeddb://${ML5_CACHE_PREFIX}-facemesh-landmark-mesh`]: {},
      });
      await expect(isCached("face-mesh")).resolves.toBe(true);
    });
  });

  describe("returns false (not throws) when tf.io.listModels fails", () => {
    it("returns false if listModels rejects", async () => {
      tf.io.listModels.mockRejectedValue(new Error("IndexedDB unavailable"));
      await expect(isCached("faceMesh")).resolves.toBe(false);
    });
  });

  describe("unknown model name", () => {
    it("throws for an unknown model name", async () => {
      await expect(isCached("unknownModel")).rejects.toThrow(
        /Unknown model name/i
      );
    });
  });
});

// ── cacheModel ────────────────────────────────────────────────────────────────

describe("cacheModel", () => {
  afterEach(() => jest.clearAllMocks());

  // For cacheModel we just verify that ensureCached-like behaviour is triggered
  // (http handler is called) for each model family.
  function setupForDownload() {
    tf.io.listModels.mockResolvedValue({}); // nothing cached yet
    const httpHandler = makeHttpHandler();
    tf.io.http.mockReturnValue(httpHandler);
    tf.io.getSaveHandlers.mockReturnValue([makeIdbSaveHandler()]);
    return httpHandler;
  }

  it("calls tf.io.http for faceMesh (2 models)", async () => {
    const httpHandler = setupForDownload();
    await cacheModel("faceMesh");
    // detector + landmark
    expect(httpHandler.load).toHaveBeenCalledTimes(2);
  });

  it("calls tf.io.http for handPose (2 models)", async () => {
    const httpHandler = setupForDownload();
    await cacheModel("handPose");
    expect(httpHandler.load).toHaveBeenCalledTimes(2);
  });

  it("calls tf.io.http for bodyPose/MoveNet (1 model)", async () => {
    const httpHandler = setupForDownload();
    await cacheModel("bodyPose");
    expect(httpHandler.load).toHaveBeenCalledTimes(1);
  });

  it("calls tf.io.http for bodyPose-BlazePose (2 models)", async () => {
    const httpHandler = setupForDownload();
    await cacheModel("bodyPose-BlazePose");
    expect(httpHandler.load).toHaveBeenCalledTimes(2);
  });

  it("is case-insensitive for the model name", async () => {
    const httpHandler = setupForDownload();
    await cacheModel("HANDPOSE");
    expect(httpHandler.load).toHaveBeenCalledTimes(2);
  });

  it("skips already-cached models (uses indexeddb URL instead of http)", async () => {
    // Both HandPose models already in cache
    tf.io.listModels.mockResolvedValue({
      "indexeddb://ml5-cache-handpose-detector-full": {},
      "indexeddb://ml5-cache-handpose-landmark-full": {},
    });
    tf.io.http.mockReturnValue(makeHttpHandler());

    await cacheModel("handPose");

    // Already cached → no HTTP downloads needed
    expect(tf.io.http).not.toHaveBeenCalled();
  });

  it("throws for an unknown model name", async () => {
    await expect(cacheModel("unknownModel")).rejects.toThrow(
      /Unknown model name/i
    );
  });
});
