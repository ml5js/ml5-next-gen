/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates the Ramer–Douglas–Peucker algorithm to adjust points from a variable length to a target length.
 */
let allPoints = [];
const targetPointCount = 10; // Desired number of points
let maxEpsilon = 30; // Adjust as needed

function setup() {
  createCanvas(600, 400);
  background(0);
  clearButton = createButton("clear screen");
  clearButton.mousePressed(clearScreen);
}

function draw() {
  background(0);

  if (mouseIsPressed && mouseY < height && mouseX < width) {
    allPoints.push(createVector(mouseX, mouseY));
  }

  if (allPoints.length > 10) {
    rpdeia();
  }
}

function rpdeia() {
  const rdpPoints = [];

  const epsilon = findEpsilonForPointCount(allPoints, targetPointCount);

  const total = allPoints.length;
  const start = allPoints[0];
  const end = allPoints[total - 1];
  rdpPoints.push(start);
  rdp(0, total - 1, allPoints, rdpPoints, epsilon);
  rdpPoints.push(end);

  stroke(255, 0, 255);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let v of allPoints) {
    vertex(v.x, v.y);
  }
  endShape();

  stroke(255);
  strokeWeight(2);
  beginShape();
  for (let v of rdpPoints) {
    vertex(v.x, v.y);
  }
  endShape();

  fill(255);
  noStroke();
  textSize(24);
  text("mouse-created points: " + allPoints.length, 20, 25);
  text("rdp-created points: " + rdpPoints.length, 20, 50);
}

function findEpsilonForPointCount(points, targetCount) {
  let low = 0;
  let high = maxEpsilon;
  let mid;
  let simplifiedPointsCount = 0;

  while (high - low > 0.001) {
    // Tolerance for approximation
    mid = (low + high) / 2;
    simplifiedPointsCount = getSimplifiedPointCount(points, mid);
    if (simplifiedPointsCount > targetCount) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return mid;
}

function getSimplifiedPointCount(points, epsilon) {
  const rdpPoints = [];
  const total = points.length;
  const start = points[0];
  const end = points[total - 1];
  rdpPoints.push(start);
  rdp(0, total - 1, points, rdpPoints, epsilon);
  rdpPoints.push(end);
  return rdpPoints.length;
}

function rdp(startIndex, endIndex, allPoints, rdpPoints, epsilon) {
  const nextIndex = findFurthest(allPoints, startIndex, endIndex, epsilon);
  if (nextIndex > 0) {
    if (startIndex != nextIndex) {
      rdp(startIndex, nextIndex, allPoints, rdpPoints, epsilon);
    }
    rdpPoints.push(allPoints[nextIndex]);
    if (endIndex != nextIndex) {
      rdp(nextIndex, endIndex, allPoints, rdpPoints, epsilon);
    }
  }
}

function findFurthest(points, a, b, epsilon) {
  let recordDistance = -1;
  const start = points[a];
  const end = points[b];
  let furthestIndex = -1;
  for (let i = a + 1; i < b; i++) {
    const currentPoint = points[i];
    const d = lineDist(currentPoint, start, end);
    if (d > recordDistance) {
      recordDistance = d;
      furthestIndex = i;
    }
  }
  if (recordDistance > epsilon) {
    return furthestIndex;
  } else {
    return -1;
  }
}

function lineDist(c, a, b) {
  const norm = scalarProjection(c, a, b);
  return p5.Vector.dist(c, norm);
}

function scalarProjection(p, a, b) {
  const ap = p5.Vector.sub(p, a);
  const ab = p5.Vector.sub(b, a);
  ab.normalize(); // Normalize the line
  ab.mult(ap.dot(ab));
  const normalPoint = p5.Vector.add(a, ab);
  return normalPoint;
}

function clearScreen() {
  allPoints = [];
  background(0);
}
