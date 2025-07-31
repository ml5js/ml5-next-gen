const fs = require("node:fs/promises");
const path = require("path");

const examplesPath = path.join(__dirname, "../examples");

/**
 * Fetches version information from the npm registry for p5.js
 * @returns {Promise<Object>} Object containing latest versions for different tags
 */
async function getP5VersionsFromNpm() {
  const res = await fetch("https://registry.npmjs.org/p5");
  const data = await res.json();
  return {
    latest: data["dist-tags"].latest, // Latest 2.x version
    r1: data["dist-tags"].r1, // Latest 1.x version
  };
}

async function main() {
  console.log("Fetching p5.js versions from npm registry...");
  const versions = await getP5VersionsFromNpm();

  console.log(`Latest p5.js v1.x (r1): ${versions.r1}`);
  console.log(`Latest p5.js v2.x (latest): ${versions.latest}`);

  const sketches = await fs.readdir(examplesPath);

  for (const sketch of sketches) {
    const sketchPath = path.join(examplesPath, sketch);
    const sketchStat = await fs.stat(sketchPath);

    // Skip non-directory files like examples/README.md
    if (!sketchStat.isDirectory()) continue;

    const sketchFiles = await fs.readdir(sketchPath);
    for (const file of sketchFiles) {
      if (file === "index.html") {
        const filePath = path.join(sketchPath, file);
        const fileContent = await fs.readFile(filePath, "utf-8");

        let updatedContent = fileContent;

        // Check if this is a p5 2.0 example (has -p5-2.0 suffix)
        if (sketch.endsWith("-p5-2.0")) {
          // Update p5 2.x CDN links (cdn.jsdelivr.net)
          updatedContent = fileContent.replace(
            /https:\/\/cdn\.jsdelivr\.net\/npm\/p5@\d+\.\d+\.\d+\/lib\/p5\.js/,
            `https://cdn.jsdelivr.net/npm/p5@${versions.latest}/lib/p5.js`
          );
        } else {
          // Update p5 1.x CDN links (cdnjs.cloudflare.com)
          updatedContent = fileContent.replace(
            /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/p5\.js\/\d+\.\d+\.\d+\/p5(\.min)?\.js/,
            `https://cdnjs.cloudflare.com/ajax/libs/p5.js/${versions.r1}/p5.min.js`
          );
        }

        if (updatedContent !== fileContent) {
          await fs.writeFile(filePath, updatedContent);
          console.log(`Updated ${sketch}/${file}`);
        }
      }
    }
  }

  console.log("p5.js versions updated successfully!");
}

main();
