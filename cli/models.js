const { mediapipePackages, tfjsModels } = require("./registry");

async function models() {
  Object.keys(tfjsModels).forEach((model) => {
    const variants = Object.keys(mediapipePackages[model]?.variants || {}).join(", ");
    console.log(`${model}  runtimes: tfjs, mediapipe  mediapipe variants: ${variants}`);
  });
}

module.exports = { models };
