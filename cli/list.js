const fs = require("node:fs/promises");
const path = require("node:path");
const { resolveOutDir } = require("./utils/paths");
const { readManifest } = require("./utils/manifest");

async function list(args) {
  const outIndex = args.indexOf("--out");
  const out = resolveOutDir(outIndex >= 0 ? args[outIndex + 1] : "ml5-models");
  let entries = [];
  try {
    entries = await fs.readdir(out, { withFileTypes: true });
  } catch (error) {
    console.log("No local ml5 model files found.");
    return;
  }
  for (const entry of entries.filter((item) => item.isDirectory())) {
    const manifest = await readManifest(path.join(out, entry.name));
    if (manifest) console.log(`${entry.name}: ${Object.keys(manifest.runtimes || {}).join(", ")}`);
  }
}

module.exports = { list };
