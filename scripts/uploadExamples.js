const fs = require("fs");
const dotenv = require("dotenv");
const objectID = require("bson-objectid");
const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");
const ml5Version = require("../package.json").version;

dotenv.config();

const P5_URL = "https://editor.p5js.org";
const TEXT_FILE_REGEX =
  /.+\.(json|txt|csv|tsv|vert|frag|js|css|html|htm|jsx|xml|stl|mtl)$/i;

let sessionID = "";
const manualUploadList = [];
let manualUploadFlag = false;

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
 * upload a sketch on the p5 web editor.
 *
 * @param {Object} sketch - The sketch object.
 */
async function uploadSketch(sketch) {
  const res = await fetch(P5_URL + "/editor/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `sessionId=${sessionID}`,
    },
    body: JSON.stringify(sketch),
  });
  return res.status;
}

/**
 * Upload a binary file to the p5 web editor.
 * @param {string} filePath - The file path.
 * @returns
 *
 * @todo: This function does not work, non-text files need to be uploaded manually for now
 */
async function uploadFile(filePath) {
  const file = fs.readFileSync(filePath);
  const res = await fetch(P5_URL + "/editor/S3/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/octect-stream",
      Cookie: `sessionId=${sessionID}`,
    },
    body: file,
  });
  const data = await res.text();
  console.log(data);
  //const data = await res.json();
  //console.log(data);
  //return data;
}

/**
 * Get the existing files on the p5 web editor.
 * @returns {Object} The response status code and the data
 */
getExistingFiles = async () => {
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
};

/**
 * Delete a file from the p5 web editor.
 * @param {Object} file - The file object.
 * @returns {number} The status code of the response.
 */
deleteFile = async (file) => {
  const res = await fetch(P5_URL + `/editor/projects/${file.id}`, {
    method: "DELETE",
    headers: {
      Cookie: `sessionId=${sessionID}`,
    },
  });
  return res.status;
};

/**
 * Get the file path of each item in a given directory.
 *
 * @param {string} dir - The directory path.
 * @returns - An array of file paths.
 */
function getFilepaths(dir) {
  let files = [];
  fs.readdirSync(dir).forEach((file) => {
    files.push(`${dir}/${file}`);
  });
  return files;
}

/**
 * Check if a file is a text file.
 * @param {string} filename
 * @returns {boolean} True if the file is a text file, false otherwise.
 */
function isTextFile(filename) {
  return TEXT_FILE_REGEX.test(filename);
}

/**
 * Create a p5 file object from a file path.
 *
 * @param {string} fileID - The file ID.
 * @param {string} filePath - The file path.
 * @returns {Object} The file object.
 */
function createFileObject(fileID, filePath) {
  const filename = filePath.split("/").pop();
  let fileContent = "";
  if (isTextFile(filename)) {
    fileContent = fs.readFileSync(filePath, "utf8");
    fileContent = replaceWithCdnURL(fileContent);
  } else {
    //TODO: handle upload non-text files
    manualUploadList.push(filePath);
    manualUploadFlag = true;
    return null;
  }
  return {
    name: filename,
    id: fileID,
    _id: fileID,
    fileType: "file",
    content: fileContent,
  };
}

/**
 * Create a p5 folder object.
 * @param {s} folderID - The folder ID.
 * @param {string} folderPath - The folder path. If not provided, the folder will be root.
 * @returns {Object} The folder object.
 */
function createFolderObject(folderID, folderPath) {
  const folderName = folderPath ? folderPath.split("/").pop() : "root";
  return {
    name: folderName,
    id: folderID,
    _id: folderID,
    fileType: "folder",
    children: [],
    content: "",
  };
}

/**
 * Replace the local file path with the ml5.js CDN URL.
 * @param {string} content - The content of the file.
 * @returns {string} The content with the CDN URL.
 */
function replaceWithCdnURL(content) {
  return content.replace(
    "../../dist/ml5.js",
    `https://unpkg.com/ml5@${ml5Version}/dist/ml5.min.js`
  );
}

