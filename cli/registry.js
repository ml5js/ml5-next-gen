const path = require("node:path");

const modelDirs = {
  handpose: "handpose",
  facemesh: "facemesh",
  bodypose: "bodypose",
};

const mediapipePackages = {
  handpose: {
    pkg: "@mediapipe/hands",
    defaultVariant: "full",
    shared: ["hands.binarypb", "hands.js", "hands_solution_packed_assets.data", "hands_solution_packed_assets_loader.js", "hands_solution_simd_wasm_bin.js", "hands_solution_simd_wasm_bin.wasm", "hands_solution_simd_wasm_bin.data", "hands_solution_wasm_bin.js", "hands_solution_wasm_bin.wasm"],
    variants: { lite: ["hand_landmark_lite.tflite"], full: ["hand_landmark_full.tflite"] },
  },
  facemesh: {
    pkg: "@mediapipe/face_mesh",
    defaultVariant: "default",
    shared: ["face_mesh.binarypb", "face_mesh.js", "face_mesh_solution_packed_assets.data", "face_mesh_solution_packed_assets_loader.js", "face_mesh_solution_simd_wasm_bin.js", "face_mesh_solution_simd_wasm_bin.wasm", "face_mesh_solution_simd_wasm_bin.data", "face_mesh_solution_wasm_bin.js", "face_mesh_solution_wasm_bin.wasm"],
    variants: { default: [] },
  },
  bodypose: {
    pkg: "@mediapipe/pose",
    defaultVariant: "full",
    shared: ["pose_web.binarypb", "pose.js", "pose_solution_packed_assets.data", "pose_solution_packed_assets_loader.js", "pose_solution_simd_wasm_bin.js", "pose_solution_simd_wasm_bin.wasm", "pose_solution_simd_wasm_bin.data", "pose_solution_wasm_bin.js", "pose_solution_wasm_bin.wasm"],
    variants: { lite: ["pose_landmark_lite.tflite"], full: ["pose_landmark_full.tflite"], heavy: ["pose_landmark_heavy.tflite"] },
  },
};

const tfjsModels = {
  handpose: {
    detector: "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/full/1",
    landmark: "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1",
  },
  facemesh: {
    detector: "https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1",
    landmark: "https://tfhub.dev/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1",
  },
  bodypose: {
    model: "https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1",
    detector: "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1",
    landmark: "https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/2",
  },
};

function getModelDirName(model) {
  return modelDirs[model] || model;
}

function getMediaPipeFiles(model, variant) {
  const info = mediapipePackages[model];
  const selected = variant || info.defaultVariant;
  const variantFiles = selected === "all" ? Object.values(info.variants).flat() : info.variants[selected] || info.variants[info.defaultVariant] || [];
  return [...info.shared, ...variantFiles];
}

function getMediaPipePackageDir(model) {
  const info = mediapipePackages[model];
  const pkgJson = require.resolve(path.join(info.pkg, "package.json"));
  return path.dirname(pkgJson);
}

function getMediaPipeVersion(model) {
  const info = mediapipePackages[model];
  return require(path.join(info.pkg, "package.json")).version;
}

module.exports = { modelDirs, mediapipePackages, tfjsModels, getModelDirName, getMediaPipeFiles, getMediaPipePackageDir, getMediaPipeVersion };
