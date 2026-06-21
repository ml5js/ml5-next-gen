/**
 * @license
 * Copyright (c) 2020-2024 ml5
 * This software is released under the ml5.js License.
 * https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 */

/**
 * @file modelRegistry.js
 *
 * Central registry of default model URLs and cache key generation for ml5 models.
 * Used by the offline caching system to map model names and options to their
 * canonical TFHub URLs and deterministic IndexedDB cache keys.
 */

/** Prefix for all ml5 model cache entries in IndexedDB. */
export const ML5_CACHE_PREFIX = "ml5-cache";

/**
 * Canonical default TFHub URLs for all supported models.
 * @private
 */
const MODEL_URLS = {
  // FaceMesh
  FACEMESH_DETECTOR:
    "https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1",
  FACEMESH_LANDMARK_MESH:
    "https://tfhub.dev/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1",
  FACEMESH_LANDMARK_ATTENTION:
    "https://tfhub.dev/mediapipe/tfjs-model/face_landmarks_detection/attention_mesh/1",

  // HandPose
  HANDPOSE_DETECTOR_FULL:
    "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/full/1",
  HANDPOSE_DETECTOR_LITE:
    "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/lite/1",
  HANDPOSE_LANDMARK_FULL:
    "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1",
  HANDPOSE_LANDMARK_LITE:
    "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/lite/1",

  // BodyPose — MoveNet
  MOVENET_SINGLEPOSE_LIGHTNING:
    "https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4",
  MOVENET_SINGLEPOSE_THUNDER:
    "https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4",
  MOVENET_MULTIPOSE_LIGHTNING:
    "https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1",

  // BodyPose — BlazePose
  BLAZEPOSE_DETECTOR:
    "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1",
  BLAZEPOSE_LANDMARK_LITE:
    "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/lite/2",
  BLAZEPOSE_LANDMARK_FULL:
    "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/2",
  BLAZEPOSE_LANDMARK_HEAVY:
    "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/heavy/2",
};

// ─── FaceMesh ────────────────────────────────────────────────────────────────

/**
 * Returns the default model URLs for FaceMesh.
 * @param {{ refineLandmarks?: boolean }} [options]
 * @returns {{ detector: string, landmark: string }}
 */
export function getFaceMeshUrls(options = {}) {
  const refineLandmarks = options.refineLandmarks ?? false;
  return {
    detector: MODEL_URLS.FACEMESH_DETECTOR,
    landmark: refineLandmarks
      ? MODEL_URLS.FACEMESH_LANDMARK_ATTENTION
      : MODEL_URLS.FACEMESH_LANDMARK_MESH,
  };
}

/**
 * Returns the IndexedDB cache keys for FaceMesh models.
 * @param {{ refineLandmarks?: boolean }} [options]
 * @returns {{ detector: string, landmark: string }}
 */
export function getFaceMeshCacheKeys(options = {}) {
  const refineLandmarks = options.refineLandmarks ?? false;
  return {
    detector: `${ML5_CACHE_PREFIX}-facemesh-detector`,
    landmark: refineLandmarks
      ? `${ML5_CACHE_PREFIX}-facemesh-landmark-attention`
      : `${ML5_CACHE_PREFIX}-facemesh-landmark-mesh`,
  };
}

// ─── HandPose ────────────────────────────────────────────────────────────────

/**
 * Returns the default model URLs for HandPose.
 * @param {{ modelType?: "full" | "lite" }} [options]
 * @returns {{ detector: string, landmark: string }}
 */
export function getHandPoseUrls(options = {}) {
  const modelType = options.modelType ?? "full";
  return {
    detector:
      modelType === "lite"
        ? MODEL_URLS.HANDPOSE_DETECTOR_LITE
        : MODEL_URLS.HANDPOSE_DETECTOR_FULL,
    landmark:
      modelType === "lite"
        ? MODEL_URLS.HANDPOSE_LANDMARK_LITE
        : MODEL_URLS.HANDPOSE_LANDMARK_FULL,
  };
}

/**
 * Returns the IndexedDB cache keys for HandPose models.
 * @param {{ modelType?: "full" | "lite" }} [options]
 * @returns {{ detector: string, landmark: string }}
 */
export function getHandPoseCacheKeys(options = {}) {
  const modelType = options.modelType ?? "full";
  return {
    detector: `${ML5_CACHE_PREFIX}-handpose-detector-${modelType}`,
    landmark: `${ML5_CACHE_PREFIX}-handpose-landmark-${modelType}`,
  };
}

// ─── BodyPose — MoveNet ──────────────────────────────────────────────────────

/**
 * Returns the default model URL for BodyPose/MoveNet.
 * @param {{ modelType?: string }} [options]
 * @returns {string}
 */
export function getBodyPoseMoveNetUrl(options = {}) {
  const modelType = options.modelType ?? "MULTIPOSE_LIGHTNING";
  return MODEL_URLS[`MOVENET_${modelType.toUpperCase()}`];
}

/**
 * Returns the IndexedDB cache key for BodyPose/MoveNet.
 * @param {{ modelType?: string }} [options]
 * @returns {string}
 */
export function getBodyPoseMoveNetCacheKey(options = {}) {
  const modelType = options.modelType ?? "MULTIPOSE_LIGHTNING";
  return `${ML5_CACHE_PREFIX}-bodypose-movenet-${modelType
    .toLowerCase()
    .replace(/_/g, "-")}`;
}

// ─── BodyPose — BlazePose ────────────────────────────────────────────────────

/**
 * Returns the default model URLs for BodyPose/BlazePose.
 * @param {{ modelType?: "lite" | "full" | "heavy" }} [options]
 * @returns {{ detector: string, landmark: string }}
 */
export function getBodyPoseBlazePoseUrls(options = {}) {
  const modelType = options.modelType ?? "full";
  return {
    detector: MODEL_URLS.BLAZEPOSE_DETECTOR,
    landmark: MODEL_URLS[`BLAZEPOSE_LANDMARK_${modelType.toUpperCase()}`],
  };
}

/**
 * Returns the IndexedDB cache keys for BodyPose/BlazePose models.
 * @param {{ modelType?: "lite" | "full" | "heavy" }} [options]
 * @returns {{ detector: string, landmark: string }}
 */
export function getBodyPoseBlazePoseCacheKeys(options = {}) {
  const modelType = options.modelType ?? "full";
  return {
    detector: `${ML5_CACHE_PREFIX}-bodypose-blazepose-detector`,
    landmark: `${ML5_CACHE_PREFIX}-bodypose-blazepose-landmark-${modelType}`,
  };
}
