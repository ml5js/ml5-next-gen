/**
 * cli/models.js
 *
 * Implements `ml5 cache models`, a small discovery command that prints every
 * cacheable model plus the MediaPipe variants known to the CLI registry.
 */

const { mediapipePackages, tfjsModels } = require("./registry");

async function models() {
  Object.keys(tfjsModels).forEach((model) => {
    const variants = Object.keys(mediapipePackages[model]?.variants || {}).join(", ");
    console.log(`${model}  runtimes: tfjs, mediapipe  mediapipe variants: ${variants}`);
  });
}

module.exports = { models };
