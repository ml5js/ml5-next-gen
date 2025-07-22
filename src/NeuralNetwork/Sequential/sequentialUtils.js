import { data, input } from "@tensorflow/tfjs";
import nnUtils from "../NeuralNetworkUtils";

class SequentialUtils {
  constructor(options) {
    this.options = options || {};
  }

  /* adding data: can only accept the following formats:
     - for xInputs:
      1. Sequence of objects (array of objects) 
        [{x: , y: },{x: , y: },{x: , y: },{x: , y: }]
      2. Sequence of arrays (array of array, order matters)
        [[],[],[],[]]
  */
  /**
   * verifyAndFormatInputs
   * @param {*} xInputs
   * @param {*} options
   * @param {*} classOptions
   */
  verifyAndFormatInputs(xInputs, options = null, classOptions) {
    const dataFormat = this.checkInputStructure(xInputs, options);
    return this.formatInputsToObjects(
      xInputs,
      options,
      classOptions,
      dataFormat
    );
  }

  checkInputStructure(xInputs, options = null) {
    if (!Array.isArray(xInputs)) {
      throw new error("Syntax Error: Data Should be in an Array");
    }
    let isObjects = true;
    let isArrays = true;
    let isValues = true;

    for (let i = 0; i < xInputs.length; i++) {
      if (nnUtils.getDataType(xInputs[i]) === "object") {
        isArrays = false;
        isValues = false;
        if (i > 0) {
          if (
            Object.keys(xInputs[i - 1]).length !==
              Object.keys(xInputs[i]).length ||
            nnUtils.getDataType(xInputs[i - 1]) === "object"
          ) {
            throw new error("Data format is inconsistent");
          }
        }
      } else if (Array.isArray(xInputs[i])) {
        isObjects = false;
        isValues = false;
        if (i > 0) {
          if (
            xInputs[i - 1].length !== xInputs[i].length ||
            !Array.isArray(xInputs[i - 1])
          ) {
            throw new error("Data format is inconsistent");
          }
        }
      } else {
        if (options.inputLabels) {
          isObjects = false;
          isArrays = false;
        } else {
          throw new error("inputLabels is needed for 1D array inputs");
        }
      }

      if (isObjects) {
        return "ObjectSequence";
      } else if (isArrays) {
        return "ArraySequence";
      } else if (isValues) {
        return "ValueSequence";
      } else {
        throw new error("Syntax Error: Input Structure is unknown");
      }
    }
  }

  formatInputsToObjects(xInputs, options = null, classOptions, dataFormat) {
    switch (dataFormat) {
      case "ObjectSequence":
        return xInputs;
      case "ArraySequence":
        return this.convertArraySequence(xInputs, options, classOptions);
      case "ValueSequence":
        return this.convertValueSequence(xInputs, options);
      default:
        throw new error("Input Data Structure is unknown");
    }
  }

  convertArraySequence(xInputs, options = null, classOptions) {
    let label = "";

    if (options !== null) {
      if (options.inputLabels) {
        label = options.inputLabels;
      }
    } else if (classOptions !== null) {
      if (classOptions.inputs) {
        label = classOptions.inputs;
      }
    }

    if (
      (typeof label === "string" && label === "") ||
      (Array.isArray(label) && label.length === 0)
    ) {
      label = this.getLabelFromNestedArray(xInputs);
    }

    return xInputs.map((input) => {
      const obj = {};
      input.forEach((value, ind) => {
        obj[label[ind]] = value;
      });
      return obj;
    });
  }

  convertValueSequence(xInputs, options = null) {
    const { inputLabels } = options;
    if (xInputs.length % inputLabels.length !== 0) {
      throw new error(
        "Invalid Input: Number of Labels don't match amount of values"
      );
    }
    return xInputs.reduce((acc, _, index, array) => {
      if (index % inputLabels.length === 0) {
        // Create a new object for the current set of values
        const obj = {};
        for (let i = 0; i < inputLabels.length; i++) {
          obj[inputLabels[i]] = array[index + i];
        }
        acc.push(obj);
      }
      return acc;
    }, []);
  }

