export const MODEL_DIRS = {
  handpose: "handpose",
  facemesh: "facemesh",
  bodypose: "bodypose",
};

export const TFJS_MODEL_PATHS = {
  handpose: {
    detectorModelUrl: "tfjs/detector/model.json",
    landmarkModelUrl: "tfjs/landmark/model.json",
  },
  facemesh: {
    detectorModelUrl: "tfjs/detector/model.json",
    landmarkModelUrl: "tfjs/landmark/model.json",
  },
  bodypose: {
    modelUrl: "tfjs/model/model.json",
  },
  bodyposeBlazepose: {
    detectorModelUrl: "tfjs/detector/model.json",
    landmarkModelUrl: "tfjs/landmark/model.json",
  },
};

export const TFJS_MODEL_URLS = {
  handpose: {
    detectorModelUrl: "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/full/1",
    landmarkModelUrl: "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1",
  },
  facemesh: {
    detectorModelUrl: "https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1",
    landmarkModelUrl: "https://tfhub.dev/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1",
  },
  bodypose: {
    modelUrl: "https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1",
  },
  bodyposeBlazepose: {
    detectorModelUrl: "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1",
    landmarkModelUrl: "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/2",
  },
};

export const MEDIAPIPE_MARKER_FILES = {
  handpose: "hands.binarypb",
  facemesh: "face_mesh.binarypb",
  bodypose: "pose_web.binarypb",
};

export const MEDIAPIPE_PACKAGES = {
  handpose: {
    pkg: "@mediapipe/hands",
    defaultVariant: "full",
    shared: [
      "hands.binarypb",
      "hands.js",
      "hands_solution_packed_assets.data",
      "hands_solution_packed_assets_loader.js",
      "hands_solution_simd_wasm_bin.js",
      "hands_solution_simd_wasm_bin.wasm",
      "hands_solution_simd_wasm_bin.data",
      "hands_solution_wasm_bin.js",
      "hands_solution_wasm_bin.wasm",
    ],
    variants: {
      lite: ["hand_landmark_lite.tflite"],
      full: ["hand_landmark_full.tflite"],
    },
  },
  facemesh: {
    pkg: "@mediapipe/face_mesh",
    defaultVariant: "default",
    shared: [
      "face_mesh.binarypb",
      "face_mesh.js",
      "face_mesh_solution_packed_assets.data",
      "face_mesh_solution_packed_assets_loader.js",
      "face_mesh_solution_simd_wasm_bin.js",
      "face_mesh_solution_simd_wasm_bin.wasm",
      "face_mesh_solution_simd_wasm_bin.data",
      "face_mesh_solution_wasm_bin.js",
      "face_mesh_solution_wasm_bin.wasm",
    ],
    variants: {
      default: [],
    },
  },
  bodypose: {
    pkg: "@mediapipe/pose",
    defaultVariant: "full",
    shared: [
      "pose_web.binarypb",
      "pose.js",
      "pose_solution_packed_assets.data",
      "pose_solution_packed_assets_loader.js",
      "pose_solution_simd_wasm_bin.js",
      "pose_solution_simd_wasm_bin.wasm",
      "pose_solution_simd_wasm_bin.data",
      "pose_solution_wasm_bin.js",
      "pose_solution_wasm_bin.wasm",
    ],
    variants: {
      lite: ["pose_landmark_lite.tflite"],
      full: ["pose_landmark_full.tflite"],
      heavy: ["pose_landmark_heavy.tflite"],
    },
  },
};

export function getModelDirName(modelName) {
  return MODEL_DIRS[modelName] || modelName;
}

export function getMediaPipePackageInfo(modelName) {
  return MEDIAPIPE_PACKAGES[modelName];
}

export function getMediaPipeFiles(modelName, variant) {
  const info = getMediaPipePackageInfo(modelName);
  if (!info) return [];
  const resolvedVariant = variant === "all" ? "all" : variant || info.defaultVariant;
  const variantFiles =
    resolvedVariant === "all"
      ? Object.keys(info.variants).flatMap((key) => info.variants[key])
      : info.variants[resolvedVariant] || info.variants[info.defaultVariant] || [];
  return [...info.shared, ...variantFiles];
}

export function getTfjsModelUrls(modelName, options = {}) {
  if (modelName === "bodypose" && options.modelNameForBodyPose === "BlazePose") {
    return TFJS_MODEL_URLS.bodyposeBlazepose;
  }
  return TFJS_MODEL_URLS[modelName];
}

export function getTfjsLocalPaths(modelName, options = {}) {
  if (modelName === "bodypose" && options.modelNameForBodyPose === "BlazePose") {
    return TFJS_MODEL_PATHS.bodyposeBlazepose;
  }
  return TFJS_MODEL_PATHS[modelName];
}

export function joinUrl(base, path) {
  const normalizedBase = String(base).replace(/\/+$/, "");
  const normalizedPath = String(path).replace(/^\/+/, "");
  return `${normalizedBase}/${normalizedPath}`;
}
