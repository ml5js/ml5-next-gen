const path = require("node:path");
const { resolveOutDir } = require("./utils/paths");
const { readManifest, verifyManifest } = require("./utils/manifest");

async function verify(args) {
  const outIndex = args.indexOf("--out");
  const out = resolveOutDir(outIndex >= 0 ? args[outIndex + 1] : "ml5-models");
  const model = args.find((arg) => !arg.startsWith("--") && arg !== (outIndex >= 0 ? args[outIndex + 1] : undefined));
  if (!model) throw new Error("Usage: ml5 cache verify <model>");
  const root = path.join(out, model.toLowerCase());
  const manifest = await readManifest(root);
  if (!manifest) throw new Error(`No manifest found for ${model}`);
  const results = await verifyManifest(root, manifest);
  results.forEach((result) => console.log(`${result.ok ? "✓" : "✗"} ${result.path}`));
  if (results.some((result) => !result.ok)) process.exitCode = 1;
}

module.exports = { verify };
