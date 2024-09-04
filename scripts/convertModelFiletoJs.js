const fs = require("fs");
const tar = require("tar");
const path = require("path");
const { data } = require("@tensorflow/tfjs");

const currentWorkingDir = process.cwd();

const tarFilePath = process.argv[2];
const outputDir = process.argv[3];

// Test if tar file exists
if (!fs.existsSync(tarFilePath)) {
  console.error(
    "Tar.gz model file does not exist at",
    path.resolve(currentWorkingDir, tarFilePath)
  );
  process.exit(1);
}

// Test if output directory exists
if (!fs.existsSync(outputDir)) {
  console.error(
    "Output directory does not exist.",
    path.resolve(currentWorkingDir, outputDir),
    "is not a directory."
  );
  process.exit(1);
}

const extracted = [];

// Extract tar file
tar.x({
  file: tarFilePath,
  cwd: outputDir,
  gzip: true,
  sync: true,
  onentry: (entry) => {
    console.log("Extracted", entry.path + ".");
    extracted.push(entry.path);
  },
});

// Convert model.json files to a js file
const modelJsonPath = extracted.find((file) => file.endsWith(".json"));
if (!modelJsonPath) {
  console.error("Model JSON file is not found after extraction.");
  cleanup();
  process.exit(1);
}

console.log("Converting", modelJsonPath, "to JS file...");
// Read the model.json file
const modelJsonContent = fs.readFileSync(
  path.resolve(outputDir, modelJsonPath),
  "utf-8"
);
// Pad the content with export default
const paddedJsonContent = `const modelJson=${modelJsonContent}; export default modelJson;`;
// Write the content to a js file
fs.writeFileSync(
  path.resolve(outputDir, modelJsonPath + ".js"),
  paddedJsonContent
);
console.log("Done.");

// Find the model.bin file
const modelBin = extracted.find((file) => file.endsWith(".bin"));
if (!modelBin) {
  console.error("Model binary file is not found after extraction.");
  cleanup();
  process.exit(1);
}
console.log("Converting", modelBin, "to JS file...");
// Read the model.bin file
const modelBinContent = fs.readFileSync(path.resolve(outputDir, modelBin));
// Convert the binary file to a Uint8Array so it could be written in a js file
const arrayBuffer = modelBinContent.buffer.slice(
  modelBinContent.byteOffset,
  modelBinContent.byteOffset + modelBinContent.byteLength
);
const uint8Array = new Uint8Array(arrayBuffer);
// Write the Uint8Array to a js file
fs.writeFileSync(
  path.resolve(outputDir, modelBin + ".js"),
  `const modelBin=new Uint8Array([${uint8Array}]); export default modelBin;`
);
console.log("Done.");

cleanup();
// Clean up extracted files
function cleanup() {
  extracted.forEach((file) => {
    fs.unlinkSync(path.resolve(outputDir, file));
  });
}