  verifyAndFormatOutputs(yInputs, options = null, classOptions) {
    const { outputs } = classOptions;

    let outputLabels;

    if (options !== null) {
      if (options.outputLabels) {
        outputLabels = options.outputLabels;
      }
    }

    if (outputs.length > 0) {
      if (outputs.every((item) => typeof item === "string")) {
        outputLabels = outputs;
      }
    } else if (typeof yInputs === "object") {
      outputLabels = Object.keys(yInputs);
    } else {
      outputLabels = nnUtils.createLabelsFromArrayValues(yInputs, "output");
    }

    // Make sure that the inputLabels and outputLabels are arrays
    if (!(outputLabels instanceof Array)) {
      throw new Error("outputLabels must be an array");
    }

    return nnUtils.formatDataAsObject(yInputs, outputLabels);
  }

  prepareLabels(xInputs, yInputs, options = null, classOptions) {
    const { inputs, outputs } = this.options;

    let inputLabels;
    let outputLabels;

    // options-based values to assign
    if (options !== null) {
      ({ inputLabels, outputLabels } = options);
    } else if (inputs.length > 0 && outputs.length > 0) {
      if (inputs.every((item) => typeof item === "string")) {
        inputLabels = inputs;
      }
      if (outputs.every((item) => typeof item === "string")) {
        outputLabels = outputs;
      }

      // input-based values to assign
    } else {
      inputLabels = this.getLabelFromNestedArray(xInputs);
      if (typeof yInputs === "object") {
        outputLabels = Object.keys(yInputs);
      } else {
        inputLabels = this.getLabelFromNestedArray(yInputs);
      }
    }

    // Make sure that the inputLabels and outputLabels are arrays
    if (!(inputLabels instanceof Array)) {
      throw new Error("inputLabels must be an array");
    }
    if (!(outputLabels instanceof Array)) {
      throw new Error("outputLabels must be an array");
    }

    return inputLabels, outputLabels;
  }

  getLabelFromNestedArray(xInputs, prefix = "label") {
    // Recursive function to find the deepest level of the array
    function traverseArray(array) {
      if (
        array.length > 0 &&
        (typeof array[0] === "string" || typeof array[0] === "number")
      ) {
        return array.map((_, index) => `${prefix}_${index}`);
      } else {
        for (const item of array) {
          if (Array.isArray(item)) {
            const result = traverseArray(item);
            if (result) return result;
          }
        }
      }
      return null;
    }

    if (Array.isArray(xInputs)) {
      return traverseArray(xInputs);
    } else {
      throw new Error("Input data must be an array.");
    }
  }

  // normalize utilities
  reshapeTo3DArray(data, shape) {
    const [batch, timeStep, feature] = shape;
    let result = [];
    let index = 0;

    for (let i = 0; i < batch; i++) {
      let batchArray = [];
      for (let j = 0; j < timeStep; j++) {
        let timeStepArray = [];
        for (let k = 0; k < feature; k++) {
          timeStepArray.push(data[index]);
          index++;
        }
        batchArray.push(timeStepArray);
      }
      result.push(batchArray);
    }

    return result;
  }

  zipArraySequence(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      console.error("arrays do not have the same length");
      return [];
    }

