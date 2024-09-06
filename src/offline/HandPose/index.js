import landmarkModelLiteJson from "../models/landmarkModelLiteJson.js";
import landmarkModelLiteBin from "../models/landmarkModelLiteBin.js";
import detectorModelLiteJson from "../models/detectorModelLiteJson.js";
import detectorModelLiteBin from "../models/detectorModelLiteBin.js";

function loadOfflineModel(configObject) {
  const landmarkModelBinArray = hexStringToUint8Array(landmarkModelLiteBin);
  const landmarkModelLiteBinFile = uint8ArrayToFile(
    landmarkModelBinArray,
    "group1-shard1of1.bin"
  );

  // convert the js data for landmark model into file urls
  const landmarkBinURL = URL.createObjectURL(landmarkModelLiteBinFile);

  // change the path to the bin file in the model json
  landmarkModelLiteJson.weightsManifest[0].paths[0] = landmarkBinURL
    .split("/")
    .pop();

  const landmarkModelLiteJsonFile = new File(
    [JSON.stringify(landmarkModelLiteJson)],
    "model.json",
    { type: "application/json" }
  );
  const landmarkJsonURL = URL.createObjectURL(landmarkModelLiteJsonFile);

  // convert the js data for the detector model into file urls
  const detectorModelBinArray = hexStringToUint8Array(detectorModelLiteBin);
  const detectorModelLiteBinFile = uint8ArrayToFile(
    detectorModelBinArray,
    "group1-shard1of1.bin"
  );
  const detectorBinURL = URL.createObjectURL(detectorModelLiteBinFile);

  detectorModelLiteJson.weightsManifest[0].paths[0] = detectorBinURL
    .split("/")
    .pop();

  const detectorModelLiteJsonFile = new File(
    [JSON.stringify(detectorModelLiteJson)],
    "model.json",
    { type: "application/json" }
  );
  const detectorJsonURL = URL.createObjectURL(detectorModelLiteJsonFile);

  configObject.landmarkModelUrl = landmarkJsonURL;
  configObject.detectorModelUrl = detectorJsonURL;
}

// Convert the hex string back to a Uint8Array
function hexStringToUint8Array(hexString) {
  const length = hexString.length / 2;
  const uint8Array = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    uint8Array[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }

  return uint8Array;
}

// Convert the Uint8Array to a Blob (binary data)
function uint8ArrayToBlob(uint8Array, mimeType = "application/octet-stream") {
  return new Blob([uint8Array], { type: mimeType });
}

// Convert back to a File object
function uint8ArrayToFile(
  uint8Array,
  fileName,
  mimeType = "application/octet-stream"
) {
  const blob = uint8ArrayToBlob(uint8Array, mimeType);
  return new File([blob], fileName, { type: mimeType });
}

export default loadOfflineModel;
