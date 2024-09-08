const fs = require("fs");
const tar = require("tar");
const path = require("path");
const rimraf = require("rimraf");
const { Readable } = require("stream");

const outputDir = "offline_models";
const tmpDir = "offline_models/tmp";
const extracted = [];

/**
 * URLs of the models to fetch.
 */
const modelURLs = {
  handPose: {
    detectorLite:
      "https://www.kaggle.com/api/v1/models/mediapipe/handpose-3d/tfJs/detector-lite/1/download",
    landmarkLite:
      "https://www.kaggle.com/api/v1/models/mediapipe/handpose-3d/tfJs/landmark-lite/1/download",
  },
};

/**
 * Fetch a compressed model from a given URL and save it to a given output directory.
 * @param {string} url - The URL of the .tar.gz file to fetch.
 * @param {string} outputDir - The directory path to save the fetched file.
 */
async function fetchCompressedModel(url, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const res = await fetch(url);

  const fileStream = fs.createWriteStream(
    path.resolve(outputDir, "model.tar.gz"),
    { flags: "w" }
  );
  Readable.fromWeb(res.body).pipe(fileStream);

  return new Promise((resolve, reject) => {
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
  });
}

/**
 * Unzips a compressed file to a given output.
 * @param {string} filePath
 * @param {string} outputDir
 */
function unzip(filePath, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  tar.x({
    file: filePath,
    cwd: outputDir,
    gzip: true,
    sync: true,
  });
}

/**
 * Convert a JSON file to a JS file.
 * Pad the JSON content with `export default` so it could be imported as a module.
 * @param {string} jsonPath - Path to the JSON file to convert to JS.
 * @param {string} outputDir - The directory path to save the JS representation of the JSON file.
 * @param {string} outputName - The name of the output JS file.
 */
function jsonToJs(jsonPath, outputDir, outputName) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  // Read the model.json file
  const content = fs.readFileSync(jsonPath, "utf-8");
  // Pad the content with export default
  const padded = `const modelJson=${content}; export default modelJson;`;
  // Write the content to a js file
  fs.writeFileSync(path.resolve(outputDir, outputName), padded);
}

/**
 * Create a JS file from a binary file.
 * The binary file is converted to a Uint8Array so it could be written in a JS file.
 * Add `export default` to the Uint8Array so it could be imported as a module.
 * @param {string} binaryPath - Path to the binary file to convert to JS.
 * @param {string} outputDir - The directory path to save the JS representation of the binary file.
 * @param {string} outputName - The name of the output JS file.
 */
function binaryToJs(binaryPath, outputDir, outputName) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  // Read the model.bin file
  const content = fs.readFileSync(binaryPath);
  // Convert the binary file to a Uint8Array so it could be written in a js file
  const arrayBuffer = content.buffer.slice(
    content.byteOffset,
    content.byteOffset + content.byteLength
  );
  const uint8Array = new Uint8Array(arrayBuffer);
  // Write the Uint8Array to a js file
  fs.writeFileSync(
    path.resolve(outputDir, outputName),
    `const modelBin=new Uint8Array([${uint8Array}]); export default modelBin;`
  );
}
/**
 * Download the model binary files and convert them to JS files.
 * The function will make a JS file for the model.json and model.bin files.
 * The files are converted to JS so they could be bundled into the ml5.js library.
 *
 * @param {string} url - The URL of the .tar.gz file to fetch.
 * @param {string} outputDir - The directory path to save the JS representation of the model.json and model.bin files.
 * @returns
 */
async function makeJsModelFiles(url, ml5ModelName, modelName) {
  // temporary directory for processing the model files
  const modelTmpDir = path.resolve(tmpDir, ml5ModelName, modelName);
  const modelDir = path.resolve(outputDir, ml5ModelName, modelName);

  await fetchCompressedModel(url, modelTmpDir);
  unzip(path.resolve(modelTmpDir, "model.tar.gz"), modelTmpDir);

  // Convert model.json to model.json.js
  jsonToJs(path.resolve(modelTmpDir, "model.json"), modelDir, "model.json.js");

  // Convert all model.bin files to model.bin.js
  const binFiles = fs
    .readdirSync(modelTmpDir)
    .filter((file) => file.endsWith(".bin"));

  binFiles.forEach((binFile) => {
    binaryToJs(path.resolve(modelTmpDir, binFile), modelDir, `${binFile}.js`);
  });
}

/**
 * Remove the temporary directory.
 */
function cleanup() {
  rimraf.sync(tmpDir);
}

/**
 * Check if the model files (js) already
 * @param {string} ml5Model
 * @param {string} model
 * @returns
 */
function modelJsExists(ml5Model, model) {
  const hasDir = fs.existsSync(path.resolve(outputDir, ml5Model, model));
  if (!hasDir) return false;

  const files = fs.readdirSync(path.resolve(outputDir, ml5Model, model));
  const hasJson = files.includes("model.json.js");
  const hasBin = files.some((file) => file.endsWith(".bin.js"));
  return hasJson && hasBin;
}

/**
 * Point of entry to the script.
 */
async function main() {
  for (ml5Model in modelURLs) {
    for (model in modelURLs[ml5Model]) {
      if (!modelJsExists(ml5Model, model)) {
        await makeJsModelFiles(modelURLs[ml5Model][model], ml5Model, model);
      }
    }
  }
  cleanup();
}
main();