    return arr1.map((xs, idx) => {
      const ys = arr2[idx].ys; // Extract the inner `ys` object
      return {
        xs: xs,
        ys: ys,
      };
    });
  }

  // point simplification utilities - Ramer-Douglas-Peucker (RDP) algorithm
  padCoordinates(allPoints, targetPointCount, maxEpsilon = 50) {
    if (allPoints.length === 0) return [];

    // Check if it's an array of objects with .x and .y properties
    if (this.isObjectFormat(allPoints[0])) {
      // Original format: array of objects with .x and .y
      return this.simplifyObjectCoordinates(
        allPoints,
        targetPointCount,
        maxEpsilon
      );
    }

    // Array format
    const numColumns = allPoints[0].length;

    if (numColumns === 2) {
      // Simple case: [n,2] - just one pair of coordinates
      return this.simplifyCoordinatePair(
        allPoints,
        targetPointCount,
        maxEpsilon
      );
    } else if (numColumns % 2 === 0) {
      // Multiple coordinate pairs: [n,42] -> 21 pairs
      const numPairs = numColumns / 2;
      const simplifiedPairs = [];

      // Process each coordinate pair separately
      for (let pairIndex = 0; pairIndex < numPairs; pairIndex++) {
        const coordinatePair = this.extractCoordinatePair(allPoints, pairIndex);
        const simplified = this.simplifyCoordinatePair(
          coordinatePair,
          targetPointCount,
          maxEpsilon
        );
        simplifiedPairs.push(simplified);
      }

      // Recombine all simplified pairs back into [targetPointCount, 42] format
      return this.recombineCoordinatePairs(simplifiedPairs, targetPointCount);
    } else {
      throw new Error(
        `Invalid array format: expected even number of columns, got ${numColumns}`
      );
    }
  }

  // Check if data is in object format (has .x and .y properties)
  isObjectFormat(point) {
    return (
      point &&
      typeof point === "object" &&
      typeof point.x === "number" &&
      typeof point.y === "number"
    );
  }

  // Handle original object format - your exact original algorithm
  simplifyObjectCoordinates(allPoints, targetPointCount, maxEpsilon) {
    const rdpPoints = [];
    const epsilon = this.findEpsilonForPointCountObjects(
      allPoints,
      targetPointCount,
      maxEpsilon
    );
    const total = allPoints.length;
    const start = allPoints[0];
    const end = allPoints[total - 1];

    rdpPoints.push(start);
    this.rdpObjects(0, total - 1, allPoints, rdpPoints, epsilon);
    rdpPoints.push(end);

    if (rdpPoints.length > targetPointCount) {
      return rdpPoints.slice(0, targetPointCount);
    } else if (rdpPoints.length < targetPointCount) {
      const filler = new Array(targetPointCount - rdpPoints.length).fill(
        rdpPoints[rdpPoints.length - 1]
      );
      rdpPoints.push(...filler);
      return rdpPoints;
    }
    return rdpPoints;
  }

  // Original object-based helper functions
  findEpsilonForPointCountObjects(points, targetCount, maxEpsilon) {
    let low = 0;
    let high = maxEpsilon;
    let mid;
    let simplifiedPointsCount = 0;

    while (high - low > 0.001) {
      mid = (low + high) / 2;
      simplifiedPointsCount = this.getSimplifiedPointCountObjects(points, mid);
      if (simplifiedPointsCount > targetCount) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return mid;
  }

  getSimplifiedPointCountObjects(points, epsilon) {
    const rdpPoints = [];
    const total = points.length;
    const start = points[0];
    const end = points[total - 1];
    rdpPoints.push(start);
    this.rdpObjects(0, total - 1, points, rdpPoints, epsilon);
    rdpPoints.push(end);
    return rdpPoints.length;
  }

  rdpObjects(startIndex, endIndex, allPoints, rdpPoints, epsilon) {
    const nextIndex = this.findFurthestObjects(
      allPoints,
      startIndex,
      endIndex,
      epsilon
    );
    if (nextIndex > 0) {
      if (startIndex !== nextIndex) {
        this.rdpObjects(startIndex, nextIndex, allPoints, rdpPoints, epsilon);
      }
      rdpPoints.push(allPoints[nextIndex]);
      if (endIndex !== nextIndex) {
        this.rdpObjects(nextIndex, endIndex, allPoints, rdpPoints, epsilon);
      }
    }
  }

  findFurthestObjects(points, a, b, epsilon) {
    let recordDistance = -1;
    const start = points[a];
    const end = points[b];
    let furthestIndex = -1;

    for (let i = a + 1; i < b; i++) {
      const currentPoint = points[i];
      const d = this.lineDistObjects(currentPoint, start, end);
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

  lineDistObjects(c, a, b) {
    const norm = this.scalarProjectionObjects(c, a, b);
    return Math.sqrt(Math.pow(c.x - norm.x, 2) + Math.pow(c.y - norm.y, 2));
  }

  scalarProjectionObjects(p, a, b) {
    const ap = { x: p.x - a.x, y: p.y - a.y };
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const abMag = Math.sqrt(ab.x * ab.x + ab.y * ab.y);

    if (abMag === 0) {
      return a;
    }

    ab.x /= abMag;
    ab.y /= abMag;
    const dot = ap.x * ab.x + ap.y * ab.y;
    return { x: a.x + ab.x * dot, y: a.y + ab.y * dot };
  }

  // Extract one coordinate pair from the data
  extractCoordinatePair(allPoints, pairIndex) {
    const coordinatePair = [];
    const xIndex = pairIndex * 2;
    const yIndex = pairIndex * 2 + 1;

    for (let i = 0; i < allPoints.length; i++) {
      coordinatePair.push([allPoints[i][xIndex], allPoints[i][yIndex]]);
    }

    return coordinatePair;
  }

  // Simplify a single coordinate pair using RDP
  simplifyCoordinatePair(coordinatePair, targetPointCount, maxEpsilon) {
    const rdpPoints = [];
    const epsilon = this.findEpsilonForPointCount(
      coordinatePair,
      targetPointCount,
      maxEpsilon
    );
    const total = coordinatePair.length;

    if (total <= 2) {
      // If we have 2 or fewer points, just pad to target
      return this.padToTarget(coordinatePair, targetPointCount);
    }

    const start = coordinatePair[0];
    const end = coordinatePair[total - 1];

    rdpPoints.push(start);
    this.rdp(0, total - 1, coordinatePair, rdpPoints, epsilon);
    rdpPoints.push(end);

    // Remove duplicates and sort by original order
    const uniquePoints = this.removeDuplicatesAndSort(
      rdpPoints,
      coordinatePair
    );

    return this.padToTarget(uniquePoints, targetPointCount);
  }

  // Recombine simplified coordinate pairs back into original format
  recombineCoordinatePairs(simplifiedPairs, targetPointCount) {
    const result = [];

    for (let i = 0; i < targetPointCount; i++) {
      const row = [];
      for (let pairIndex = 0; pairIndex < simplifiedPairs.length; pairIndex++) {
        const pair = simplifiedPairs[pairIndex][i];
        row.push(pair[0], pair[1]); // x, y
      }
      result.push(row);
    }

    return result;
  }

  // Remove duplicates and maintain original order
  removeDuplicatesAndSort(rdpPoints, originalPoints) {
    const seen = new Set();
    const unique = [];

    // Create a map of original indices
    const indexMap = new Map();
    for (let i = 0; i < originalPoints.length; i++) {
      const key = `${originalPoints[i][0]},${originalPoints[i][1]}`;
      if (!indexMap.has(key)) {
        indexMap.set(key, i);
      }
    }

    // Sort by original index and remove duplicates
    rdpPoints.sort((a, b) => {
      const keyA = `${a[0]},${a[1]}`;
      const keyB = `${b[0]},${b[1]}`;
      return indexMap.get(keyA) - indexMap.get(keyB);
    });

    for (const point of rdpPoints) {
      const key = `${point[0]},${point[1]}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(point);
      }
    }

    return unique;
  }

  // Pad array to target length
  padToTarget(points, targetPointCount) {
    if (points.length > targetPointCount) {
      return points.slice(0, targetPointCount);
    } else if (points.length < targetPointCount) {
      const filler = new Array(targetPointCount - points.length).fill(
        points[points.length - 1]
      );
      return [...points, ...filler];
    }
    return points;
  }

  // Find epsilon that gives approximately the target point count
  findEpsilonForPointCount(points, targetCount, maxEpsilon) {
    if (points.length <= targetCount) {
      return 0; // No simplification needed
    }

    let low = 0;
    let high = maxEpsilon;
    let mid;

    while (high - low > 0.001) {
      mid = (low + high) / 2;
      const simplifiedCount = this.getSimplifiedPointCount(points, mid);

      if (simplifiedCount > targetCount) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return mid;
  }

  // Get count of points after simplification with given epsilon
  getSimplifiedPointCount(points, epsilon) {
    const rdpPoints = [];
    const total = points.length;

    if (total <= 2) return total;

    const start = points[0];
    const end = points[total - 1];

    rdpPoints.push(start);
    this.rdp(0, total - 1, points, rdpPoints, epsilon);
    rdpPoints.push(end);

    return new Set(rdpPoints.map((p) => `${p[0]},${p[1]}`)).size;
  }

  // Core RDP algorithm
  rdp(startIndex, endIndex, allPoints, rdpPoints, epsilon) {
    const nextIndex = this.findFurthest(
      allPoints,
      startIndex,
      endIndex,
      epsilon
    );

    if (nextIndex > 0) {
      if (startIndex !== nextIndex) {
        this.rdp(startIndex, nextIndex, allPoints, rdpPoints, epsilon);
      }
      rdpPoints.push(allPoints[nextIndex]);
      if (endIndex !== nextIndex) {
        this.rdp(nextIndex, endIndex, allPoints, rdpPoints, epsilon);
      }
    }
  }

  // Find furthest point from line segment
  findFurthest(points, a, b, epsilon) {
    let recordDistance = -1;
    const start = points[a];
    const end = points[b];
    let furthestIndex = -1;

    for (let i = a + 1; i < b; i++) {
      const currentPoint = points[i];
      const d = this.lineDist(currentPoint, start, end);

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

  // Calculate distance from point to line
  lineDist(c, a, b) {
    const norm = this.scalarProjection(c, a, b);
    return Math.sqrt(Math.pow(c[0] - norm[0], 2) + Math.pow(c[1] - norm[1], 2));
  }

  // Project point onto line segment
  scalarProjection(p, a, b) {
    const ap = [p[0] - a[0], p[1] - a[1]];
    const ab = [b[0] - a[0], b[1] - a[1]];

    const abMag = Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1]);

    if (abMag === 0) {
      return a; // Start and end points are the same
    }

    ab[0] /= abMag;
    ab[1] /= abMag;

    const dot = ap[0] * ab[0] + ap[1] * ab[1];

    return [a[0] + ab[0] * dot, a[1] + ab[1] * dot];
  }

  /**
   * Creates training data using a sliding window approach
   * @param {Array} data - Array of data objects
   * @param {number} targetLength - Length of the sequence window
   * @param {Array} featureKeys - Array of keys to use as input features
   * @param {Array} targetKeys - Array of keys to predict (can be the same as featureKeys)
   * @returns {Object} - Object containing sequences and targets arrays
   */
  createSlidingWindowData(data, targetLength, featureKeys, targetKeys) {
    // Validate inputs
    if (!data || !Array.isArray(data) || data.length <= targetLength) {
      throw new Error(
        "Data Format is invalid please check usage of this helper function in documentation"
      );
    }

    const inputs = [];
    const outputs = [];

    // Start from the first possible complete sequence
    for (
      let dataIndex = targetLength - 1;
      dataIndex < data.length - 1;
      dataIndex++
    ) {
      let seq = [];

      // Build sequence of previous targetLength steps
      for (let x = targetLength - 1; x >= 0; x--) {
        let curr = data[dataIndex - x];
        let inputs = {};

        // Extract only the specified feature keys
        featureKeys.forEach((key) => {
          inputs[key] = curr[key];
        });

        seq.push(inputs);
      }

      // The target is the next data point after the sequence
      let target = data[dataIndex + 1];
      let output = {};

      // Extract only the specified target keys
      targetKeys.forEach((key) => {
        output[key] = target[key];
      });

      inputs.push(seq);
      outputs.push(output);
    }

    return { inputs, outputs };
  }

  /**
   * Creates a sequence from the most recent data points
   * @param {Array} data - Array of data objects
   * @param {number} sequenceLength - Length of the sequence to create
   * @param {Array} featureKeys - Array of keys to include in the sequence
   * @returns {Array} - Array of objects containing the selected features
   */
  getLatestSequence(data, sequenceLength, featureKeys) {
    // Validate inputs
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid data input");
    }

    // Ensure we don't try to get more items than exist in the data
    const actualLength = Math.min(sequenceLength, data.length);

    // Get the most recent data points
    const latest = data.slice(-actualLength);

    // Create the sequence with selected features
    const sequence = latest.map((item) => {
      const inputs = {};

      featureKeys.forEach((key) => {
        inputs[key] = item[key];
      });

      return inputs;
    });

    return sequence;
  }
}

const sequentialUtils = () => {
  const instance = new SequentialUtils();
  return instance;
};

export default sequentialUtils();
