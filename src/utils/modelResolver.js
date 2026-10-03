import {
  getModelDirName,
  getTfjsLocalPaths,
  joinUrl,
  MEDIAPIPE_MARKER_FILES,
} from "./modelRegistry";

function canProbe() {
  return typeof fetch === "function";
}

async function urlExists(url) {
  if (!canProbe()) return false;
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
}

function getAutoModelRoot(modelName) {
  return `./ml5-models/${getModelDirName(modelName)}`;
}

function getTfjsPaths(modelName, modelNameForBodyPose) {
  return getTfjsLocalPaths(modelName, { modelNameForBodyPose });
}

function hasExplicitRuntime(userOptions) {
  return userOptions && Object.prototype.hasOwnProperty.call(userOptions, "runtime");
}

function supportsRuntimeOption(modelConfig) {
  return Object.prototype.hasOwnProperty.call(modelConfig, "runtime");
}

function applyTfjsModelPath(modelConfig, modelName, modelPath, modelNameForBodyPose) {
  const paths = getTfjsPaths(modelName, modelNameForBodyPose);
  if (!paths) return;
  Object.keys(paths).forEach((key) => {
    modelConfig[key] = joinUrl(modelPath, paths[key]);
  });
}

function applyMediaPipeModelPath(modelConfig, modelPath) {
  modelConfig.solutionPath = joinUrl(modelPath, "mediapipe");
}

function applyLeafTfjsPath(modelConfig, modelName, modelPath, modelNameForBodyPose) {
  const paths = getTfjsPaths(modelName, modelNameForBodyPose);
  if (!paths) return;
  const keys = Object.keys(paths);
  if (keys.length === 1) {
    modelConfig[keys[0]] = joinUrl(modelPath, "model.json");
  } else {
    applyTfjsModelPath(modelConfig, modelName, modelPath, modelNameForBodyPose);
  }
}

async function resolveExplicitModelPath({ modelName, modelConfig, modelPath, modelNameForBodyPose, userOptions }) {
  const manifestUrl = joinUrl(modelPath, "manifest.json");
  const tfjsLeafUrl = joinUrl(modelPath, "model.json");
  const mediaPipeMarker = MEDIAPIPE_MARKER_FILES[modelName];
  const mediaPipeMarkerUrl = mediaPipeMarker ? joinUrl(modelPath, mediaPipeMarker) : undefined;

  const [hasManifest, hasTfjsLeaf, hasMediaPipeLeaf] = await Promise.all([
    urlExists(manifestUrl),
    urlExists(tfjsLeafUrl),
    mediaPipeMarkerUrl ? urlExists(mediaPipeMarkerUrl) : Promise.resolve(false),
  ]);

  if (hasManifest) {
    if (modelConfig.runtime === "mediapipe" && hasExplicitRuntime(userOptions)) {
      applyMediaPipeModelPath(modelConfig, modelPath);
    } else {
      if (supportsRuntimeOption(modelConfig)) modelConfig.runtime = "tfjs";
      applyTfjsModelPath(modelConfig, modelName, modelPath, modelNameForBodyPose);
    }
    return true;
  }

  if (hasTfjsLeaf) {
    if (supportsRuntimeOption(modelConfig)) modelConfig.runtime = "tfjs";
    applyLeafTfjsPath(modelConfig, modelName, modelPath, modelNameForBodyPose);
    return true;
  }

  if (hasMediaPipeLeaf && supportsRuntimeOption(modelConfig)) {
    modelConfig.runtime = "mediapipe";
    modelConfig.solutionPath = modelPath;
    return true;
  }

  const tried = [`HEAD ${manifestUrl} (ml5 prefetch manifest)`, `HEAD ${tfjsLeafUrl} (raw TFJS model.json)`];
  if (mediaPipeMarkerUrl) {
    tried.push(`HEAD ${mediaPipeMarkerUrl} (MediaPipe marker file)`);
  }

  throw new Error(
    [
      `ml5: modelPath '${modelPath}' not reachable for ${modelName}.`,
      "",
      "Tried:",
      ...tried.map((url) => `  - ${url}`),
      "",
      `Expected modelPath to point at the model root, for example './ml5-models/${getModelDirName(modelName)}'.`,
      "Do not point at a runtime subfolder like './ml5-models/handpose/tfjs' or './ml5-models/handpose/mediapipe'.",
      "",
      "If you have not staged files yet, run:",
      `  node bin/ml5.js cache prefetch ${modelName}`,
      `Once published to npm, this becomes: npx ml5 cache prefetch ${modelName}`,
    ].join("\n")
  );
}

export async function resolveModelUrls({ modelName, modelConfig, userOptions = {}, modelNameForBodyPose }) {
  const modelPath = userOptions.modelPath;

  if (modelPath === undefined || modelPath === false) {
    return modelConfig;
  }

  if (modelPath === "auto") {
    const autoRoot = getAutoModelRoot(modelName);
    const manifestUrl = joinUrl(autoRoot, "manifest.json");
    if (await urlExists(manifestUrl)) {
      return resolveModelUrls({
        modelName,
        modelConfig,
        userOptions: { ...userOptions, modelPath: autoRoot },
        modelNameForBodyPose,
      });
    }
    return modelConfig;
  }

  if (typeof modelPath === "string") {
    await resolveExplicitModelPath({
      modelName,
      modelConfig,
      modelPath,
      modelNameForBodyPose,
      userOptions,
    });
  }

  return modelConfig;
}
