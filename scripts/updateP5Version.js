const fs = require("node:fs/promises");
const path = require("path");

const examplesPath = path.join(__dirname, "../examples");
/**
 * a function that fetches the latest version of p5.js from the GitHub API
 * @returns {Promise<string>} The latest version of p5.js
 */
async function getP5Version() {
  const res = await fetch(
    "https://api.github.com/repos/processing/p5.js/releases/latest"
  );
  const data = await res.json();
  const version = data.tag_name.slice(1);
  return version;
}

async function main() {
  const version = await getP5Version();
  console.log(`Updating p5.js to version ${version}...`);

  const sketches = await fs.readdir(examplesPath);

  for (const sketch of sketches) {
    const sketchFiles = await fs.readdir(path.join(examplesPath, sketch));
    for (const file of sketchFiles) {
      if (file === "index.html") {
        const filePath = path.join(examplesPath, sketch, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const updatedContent = fileContent.replace(
          /https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/p5.js\/\d+\.\d+\.\d+\/p5(\.min)?\.js/,
          `https://cdnjs.cloudflare.com/ajax/libs/p5.js/${version}/p5.min.js`
        );
        await fs.writeFile(filePath, updatedContent);
      }
    }
  }

  console.log("p5.js version updated successfully!");
}

main();
