/**
 * cli/utils/sha.js
 *
 * SHA-256 helpers used by manifest generation and verification.
 */

const crypto = require("node:crypto");
const fs = require("node:fs");

function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    // Stream file contents so large MediaPipe .data / .wasm files are not
    // loaded into memory at once.
    const stream = fs.createReadStream(filePath);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

function sha256Buffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

module.exports = { sha256File, sha256Buffer };