/**
 * Recursively add files and folders to the sketch object.
 * @param {*} currentPath - The current directory path
 * @param {*} fileArray - The array storing file and folder objects in the sketch.
 * @param {*} childrenArray - The array storing the children ids of the folder.
 */
async function recursiveAddFiles(currentPath, fileArray, childrenArray) {
  const filepaths = getFilepaths(currentPath);
  filepaths.forEach((filePath) => {
    const fileID = objectID().toString();
    if (fs.lstatSync(filePath).isDirectory()) {
      const folder = createFolderObject(fileID, filePath);
      fileArray.push(folder);
      childrenArray.push(fileID);
      recursiveAddFiles(filePath, fileArray, folder.children);
    } else {
      const fileObject = createFileObject(fileID, filePath);
      if (fileObject) {
        fileArray.push(fileObject);
        childrenArray.push(fileID);
      }
    }
  });
}

/**
 * Create a p5 sketch object from a given sketch path.
 * @param {*} sketchDirPath
 * @returns {Object} The sketch object.
 */
function createSketchObject(sketchDirPath) {
  const rootID = objectID().toString();
  const sketchName = sketchDirPath.split("/").pop();
  const sketch = {
    name: sketchName,
    files: [createFolderObject(rootID)],
  };

  recursiveAddFiles(sketchDirPath, sketch.files, sketch.files[0].children);

  // Set the sketch.js file as the default selected file.
  for (const file of sketch.files) {
    if (file.name == "sketch.js") {
      file.isSelectedFile = true;
      break;
    }
  }

  return sketch;
}

/**
 * Entry point of the script.
 * This script uploads each sketch in the examples to the server.
 */
async function main() {
  // Confirm that the user wants to upload the examples.
  const rl = readline.createInterface({ input, output });
  const response = await rl.question(
    "This script will delete all existing sketches on the p5 web editor and upload the local examples. Please enter 'confirm' to proceed: "
  );
  if (response != "confirm") {
    rl.close();
    console.log("The upload was cancelled.");
    process.exit(0);
  } else {
    console.log("Proceeding with the deletion and upload...");
    rl.close();
  }

  // Get the session ID.
  console.log("Obtaining session ID...");
  const sessionRes = await getP5SessionID();
  if (sessionRes.status == 401) {
    console.log("🔴 Please check your p5 credentials in the .env file.");
    process.exit(1);
  } else if (sessionRes.status != 200) {
    console.log(
      "🔴 Failed to get session ID. The server returned status code: " +
        sessionRes.status
    );
    process.exit(1);
  }
  console.log("🟢 Successfully obtained session ID.");
  sessionID = sessionRes.sid;
  console.log();

  // Delete existing files.
  console.log("Deleting existing files...");
  const getFilesRes = await getExistingFiles();
  if (getFilesRes.status != 200) {
    console.log(
      "🔴 Failed to get existing files. The server returned status code: " +
        getFilesRes.status
    );
    process.exit(1);
  }
  const oldFiles = getFilesRes.data;
  for (const file of oldFiles) {
    const status = await deleteFile(file);
    if (status != 200) {
      console.log("🔴 Failed to delete sketch: " + file.name);
      console.log("The server returned status code: " + res.status);
    } else {
      console.log("🟢 Successfully deleted sketch: " + file.name);
    }
  }
  console.log();

  // Upload each sketch.
  console.log("Uploading sketches...");
  const sketchPaths = getFilepaths("examples");
  for (const sketchPath of sketchPaths) {
    const sketchObject = createSketchObject(sketchPath);
    const status = await uploadSketch(sketchObject);
    if (status != 200) {
      console.log("🔴 Failed to upload sketch: " + sketchPath);
      console.log("The server returned status code: " + res.status);
    } else {
      if (manualUploadFlag) {
        console.log("🟡 Partially uploaded sketch: " + sketchPath);
        for (const file of manualUploadList) {
          console.log("    Please manually Upload: " + file);
        }
        manualUploadList.splice(0, manualUploadList.length);
        manualUploadFlag = false;
      } else {
        console.log("🟢 Successfully uploaded sketch: " + sketchPath);
      }
    }
  }
}
main();
