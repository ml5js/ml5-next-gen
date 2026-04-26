const fs = require("node:fs/promises");
const path = require("node:path");
const pkg = require("../package.json");
const readline = require("node:readline/promises");
const { copyMediaPipe } = require("./utils/copy-mediapipe");
const { downloadTfjsModel } = require("./utils/download-tfjs");
const { writeManifest } = require("./utils/manifest");
const { modelRoot, runtimeDir } = require("./utils/paths");
const { log } = require("./utils/progress");
const { getModelDirName, tfjsModels } = require("./registry");

async function confirmLargeDownload(options) {
  if (options.yes || options.quiet || options.runtime !== "both") return;
  if (!process.stdin.isTTY) {
    throw new Error("This prefetch may download/copy more than 30 MB. Re-run with --yes to continue in a non-interactive shell.");
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question("This may stage more than 30 MB of model files. Continue? [y/N] ");
  rl.close();
  if (!/^y(es)?$/i.test(answer.trim())) throw new Error("Prefetch cancelled.");
}

function parseOptions(args) {
  const options = { models: [], out: "ml5-models", runtime: "both", variant: undefined, force: false, yes: false, quiet: false };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--out") options.out = args[++i];
    else if (arg === "--runtime") options.runtime = args[++i];
    else if (arg === "--variant") options.variant = args[++i];
    else if (arg === "--force") options.force = true;
    else if (arg === "--yes") options.yes = true;
    else if (arg === "--quiet") options.quiet = true;
    else options.models.push(arg.toLowerCase());
  }
  return options;
}

async function prefetch(args) {
  const options = parseOptions(args);
  if (options.models.length === 0) throw new Error("Usage: ml5 cache prefetch <model>... [--runtime tfjs|mediapipe|both]");
  if (!["tfjs", "mediapipe", "both"].includes(options.runtime)) throw new Error("--runtime must be tfjs, mediapipe, or both");

  await confirmLargeDownload(options);

  for (const model of options.models) {
    const modelDirName = getModelDirName(model);
    const root = modelRoot(options.out, modelDirName);
    const manifest = { $schema: "ml5-models-manifest-v1", model, createdAt: new Date().toISOString(), ml5Version: pkg.version, runtimes: {} };

    log(`Resolving ${model}…`, options.quiet);
    if (options.runtime === "mediapipe" || options.runtime === "both") {
      log(`  → staging MediaPipe assets`, options.quiet);
      manifest.runtimes.mediapipe = await copyMediaPipe({
        model,
        variant: options.variant,
        destination: runtimeDir(options.out, modelDirName, "mediapipe"),
        force: options.force,
      });
    }

    if (options.runtime === "tfjs" || options.runtime === "both") {
      const models = tfjsModels[model];
      if (!models) throw new Error(`Unknown model '${model}'`);
      log(`  → downloading TFJS assets`, options.quiet);
      manifest.runtimes.tfjs = { files: [], sources: {} };
      for (const key of Object.keys(models)) {
        const subdir = key === "model" ? "model" : key;
        const result = await downloadTfjsModel({
          name: key,
          url: models[key],
          destination: path.join(runtimeDir(options.out, modelDirName, "tfjs"), subdir),
          manifestPrefix: path.posix.join("tfjs", subdir),
          force: options.force,
        });
        manifest.runtimes.tfjs.sources[key] = result.source;
        manifest.runtimes.tfjs.files.push(...result.files);
      }
    }

    await fs.mkdir(root, { recursive: true });
    await writeManifest(root, manifest);
    log(`✓ ${model} ready at ${root}`, options.quiet);
  }
}

module.exports = { prefetch };
