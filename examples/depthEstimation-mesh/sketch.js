/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates building and texturing a 3D mesh using depth estimation on the webcam video.
 *
 * Use your mouse to drag and zoom the 3D mesh in space.
 */

let depthEstimator;
let webcam;
let depthMap;
let mesh;

// Video dimensions,
// making them smaller will increase speed
// but will also reduce the accuracy of the depth map
let videoWidth = 320;
let videoHeight = 240;

// Whether the data in the depthMap is new
let newDataAvailable = false;

let options = {
  // Default is 4, but since this image is smaller, we change it to 2 so as to not lose too much detail
  dilationFactor: 2,
};

async function setup() {
  // Load the depth estimation model
  depthEstimator = await ml5.depthEstimation(options);

  // Create a canvas larger than the video and turn on WEBGL mode for 3D
  createCanvas(videoWidth * 2, videoHeight * 2, WEBGL);

  // Create the video capture element
  webcam = createCapture(VIDEO);
  webcam.size(videoWidth, videoHeight); // Set video size
  webcam.hide(); // Hide the default HTML video element

  mesh = new p5.Geometry();

  // Start continuous depth estimation on the webcam feed and make "gotResults" the callback function
  depthEstimator.estimateStart(webcam, gotResults);

  noStroke();
}

function draw() {
  // Turn on dragging and zooming with the mouse
  orbitControl();

  // If there is new depth data
  if (newDataAvailable) {
    background(0);

    // Clear the mesh geometry to start fresh
    freeGeometry(mesh);
    mesh = new p5.Geometry();

    // Go through each pixel in the webcam video
    for (let y = 0; y < webcam.height; y++) {
      for (let x = 0; x < webcam.width; x++) {
        // Get the depth value from the model (float, 0 - 1) where 0 is closest and 1 is farthest
        let depthAtPixel = depthMap.getDepthAt(x, y);

        // Get the index for current pixel in webcam pixels array
        let index = (x + y * webcam.width) * 4;

        //Get the z depth value for the current pixel and scale it up
        let z = map(depthAtPixel, 0, 1, 200, -200);

        // Create the vertex as a vector and set its UV coordinates for texturing
        // 3D pixels can be called voxels
        const voxel = createVector(x, y, z);
        mesh.vertices.push(voxel);
        mesh.uvs.push(x / webcam.width, y / webcam.height);

        // For every pixel up to the edges
        if (x < webcam.width - 1 && y < webcam.height - 1) {
          // Divide index by 4 to get the voxel number in the list of vertices
          let voxelIndex = index / 4;

          //Let's get the 4 vertices of this "zone" of the mesh
          let a = voxelIndex; // Current pixel
          let b = voxelIndex + 1; // x + 1 pixel
          let c = voxelIndex + webcam.width; // y + 1 pixel
          let d = voxelIndex + webcam.width + 1; // x + 1 and y + 1 pixel

          // Lets get the depth values for each of the 4 vertices
          const aDepth = depthMap.getDepthAt(x, y);
          const bDepth = depthMap.getDepthAt(x + 1, y);
          const cDepth = depthMap.getDepthAt(x, y + 1);
          const dDepth = depthMap.getDepthAt(x + 1, y + 1);

          // Each "zone" with 4 vertices consists of two
          // adjacent triangles: abc and bdc

          // Only add them if they are not part of 
          // the background, meaning their depth is not 0.
          if (!(aDepth === 0 || bDepth === 0 || cDepth === 0)) {
            // First triangle
            mesh.faces.push([a, b, c]);
          }
          
          if (!(bDepth === 0 || dDepth === 0 || cDepth === 0)) {
            // Second triangle
            mesh.faces.push([b, d, c]);
          }
        }
      }
    }

    // Calculate the orientation of the faces in the mesh
    mesh.computeNormals();
    push();

    // Double the size to fill the canvas
    scale(2);

    // Align the mesh to the center of the canvas
    translate(-videoWidth / 2, -videoHeight / 2, 0);

    // Set the video frame that was used to create the depth map as the texture of the mesh
    texture(depthMap.sourceFrame);
    model(mesh);

    pop();

    // The data is no longer new
    newDataAvailable = false;
  }
}

// Callback function that receives the depth estimation results
function gotResults(result) {
  // Store the latest result in the global variable depthMap
  depthMap = result;
  newDataAvailable = true;
}
