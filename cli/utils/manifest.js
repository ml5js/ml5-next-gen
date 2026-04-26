const fs = require("node:fs/promises");
const path = require("node:path");
const { sha256File } = require("./sha");

async function readManifest(root) {
  try {
    const content = await fs.readFile(path.join(root, "manifest.json"), "utf8");
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

async function writeManifest(root, manifest) {
  await fs.mkdir(root, { recursive: true });
  await fs.writeFile(path.join(root, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

async function verifyManifest(root, manifest) {
  const results = [];
  for (const runtime of Object.keys(manifest.runtimes || {})) {
    for (const file of manifest.runtimes[runtime].files || []) {
      const fullPath = path.join(root, file.path);
      try {
        const stat = await fs.stat(fullPath);
        const sha256 = await sha256File(fullPath);
        results.push({ ...file, runtime, ok: stat.size === file.size && sha256 === file.sha256 });
      } catch (error) {
        results.push({ ...file, runtime, ok: false });
      }
    }
  }
  return results;
}

module.exports = { readManifest, writeManifest, verifyManifest };
