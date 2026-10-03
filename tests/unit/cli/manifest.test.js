const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { writeManifest, readManifest, verifyManifest } = require("../../../cli/utils/manifest");
const { sha256File } = require("../../../cli/utils/sha");

describe("CLI manifest utilities", () => {
  test("writes, reads, and verifies a manifest", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ml5-manifest-"));
    await fs.mkdir(path.join(dir, "tfjs"));
    const filePath = path.join(dir, "tfjs", "model.json");
    await fs.writeFile(filePath, "{}");
    const stat = await fs.stat(filePath);
    const manifest = {
      runtimes: {
        tfjs: {
          files: [{ path: "tfjs/model.json", size: stat.size, sha256: await sha256File(filePath) }],
        },
      },
    };
    await writeManifest(dir, manifest);
    const read = await readManifest(dir);
    expect(read.runtimes.tfjs.files).toHaveLength(1);
    const results = await verifyManifest(dir, read);
    expect(results[0].ok).toBe(true);
  });
});
