import { data, input } from "@tensorflow/tfjs";
import nnUtils from "../NeuralNetwork/NeuralNetworkUtils";

class TimeSeriesUtils {
  constructor(options) {
    this.options = options || {};
  }

  /* adding data: can only accept the following formats:
     - for xInputs:
      1. Sequence of objects (array of objects) 
        [{x: , y: },{x: , y: },{x: , y: },{x: , y: }]
      2. Sequence of arrays (array of array, order matters)
        [[],[],[],[]]
      3. Sequence of values (shape should be provided by user)
        [[,,,,,]] e.g. shape = {steps: 4, values: 2} will become [{x: , y: },{x: , y: },{x: , y: },{x: , y: }]
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
        console.log("here");
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
        console.log("here2");
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
        console.log("here1");
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
    const rdpPoints = [];

    const epsilon = this.findEpsilonForPointCount(
      allPoints,
      targetPointCount,
      maxEpsilon
    );

    const total = allPoints.length;
    const start = allPoints[0];
    const end = allPoints[total - 1];
    rdpPoints.push(start);
    this.rdp(0, total - 1, allPoints, rdpPoints, epsilon);
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

  findEpsilonForPointCount(points, targetCount, maxEpsilon) {
    let low = 0;
    let high = maxEpsilon;
    let mid;
    let simplifiedPointsCount = 0;

    while (high - low > 0.001) {
      // Tolerance for approximation
      mid = (low + high) / 2;
      simplifiedPointsCount = this.getSimplifiedPointCount(points, mid);
      if (simplifiedPointsCount > targetCount) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return mid;
  }

  getSimplifiedPointCount(points, epsilon) {
    const rdpPoints = [];
    const total = points.length;
    const start = points[0];
    const end = points[total - 1];
    rdpPoints.push(start);
    this.rdp(0, total - 1, points, rdpPoints, epsilon);
    rdpPoints.push(end);
    return rdpPoints.length;
  }

  rdp(startIndex, endIndex, allPoints, rdpPoints, epsilon) {
    const nextIndex = this.findFurthest(
      allPoints,
      startIndex,
      endIndex,
      epsilon
    );
    if (nextIndex > 0) {
      if (startIndex != nextIndex) {
        this.rdp(startIndex, nextIndex, allPoints, rdpPoints, epsilon);
      }
      rdpPoints.push(allPoints[nextIndex]);
      if (endIndex != nextIndex) {
        this.rdp(nextIndex, endIndex, allPoints, rdpPoints, epsilon);
      }
    }
  }

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

  lineDist(c, a, b) {
    const norm = this.scalarProjection(c, a, b);
    return dist(c.x, c.y, norm.x, norm.y);
  }

  scalarProjection(p, a, b) {
    const ap = { x: p.x - a.x, y: p.y - a.y };
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const abMag = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
    ab.x /= abMag;
    ab.y /= abMag;
    const dot = ap.x * ab.x + ap.y * ab.y;
    return { x: a.x + ab.x * dot, y: a.y + ab.y * dot };
  }
}

const timeSeriesUtils = () => {
  const instance = new TimeSeriesUtils();
  return instance;
};

export default timeSeriesUtils();
