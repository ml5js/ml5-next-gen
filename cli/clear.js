/**
 * cli/clear.js
 *
 * Implements `ml5 cache clear [model] [--out <dir>]` by removing either one
 * cached model directory or the entire cache output directory.
 */

const fs = require("node:fs/promises");
const path = require("node:path");
const { resolveOutDir } = require("./utils/paths");

async function clear(args) {
  const outIndex = args.indexOf("--out");
  const out = resolveOutDir(outIndex >= 0 ? args[outIndex + 1] : "ml5-models");
  // TODO: Replace this lightweight positional parsing with a shared parser.
  // Today `--out foo handpose` works, but unusual flag ordering can be
  // surprising because we only skip the value immediately following --out.
  const model = args.find((arg) => !arg.startsWith("--") && arg !== (outIndex >= 0 ? args[outIndex + 1] : undefined));
  const target = model ? path.join(out, model.toLowerCase()) : out;
  await fs.rm(target, { recursive: true, force: true });
  console.log(`Cleared ${target}`);
}

module.exports = { clear };
