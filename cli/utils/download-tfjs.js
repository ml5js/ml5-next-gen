const fs = require("node:fs/promises");
const path = require("node:path");
const { pipeline } = require("node:stream/promises");
const { Readable } = require("node:stream");
const { sha256File } = require("./sha");

function toModelJsonUrl(url) {
  if (url.includes("tfhub.dev")) return `${url.replace(/\/+$/, "")}/model.json?tfjs-format=file`;
  return url.endsWith("model.json") ? url : `${url.replace(/\/+$/, "")}/model.json`;
}

function dirnameUrl(url) {
  return url.replace(/\/model\.json(?:\?.*)?$/, "").replace(/\/+$/, "");
}

function toShardUrl(base, shard) {
  if (/^https?:\/\//i.test(shard)) return shard;
  const url = `${base}/${shard}`;
  return base.includes("tfhub.dev") ? `${url}?tfjs-format=file` : url;
}

async function download(url, filePath, force) {
  if (!force) {
    try {
      await fs.access(filePath);
      return;
    } catch (error) {}
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await pipeline(Readable.fromWeb(response.body), await fs.open(filePath, "w").then((fh) => fh.createWriteStream()));
}

async function downloadTfjsModel({ name, url, destination, manifestPrefix, force = false }) {
  const modelJsonUrl = toModelJsonUrl(url);
  const response = await fetch(modelJsonUrl);
  if (!response.ok) throw new Error(`Failed to download ${modelJsonUrl}: HTTP ${response.status}`);
  const modelJson = await response.text();
  await fs.mkdir(destination, { recursive: true });
  const modelJsonPath = path.join(destination, "model.json");
  await fs.writeFile(modelJsonPath, modelJson);
  const model = JSON.parse(modelJson);
  const base = dirnameUrl(modelJsonUrl);
  for (const group of model.weightsManifest || []) {
    for (const shard of group.paths || []) {
      await download(toShardUrl(base, shard), path.join(destination, shard), force);
    }
  }
  const localFiles = ["model.json", ...new Set((model.weightsManifest || []).flatMap((group) => group.paths || []))];
  const files = [];
  for (const file of localFiles) {
    const fullPath = path.join(destination, file);
    const stat = await fs.stat(fullPath);
    files.push({ path: path.posix.join(manifestPrefix, file), size: stat.size, sha256: await sha256File(fullPath) });
  }
  return { name, source: url, files };
}

module.exports = { downloadTfjsModel };
