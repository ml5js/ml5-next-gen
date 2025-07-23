/*
* 👋 Hello! This is an ml5.js example made and shared with ❤️.
* Learn more about the ml5.js project: https://ml5js.org
* ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
*
* This example demonstrates detecting objects in a video file through ml5.objectDetector.
*/

let video;
let detector;
let detections = [];
let canvasElement;

function preload(){
  detector = ml5.objectDetector("cocossd");
}

function setup() {
  // Create canvas with initial size - will be resized later
  canvasElement = createCanvas(640, 480);
  canvasElement.position(0, 0);
  
  // Create video element (paused by default)
  video = createVideo('test.mov');
  video.position(0, 0);
  video.volume(0);
  video.showControls();
  
  // Make canvas transparent and on top
  canvasElement.style('z-index', '1');
  canvasElement.style('pointer-events', 'none'); // Allow clicks to pass through to video
  video.style('z-index', '-1');
  
  // Set up video event listeners
  video.elt.addEventListener('loadedmetadata', () => {
    console.log('Video metadata loaded');

    // Resize canvas to match video size
    resizeCanvas(video.elt.videoWidth, video.elt.videoHeight);
  });
  
  video.elt.addEventListener('play', () => {
    console.log('Video started playing');

    // Start detection
    detector.detectStart(video, gotDetections);
  });
  
  video.elt.addEventListener('pause', () => {
    console.log('Video paused');

    // Stop detection when video is paused
    detector.detectStop();
  });
  
  video.elt.addEventListener('ended', () => {
    console.log('Video ended');
    
    // Stop detection when video ends
    detector.detectStop();
  });
}

function draw(){
  // Clear the canvas (this acts as the transparent overlay)
  clear();

  for (let i = 0; i < detections.length; i += 1) {
    let detection = detections[i];

    // Draw bounding box
    stroke(0, 255, 0);
    strokeWeight(4);
    noFill();
    rect(detection.x, detection.y, detection.width, detection.height);

    // Draw label
    noStroke();
    fill(255);
    textSize(24);
    text(detection.label, detection.x + 10, detection.y + 24);
  }
}

// Callback function is called each time the object detector finishes processing a frame.
function gotDetections(results) {
  // Update detections array with the new results
  detections = results;  
}