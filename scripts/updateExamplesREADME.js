const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const P5_URL = "https://editor.p5js.org";

/**
 * Get the session ID for the p5 web editor.
 *
 * @returns {Object} The response status code and the session ID
 */
async function getP5SessionID() {
  // The credentials for p5 web editor.
  const credentials = {
    email: process.env.P5_USERNAME,
    password: process.env.P5_PASSWORD,
  };

  const res = await fetch(P5_URL + "/editor/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  let sid;
  try {
    sid = res.headers.get("set-cookie").split(";")[0].split("=")[1];
  } catch (e) {}

  return { status: res.status, sid };
}

/**
 * Get the existing sketches on the p5 web editor.
 * @returns {Object} The response status code and the data
 */
async function getExistingSketches(sessionID) {
  const res = await fetch(
    P5_URL + `/editor/${process.env.P5_USERNAME}/projects`,
    {
      method: "GET",
      headers: {
        Cookie: `sessionId=${sessionID}`,
      },
    }
  );

  const data = await res.json();
  return { status: res.status, data };
}

/**
 * Get all example directories from the examples folder
 * @returns {Array} Array of example directory names
 */
function getExampleDirectories() {
  const examplesPath = path.join(__dirname, "../examples");
  return fs
    .readdirSync(examplesPath)
    .filter((item) => {
      const itemPath = path.join(examplesPath, item);
      return fs.statSync(itemPath).isDirectory() && !item.startsWith(".");
    })
    .sort();
}

/**
 * Categorize examples into p5.js 1.0 and 2.0 versions
 * @param {Array} examples - Array of example directory names
 * @returns {Object} Object with p5_1_0 and p5_2_0 arrays
 */
function categorizeExamples(examples) {
  const p5_1_0 = [];
  const p5_2_0 = [];

  examples.forEach((example) => {
    if (example.endsWith("-p5-2.0")) {
      // This is a p5.js 2.0 example
      p5_2_0.push(example);
    } else {
      // This is a p5.js 1.0 example
      p5_1_0.push(example);
    }
  });

  return { p5_1_0, p5_2_0 };
}

/**
 * Find the URL for an example in the p5.js editor
 * @param {string} exampleName - The name of the example
 * @param {Array} sketches - Array of sketches from p5.js editor
 * @returns {string|null} The URL of the sketch or null if not found
 */
function findSketchURL(exampleName, sketches) {
  const sketch = sketches.find(
    (sketch) => sketch.name.toLowerCase() === exampleName.toLowerCase()
  );
  return sketch ? `https://editor.p5js.org/ml5/sketches/${sketch.id}` : null;
}

/**
 * Generate the README content
 * @param {Object} categorizedExamples - Object with p5_1_0 and p5_2_0 arrays
 * @param {Array} sketches - Array of sketches from p5.js editor
 * @returns {string} The README content
 */
function generateREADME(categorizedExamples, sketches) {
  let content = `![ml5](https://user-images.githubusercontent.com/10605821/41332516-2ee26714-6eac-11e8-83e4-a40b8761e764.png)

## ml5.js Examples

**Explore in the p5.js Web Editor**

Jump right into experimenting with ml5.js — no local setup needed. Browse and run these example sketches directly in the p5.js Web Editor:

### p5.js 1.0 Examples

`;

  // Add p5.js 1.0 examples
  categorizedExamples.p5_1_0.forEach((example) => {
    const url = findSketchURL(example, sketches);
    if (url) {
      content += `* [${example}](${url})\n`;
    } else {
      content += `* ${example} *(not uploaded yet)*\n`;
    }
  });

  content += `
### p5.js 2.0 Examples

`;

  // Add p5.js 2.0 examples
  categorizedExamples.p5_2_0.forEach((example) => {
    const url = findSketchURL(example, sketches);
    if (url) {
      content += `* [${example}](${url})\n`;
    } else {
      content += `* ${example} *(not uploaded yet)*\n`;
    }
  });

  return content;
}

/**
 * Main function to update the README
 */
async function main() {
  console.log("🔄 Updating examples README...");

  // Get session ID
  console.log("📡 Getting session ID...");
  const sessionRes = await getP5SessionID();
  if (sessionRes.status == 401) {
    throw new Error("Please check your p5 credentials in the .env file.");
  } else if (sessionRes.status != 200) {
    throw new Error(
      `Failed to get session ID. The server returned status code: ${sessionRes.status}`
    );
  }
  console.log("🟢 Successfully obtained session ID.");

  // Get existing sketches
  console.log("📡 Fetching existing sketches...");
  const sketchesRes = await getExistingSketches(sessionRes.sid);
  if (sketchesRes.status != 200) {
    throw new Error(
      `Failed to get existing sketches. The server returned status code: ${sketchesRes.status}`
    );
  }
  console.log("🟢 Successfully fetched sketches.");

  // Get example directories
  const exampleDirs = getExampleDirectories();
  console.log(`📁 Found ${exampleDirs.length} example directories`);

  // Categorize examples
  const categorizedExamples = categorizeExamples(exampleDirs);
  console.log(
    `📊 Categorized: ${categorizedExamples.p5_1_0.length} p5.js 1.0, ${categorizedExamples.p5_2_0.length} p5.js 2.0`
  );

  // Generate README content
  const readmeContent = generateREADME(categorizedExamples, sketchesRes.data);

  // Write to file
  const readmePath = path.join(__dirname, "../examples/README.md");
  fs.writeFileSync(readmePath, readmeContent);
  console.log("🟢 Successfully updated examples/README.md");

  // Print summary
  console.log("\n📋 Summary:");
  console.log(`- p5.js 1.0 examples: ${categorizedExamples.p5_1_0.length}`);
  console.log(`- p5.js 2.0 examples: ${categorizedExamples.p5_2_0.length}`);
  console.log(
    `- Total sketches found on p5.js editor: ${sketchesRes.data.length}`
  );
}

main();
