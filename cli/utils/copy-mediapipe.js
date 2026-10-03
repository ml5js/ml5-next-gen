/**
 * cli/utils/copy-mediapipe.js
 *
 * Copies MediaPipe solution assets from installed node_modules packages into
 * the local cache layout and records size + SHA-256 for the manifest.
 */

const fs = require("node:fs/promises");
const path = require("node:path");
const { getMediaPipeFiles, getMediaPipePackageDir, getMediaPipeVersion, mediapipePackages } = require("../registry");
const { sha256File } = require("./sha");

async function copyMediaPipe({ model, variant, destination, force = false }) {
  const files = getMediaPipeFiles(model, variant);
  const packageDir = getMediaPipePackageDir(model);
  await fs.mkdir(destination, { recursive: true });
  const manifestFiles = [];
  for (const file of files) {
    const from = path.join(packageDir, file);
    const to = path.join(destination, file);
    let copied = true;
    if (!force) {
      try {
        // Existing files are reused unless --force is set; we still hash below
        // so the manifest reflects the file that will actually be served.
        await fs.access(to);
        copied = false;
      } catch (error) {}
    }
    if (copied) await fs.copyFile(from, to);
    // TODO: This intentionally verifies every copied/reused file today. If it
    // becomes slow, cache hash results and invalidate by size + mtime.
    const stat = await fs.stat(to);
    manifestFiles.push({ path: path.posix.join("mediapipe", file), size: stat.size, sha256: await sha256File(to) });
  }
  return { package: mediapipePackages[model].pkg, version: getMediaPipeVersion(model), variant: variant || mediapipePackages[model].defaultVariant, files: manifestFiles };
}

module.exports = { copyMediaPipe };
