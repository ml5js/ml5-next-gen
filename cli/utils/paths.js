const path = require("node:path");

function resolveOutDir(outDir) {
  return path.resolve(process.cwd(), outDir || "ml5-models");
}

function modelRoot(outDir, modelName) {
  return path.join(resolveOutDir(outDir), modelName);
}

function runtimeDir(outDir, modelName, runtime) {
  return path.join(modelRoot(outDir, modelName), runtime);
}

module.exports = { resolveOutDir, modelRoot, runtimeDir };
