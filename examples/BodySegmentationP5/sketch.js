// Copyright (c) 2020 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
BodyPix
=== */

let bodypix;
let video;
let segmentation;
let i = 1;

const options = {
  outputStride: 32,  //16 or 32 for ResNet, 
  multiSegmentation: false,
  segmentBodyParts: true
}

// function preload() {
//   bodypix = ml5.bodyPix(options);
//   // GH: it appears like preload() does not wait for bodyPix to finish
//   // loading before setup is called
// }

function setup() {
  bodypix = ml5.bodyPix(options);
  createCanvas(320, 240);
  // load up your video
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  // video.hide(); // Hide the video element, and just show the canvas
}

function videoReady() {
  bodypix.segmentWithParts(video, gotResults, options);
//   // GH: workaround for the preload issue()
//   let checkIfBodypixIsReady = function() {
//     if (typeof bodypix == 'object' && bodypix.ready) {
//       bodypix.segmentWithParts(video, gotResults, options); 
//       // console.log('Yay');     
//     } else {
//       setTimeout(checkIfBodypixIsReady, 500);
//     }
//   }
//   checkIfBodypixIsReady();
  
}

function gotResults(err, result) {
  console.log("gotResults is called the", i,"th time.");
  if (err) {
    console.log(err);
    return;
  }
  segmentation = result;

  background(255, 0, 0);
  image(video, 0, 0, width, height)
  // GH: segmentation.partMask is an ImageData object
  // it appears like p5 can't draw those to the canvas directly
  image(segmentation.partMask, 0, 0, width, height);
  bodypix.segmentWithParts(video, gotResults, options);
  i = i + 1;
}
