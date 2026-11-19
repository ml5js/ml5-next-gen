/**
 * cli/verify.js
 *
 * Implements `ml5 cache verify <model> [--out <dir>]` by reading the model's
 * manifest, recomputing size + SHA-256 for each recorded file, and setting a
 * non-zero exit code if any file is missing or changed.
 */

const path = require("node:path");
const { resolveOutDir } = require("./utils/paths");
const { readManifest, verifyManifest } = require("./utils/manifest");

async function verify(args) {
  const outIndex = args.indexOf("--out");
  const out = resolveOutDir(outIndex >= 0 ? args[outIndex + 1] : "ml5-models");
  // TODO: Replace this lightweight positional parsing with a shared parser.
  // It matches clear.js for now, but a real parser would avoid surprising
  // behavior when flags and model names are interleaved unusually.
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
