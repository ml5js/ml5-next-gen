let canvas;
let ctx;
let imageElement;
let objectDetector;

async function setup() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  imageElement = new Image();
  imageElement.src = "dimmy.jpg";
  imageElement.onload = async () => {
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);

    objectDetector = await cocoSsd.load();
    console.log("Object Detector Loaded");

    detectObjects();
  };
}

async function detectObjects() {
  const results = await objectDetector.detect(canvas);
  console.log(results);

  drawResults(results);
}

function drawResults(objects) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(imageElement, 0, 0);

  objects.forEach((object) => {
    ctx.beginPath();
    ctx.rect(object.bbox[0], object.bbox[1], object.bbox[2], object.bbox[3]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.stroke();

    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(
      object.class,
      object.bbox[0],
      object.bbox[1] > 10 ? object.bbox[1] - 5 : 10
    );
  });
}

setup();
