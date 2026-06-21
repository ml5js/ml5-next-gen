/**
 * @license
 * Copyright (c) 2020-2024 ml5
 * This software is released under the ml5.js License.
 * https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 */

/**
 * @file modelCache.js
 *
 * Offline caching infrastructure for ml5 models using IndexedDB.
 *
 * Two caching strategies are provided:
 *
 * 1. CachingIOHandler — a tf.io.IOHandler that transparently loads from
 *    IndexedDB on cache hit, or from HTTP on cache miss (then saves to
 *    IndexedDB). Used with models whose URL options accept an IOHandler
 *    object (FaceMesh, BodyPose/MoveNet, BodyPose/BlazePose).
 *
 * 2. ensureCached() — pre-caches a model and returns an `indexeddb://`
 *    string URL. Used with HandPose, which only accepts string URLs for
 *    its detector/landmark options.
 *
 * Public ml5 API exported via src/index.js:
 *   - ml5.cacheModel(name, options?) — pre-download a model to IndexedDB
 *   - ml5.clearCache()               — remove all ml5 cached models
 *   - ml5.listCachedModels()         — list all ml5 cached models
 *   - ml5.isCached(name, options?)   — check if a model is cached
 */

import * as tf from "@tensorflow/tfjs";
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
} from "./modelRegistry";

// ─── URL helpers ─────────────────────────────────────────────────────────────

/**
 * The query string appended to TFHub base URLs to form a fetchable model.json URL.
 * @private
 */
const TFHUB_SEARCH_PARAM = "model.json?tfjs-format=file";

/**
 * Transforms a canonical TFHub URL into its directly-fetchable form by
 * appending `/model.json?tfjs-format=file`. Non-TFHub URLs are returned
 * unchanged.
 *
 * This mirrors the internal transformation performed by tfjs-converter's
 * `loadGraphModel`, which we must replicate when constructing our own HTTP
 * handlers.
 *
 * @param {string} url - Original model URL.
 * @returns {string} URL ready to be fetched.
 * @private
 */
function toFetchUrl(url) {
  if (url.includes("https://tfhub.dev") || url.includes("http://tfhub.dev")) {
    const base = url.endsWith("/") ? url : url + "/";
    return `${base}${TFHUB_SEARCH_PARAM}`;
  }
  return url;
}

// ─── CachingIOHandler ─────────────────────────────────────────────────────────

/**
 * A TensorFlow.js IO handler that caches model artifacts in IndexedDB.
 *
 * On `load()`:
 *   1. Attempts to load from IndexedDB (cache hit → fast, offline).
 *   2. On cache miss, fetches via HTTP (applying TFHub URL transformation).
 *   3. Saves the downloaded artifacts to IndexedDB for future loads.
 *
 * Designed to be passed directly as a `modelUrl` / `detectorModelUrl` /
 * `landmarkModelUrl` option to the `@tensorflow-models` packages that
 * accept `string | tf.io.IOHandler`.
 *
 * @example
 * const handler = new CachingIOHandler(
 *   "https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1",
 *   "ml5-cache-facemesh-detector"
 * );
 * const model = await tf.loadGraphModel(handler);
 */
export class CachingIOHandler {
  /**
   * @param {string} url      - Canonical model URL (TFHub or other HTTP URL).
   * @param {string} cacheKey - IndexedDB key (without `indexeddb://` prefix).
   */
  constructor(url, cacheKey) {
    this.url = url;
    this.cacheKey = cacheKey;
  }

  /**
   * Loads model artifacts from IndexedDB (if cached) or HTTP (with auto-save).
   * @returns {Promise<tf.io.ModelArtifacts>}
   */
  async load() {
    const idbPath = `indexeddb://${this.cacheKey}`;

    // ── 1. Try IndexedDB cache ──────────────────────────────────────────────
    try {
      const loadHandlers = tf.io.getLoadHandlers(idbPath);
      if (loadHandlers.length > 0) {
        const artifacts = await loadHandlers[0].load();
        if (artifacts) {
          console.log(`🟩 ml5.js: Loaded model from cache (${this.cacheKey})`);
          return artifacts;
        }
      }
    } catch {
      // Cache miss — fall through to HTTP fetch
    }

    // ── 2. Fetch from HTTP ──────────────────────────────────────────────────
    console.log(`🟦 ml5.js: Downloading model (${this.cacheKey})…`);
    const fetchUrl = toFetchUrl(this.url);
    const httpHandler = tf.io.http(fetchUrl);
    const artifacts = await httpHandler.load();

    // ── 3. Save to IndexedDB ────────────────────────────────────────────────
    try {
      const saveHandlers = tf.io.getSaveHandlers(idbPath);
      if (saveHandlers.length > 0) {
        await saveHandlers[0].save(artifacts);
        console.log(`🟩 ml5.js: Model cached to IndexedDB (${this.cacheKey})`);
      }
    } catch (err) {
      console.warn(
        `🟪 ml5.js: Could not cache model to IndexedDB (${this.cacheKey}): ${err.message}`
      );
      // Non-fatal — model was loaded successfully from HTTP, just not persisted
    }

    return artifacts;
  }
}

