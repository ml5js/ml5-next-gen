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
