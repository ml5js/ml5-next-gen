// Copyright (c) 2018-2024 ml5
//
// This software is open source and the ml5.js license.
// https://github.com/ml5js/ml5-next-gen/blob/88f7a3b260c59de84a7e4dab181cd3f69ba19bb1/LICENSE.md

/**
 * Renames a key in an object
 *
 * @param {Object} obj - The object to modify
 * @param {string} oldKey - The key to rename
 * @param {string} newKey - The new key name
 * @returns the modified object
 */
export default function objectRenameKey(obj, oldKey, newKey) {
  Object.assign(obj, { [newKey]: obj[oldKey] });
  delete obj[oldKey];
  return obj;
}