// ─── ensureCached ─────────────────────────────────────────────────────────────

/**
 * Ensures a model is saved in IndexedDB and returns its `indexeddb://` URL.
 *
 * Used for models like HandPose that only accept *string* URLs (not IOHandler
 * objects). Call this before `createDetector` to pre-warm the cache, then pass
 * the returned `indexeddb://` URL as the model URL string.
 *
 * If the model is already cached the download is skipped.
 *
 * @param {string} url      - Canonical model URL (TFHub or other HTTP URL).
 * @param {string} cacheKey - IndexedDB key (without `indexeddb://` prefix).
 * @returns {Promise<string>} The `indexeddb://cacheKey` URL if caching
 *   succeeded, otherwise the original HTTP URL as a fallback.
 */
export async function ensureCached(url, cacheKey) {
  const idbPath = `indexeddb://${cacheKey}`;

  // ── Check if already cached ─────────────────────────────────────────────
  try {
    const models = await tf.io.listModels();
    if (idbPath in models) {
      console.log(`🟩 ml5.js: Model already cached (${cacheKey})`);
      return idbPath;
    }
  } catch {
    // listModels is not critical — proceed to fetch
  }

  // ── Fetch and cache ─────────────────────────────────────────────────────
  console.log(`🟦 ml5.js: Downloading model (${cacheKey})…`);
  const fetchUrl = toFetchUrl(url);

  try {
    const httpHandler = tf.io.http(fetchUrl);
    const artifacts = await httpHandler.load();

    const saveHandlers = tf.io.getSaveHandlers(idbPath);
    if (saveHandlers.length > 0) {
      await saveHandlers[0].save(artifacts);
      console.log(`🟩 ml5.js: Model cached to IndexedDB (${cacheKey})`);
      return idbPath;
    } else {
      console.warn(
        `🟪 ml5.js: No IndexedDB save handler found for (${cacheKey}). Falling back to HTTP.`
      );
      return fetchUrl;
    }
  } catch (err) {
    console.warn(
      `🟪 ml5.js: Could not cache model (${cacheKey}): ${err.message}. ` +
        `Falling back to HTTP.`
    );
    // Return the fetch URL as a fallback so the model still loads
    return fetchUrl;
  }
}

// ─── Public cache management API ─────────────────────────────────────────────

/**
 * Pre-downloads and caches a named ml5 model to IndexedDB.
 *
 * Subsequent calls to `ml5.faceMesh({ cache: true })` (or equivalent) will
 * load from the local cache without any network requests.
 *
 * @param {"faceMesh"|"handPose"|"bodyPose"|"bodyPose-BlazePose"} modelName
 *   Friendly model name (case-insensitive).
 * @param {object} [options]
 *   Same options you would pass to the model constructor (e.g.
 *   `{ refineLandmarks: true }`, `{ modelType: "lite" }`). Used to select
 *   the correct variant to cache. Defaults match each model's defaults.
 * @returns {Promise<void>}
 *
 * @example
 * // Cache default FaceMesh before going offline
 * await ml5.cacheModel("faceMesh");
 *
 * // Cache the attention-mesh variant
 * await ml5.cacheModel("faceMesh", { refineLandmarks: true });
 *
 * // Cache HandPose lite variant
 * await ml5.cacheModel("handPose", { modelType: "lite" });
 *
 * // Cache BlazePose
 * await ml5.cacheModel("bodyPose-BlazePose", { modelType: "full" });
 */
