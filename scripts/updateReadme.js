/**
 * @file This script updates the version number in the README file.
 * The script reads the version number from the package.json file and updates the README file with the new version number.
 */

const ml5Version = require("../package.json").version;
const fs = require("fs");

const readmePath = "README.md";

/**
 * Generates the section of text with new version number to be inserted into the README.
 * @param {string} newVersionNumber - The new version number to be inserted into the README.
 * @returns {string} The new section of text to be inserted into the README.
 */
function makeNewVersionString(newVersionNumber) {
  const newVersionString = `<!-- Anchor for automatic version update script, do not remove this comment -->

- You can use the latest version (${newVersionNumber}) by adding it to the head section of your HTML document:

  **v${newVersionNumber}**

  \`\`\`html
  <script src="https://unpkg.com/ml5@${newVersionNumber}/dist/ml5.js"></script>
  \`\`\`

<!-- Anchor for automatic version update script, do not remove this comment -->`;

  return newVersionString;
}

/**
 * Updates the README version number to the new version number.
 * Point of entry for the script.
 */
function main() {
  const newVersionString = makeNewVersionString(ml5Version);

  console.log(`Updating README version number to ${ml5Version}...`);

  const readme = fs.readFileSync(readmePath, "utf8");
  const newReadme = readme.replace(
    /<!-- Anchor for automatic version update script, do not remove this comment -->([\s\S]*)<!-- Anchor for automatic version update script, do not remove this comment -->/g,
    newVersionString
  );

  fs.writeFileSync(readmePath, newReadme);
  console.log("🟢 README version number update successful!");
}
main();
