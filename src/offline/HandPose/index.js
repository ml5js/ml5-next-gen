import { uint8ArrayToFile } from "../../utils/io.js";
import landmarkLiteJson from "../models/HandPose/landmarkLite/model.json.js";
import landmarkLiteBinArray from "../models/HandPose/landmarkLite/group1-shard1of1.bin.js";
import detectorLiteJson from "../models/HandPose/detectorLite/model.json.js";
import detectorLiteBinArray from "../models/HandPose/detectorLite/group1-shard1of1.bin.js";

/**
 * Define the loadOfflineModel function.
 * The function will inject the model URLs into the config object.
 * This function will be called by HandPose during initialization.
 * @param {Object} configObject - The configuration object to mutate.
 */
function loadOfflineModel(configObject) {
  let landmarkJson;
  let landmarkBinArray;
  let detectorJson;
  let detectorBinArray;

  // Select the correct model to load based on the config object.
  if (configObject.modelType === "lite") {
    landmarkJson = landmarkLiteJson;
    landmarkBinArray = landmarkLiteBinArray;
    detectorJson = detectorLiteJson;
    detectorBinArray = detectorLiteBinArray;
  }

  // Convert the binary data to a file object.
  const landmarkBinFile = uint8ArrayToFile(
    landmarkBinArray,
    "group1-shard1of1.bin"
  );
  const detectorBinFile = uint8ArrayToFile(
    detectorBinArray,
    "group1-shard1of1.bin"
  );

  // Give the detector model binary data a URL.
  const landmarkBinURL = URL.createObjectURL(landmarkBinFile);
  const detectorBinURL = URL.createObjectURL(detectorBinFile);

  // Change the path to the binary file in the model json data.
  landmarkJson.weightsManifest[0].paths[0] = landmarkBinURL.split("/").pop();
  detectorJson.weightsManifest[0].paths[0] = detectorBinURL.split("/").pop();

  // Convert the json data to file objects.
  const landmarkJsonFile = new File(
    [JSON.stringify(landmarkJson)],
    "model.json",
    { type: "application/json" }
  );
  const detectorJsonFile = new File(
    [JSON.stringify(detectorJson)],
    "model.json",
    { type: "application/json" }
  );

  // Give the json data URLs.
  const landmarkJsonURL = URL.createObjectURL(landmarkJsonFile);
  const detectorJsonURL = URL.createObjectURL(detectorJsonFile);

  // Inject the URLs into the config object.
  configObject.landmarkModelUrl = landmarkJsonURL;
  configObject.detectorModelUrl = detectorJsonURL;
}

export default loadOfflineModel;