export async function cacheModel(modelName, options = {}) {
  const name = modelName.toLowerCase().replace(/[-_\s]/g, "");

  if (name === "facemesh") {
    const urls = getFaceMeshUrls(options);
    const keys = getFaceMeshCacheKeys(options);
    await Promise.all([
      ensureCached(urls.detector, keys.detector),
      ensureCached(urls.landmark, keys.landmark),
    ]);
  } else if (name === "handpose") {
    const urls = getHandPoseUrls(options);
    const keys = getHandPoseCacheKeys(options);
    await Promise.all([
      ensureCached(urls.detector, keys.detector),
      ensureCached(urls.landmark, keys.landmark),
    ]);
  } else if (name === "bodypose" || name === "bodyposemovenet") {
    // Default bodyPose is MoveNet
    const url = getBodyPoseMoveNetUrl(options);
    const key = getBodyPoseMoveNetCacheKey(options);
    await ensureCached(url, key);
  } else if (name === "bodyposeblazepose" || name === "blazepose") {
    const urls = getBodyPoseBlazePoseUrls(options);
    const keys = getBodyPoseBlazePoseCacheKeys(options);
    await Promise.all([
      ensureCached(urls.detector, keys.detector),
      ensureCached(urls.landmark, keys.landmark),
    ]);
  } else {
    throw new Error(
      `🟪 ml5.js: Unknown model name '${modelName}' for cacheModel(). ` +
        `Valid names: 'faceMesh', 'handPose', 'bodyPose', 'bodyPose-BlazePose'.`
    );
  }
}

/**
 * Returns a map of all ml5 model artifacts currently stored in IndexedDB.
 *
 * Keys are full `indexeddb://` URLs; values are `ModelArtifactsInfo` objects
 * from TensorFlow.js (contain `dateSaved`, `modelTopologyBytes`, etc.).
 *
 * @returns {Promise<Object.<string, tf.io.ModelArtifactsInfo>>}
 *
 * @example
 * const cached = await ml5.listCachedModels();
 * console.log(Object.keys(cached));
 * // → ["indexeddb://ml5-cache-facemesh-detector", ...]
 */
export async function listCachedModels() {
  const allModels = await tf.io.listModels();
  const ml5Models = {};
  for (const [key, info] of Object.entries(allModels)) {
    if (key.startsWith(`indexeddb://${ML5_CACHE_PREFIX}`)) {
      ml5Models[key] = info;
    }
  }
  return ml5Models;
}

/**
 * Removes all ml5 model artifacts from IndexedDB.
 *
 * @returns {Promise<number>} The number of models removed.
 *
 * @example
 * const removed = await ml5.clearCache();
 * console.log(`Removed ${removed} cached model(s).`);
 */
export async function clearCache() {
  const allModels = await tf.io.listModels();
  const ml5Keys = Object.keys(allModels).filter((k) =>
    k.startsWith(`indexeddb://${ML5_CACHE_PREFIX}`)
  );
  await Promise.all(ml5Keys.map((k) => tf.io.removeModel(k)));
  if (ml5Keys.length > 0) {
    console.log(`🟩 ml5.js: Cleared ${ml5Keys.length} cached model(s).`);
  }
  return ml5Keys.length;
}

/**
 * Checks whether a specific ml5 model variant is currently cached in IndexedDB.
 *
 * @param {"faceMesh"|"handPose"|"bodyPose"|"bodyPose-BlazePose"} modelName
 *   Friendly model name (case-insensitive).
 * @param {object} [options]
 *   Options matching those passed to the model constructor. Used to select
 *   the correct variant. Defaults match each model's defaults.
 * @returns {Promise<boolean>}
 *
 * @example
 * if (await ml5.isCached("faceMesh")) {
 *   console.log("FaceMesh is ready for offline use!");
 * }
 */
export async function isCached(modelName, options = {}) {
  let keys;
  const name = modelName.toLowerCase().replace(/[-_\s]/g, "");

  if (name === "facemesh") {
    keys = getFaceMeshCacheKeys(options);
  } else if (name === "handpose") {
    keys = getHandPoseCacheKeys(options);
  } else if (name === "bodypose" || name === "bodyposemovenet") {
    const key = getBodyPoseMoveNetCacheKey(options);
    keys = { main: key };
  } else if (name === "bodyposeblazepose" || name === "blazepose") {
    keys = getBodyPoseBlazePoseCacheKeys(options);
  } else {
    throw new Error(
      `🟪 ml5.js: Unknown model name '${modelName}' for isCached(). ` +
        `Valid names: 'faceMesh', 'handPose', 'bodyPose', 'bodyPose-BlazePose'.`
    );
  }

  let allModels;
  try {
    allModels = await tf.io.listModels();
  } catch {
    return false;
  }

  // All model parts must be cached for the model to be considered "cached"
  return Object.values(keys).every((key) => `indexeddb://${key}` in allModels);
}
