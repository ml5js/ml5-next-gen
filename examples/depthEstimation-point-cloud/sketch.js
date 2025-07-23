/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates rendering a point cloud using depth estimation on the webcam video.
 *
 * Use your mouse to drag and zoom the point cloud in 3D space.
 */

let depthEstimator;
let webcam;
let depthMap;

// Video dimensions
let videoWidth = 320;
let videoHeight = 240;

//Whether the data in the depthMap is new
let newDataAvailable = false;

let options = {
  dilationFactor: 2, // Default is 4, but since this image is smaller, we change it to 2 so as to not lose too much detail
};

function preload() {
  // Load and start the depth estimation model
  depthEstimator = ml5.depthEstimation(options);
}

function setup() {
  // Create a canvas larger than the video and turn on WEBGL mode for 3D
  createCanvas(videoWidth * 2, videoHeight * 2, WEBGL);

  // Create the video capture element
  webcam = createCapture(VIDEO);
  webcam.size(videoWidth, videoHeight); // Set video size
  webcam.hide(); // Hide the default HTML video element

  // Start continuous depth estimation on the webcam feed and make "gotResults" the callback function
  depthEstimator.estimateStart(webcam, gotResults);

  noStroke();
}

function draw() {
  //Turn on dragging and zooming with the mouse
  orbitControl();

  //If there is new depth data
  if (newDataAvailable) {
    background(0);
    webcam.loadPixels();

    //Go through each pixel in the webcam video
    for (let y = 0; y < webcam.height; y++) {
      for (let x = 0; x < webcam.width; x++) {
        //Get the depth value from the model (float, 0 - 1) where 0 is closest and 1 is farthest
        let depthAtPixel = depthMap.getDepthAt(x, y);

        //If this pixel has a valid depth; is not the background
        if (depthAtPixel > 0) {
          //Get the index for current pixel in webcam pixels array
          let index = (x + y * webcam.width) * 4;

          //Set the fill color as the color of this pixel
          fill(
            webcam.pixels[index + 0],
            webcam.pixels[index + 1],
            webcam.pixels[index + 2],
            255
          );

          //Draw a sphere at this pixel's position in 3D space
          //and color it the same as the pixel in the webcam video
          push();

          //Double the size to fill the canvas
          scale(2);

          //Align back to the top left corner of the canvas
          translate(-width / 2, -height / 2, 0);
          //Then, align the center of the video to the center of the canvas
          translate(webcam.width / 2, webcam.height / 2, 0);
          //Translate to the pixel's x and y, and make the z a scaled up version of the depth value
          translate(x, y, map(depthAtPixel, 0, 1, 200, -200));

          //Draw a small sphere at this pixel's position
          sphere(0.3);

          pop();
        }
      }
    }

    //The data is no longer new
    newDataAvailable = false;
  }
}

// Callback function that receives the depth estimation results
function gotResults(result) {
  // Store the latest result in the global variable depthMap
  depthMap = result;
  newDataAvailable = true;
}
