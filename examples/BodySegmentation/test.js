let bodypix;
let video;
let canvas, ctx;
const width = 480;
const height = 360;

const options = {
  outputStride: 8, // 8, 16, or 32, default is 16
  quantBytes: 2, //0, 2, or 4, default is 2
}

async function setup() {
  // create a canvas to draw to
  canvas = createCanvas(width, height);
  ctx = canvas.getContext('2d');
  // get the video
  video = await getVideo();
  // load bodyPix with video
  bodypix = await ml5.bodyPix(options)
}