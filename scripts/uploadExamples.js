const fs = require("fs");
const dotenv = require("dotenv");
const objectID = require("bson-objectid");
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
 * @returns {String} The session ID.
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

  // Check if the credentials are valid.
  if (res.status == 401) {
    throw new Error(
      "Invalid credentials. Please maake sure the username and password are set correctly in the .env file."
    );
  } else if (res.status != 200) {
    throw new Error(
      "Failed to login to p5 web editor. p5 Server returned status code: " +
        res.status
    );
  }
  let sid = res.headers.get("set-cookie").split(";")[0].split("=")[1];
  return sid;
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
  if (res.status != 200) {
    console.log("🔴Failed to upload sketch: " + sketch.name);
  } else {
    if (manualUploadFlag) {
      console.log("🟡Manual upload of non-text file required: " + sketch.name);
      manualUploadFlag = false;
      console.log(manualUploadList);
    }
    console.log("🟢Successfully uploaded sketch: " + sketch.name);
  }
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
  if (!(res.status == 200 || res.status == 304)) {
    throw new Error(
      "Failed to get existing files. p5 Server returned status code: " +
        res.status
    );
  }
  return await res.json();
};

deleteFile = async (file) => {
  const res = await fetch(P5_URL + `/editor/projects/${file.id}`, {
    method: "DELETE",
    headers: {
      Cookie: `sessionId=${sessionID}`,
    },
  });
  if (res.status != 200) {
    console.log("🔴Failed to delete file: " + file.name);
  } else {
    console.log("🟢Successfully deleted file: " + file.name);
  }
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
  sessionID = await getP5SessionID();
  const sketchPaths = getFilepaths("examples");
  const oldFiles = await getExistingFiles();
  for (const file of oldFiles) {
    await deleteFile(file);
  }

  for (const sketchPath of sketchPaths) {
    const sketchObject = createSketchObject(sketchPath);
    await uploadSketch(sketchObject);
  }
}

main();
