// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import axios from "axios";

const saveBlob = async (data, name, type) => {
  const link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link);
  const blob = new Blob([data], { type });
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
};

const loadFile = async (path, callback) =>
  axios
    .get(path)
    .then((response) => response.data)
    .then((json) => {
      if (callback) {
        callback(null, json);
      }
      return json;
    })
    .catch((error) => {
      if (callback) {
        callback(error);
      }
      console.error(
        `There has been a problem loading the file: ${error.message}`
      );
      throw error;
    });

/**
 * Convert a Uint8Array to a binary File object.
 * @param {Uint8Array} uint8Array - The Uint8Array to convert to a file.
 * @param {string} fileName - The name of the file.
 * @returns {File} A file object.
 */
function uint8ArrayToFile(uint8Array, fileName) {
  const blob = new Blob([uint8Array], { type: "application/octet-stream" });
  return new File([blob], fileName, { type: "application/octet-stream" });
}

export { saveBlob, loadFile, uint8ArrayToFile };
