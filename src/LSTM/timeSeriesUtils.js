import nnUtils from "../NeuralNetwork/NeuralNetworkUtils";

class TimeSeriesUtils {
  constructor(options) {
    this.options = options || {};
  }

  prepareLabels(xInputs, yInputs, options = null){
    const {inputs, outputs} = this.options;
  
    let inputLabels;
    let outputLabels;
  
    // options-based values to assign
    if (options !== null) {
      ({inputLabels, outputLabels} = options)
    } else if (inputs.length > 0 && outputs.length > 0) {  
      if (inputs.every((item) => typeof item === "string")) {
        inputLabels = inputs;
      }
      if (outputs.every((item) => typeof item === "string")) {
        outputLabels = outputs;
      }

    // input-based values to assign  
    } else {
      inputLabels = this.labelsFromNestedArray(xInputs);
      if (typeof yInputs === "object") {
        outputLabels = Object.keys(yInputs);
      } else {
        inputLabels = this.labelsFromNestedArray(yInputs);
      }
    }
  
  
    // Make sure that the inputLabels and outputLabels are arrays
    if (!(inputLabels instanceof Array)) {
      throw new Error("inputLabels must be an array");
    }
    if (!(outputLabels instanceof Array)) {
      throw new Error("outputLabels must be an array");
    }
  
    return inputLabels, outputLabels
  
  }

  labelsFromNestedArray(data){
    function processData(data, prefix = 'label') {
      // Recursive function to find the deepest level of the data and return the result
      function traverse(value) {
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'string') {
            // If the deepest unit is an array with strings
            return { type: 'array', data: value };
          } else if (value.length > 0 && typeof value[0] === 'number') {
            // If the deepest unit is an array with numbers
            return { type: 'array', data: value };
          } else {
            for (const item of value) {
              const result = traverse(item);
              if (result) return result;
            }
          }
        } else if (value !== null && typeof value === 'object') {
          return { type: 'object', data: value };  // If the deepest unit is an object
        }
        return null;
      }
    
      const result = traverse(data);
    
      if (result) {
        if (result.type === 'object') {
          // If the deepest level is an object, get the unique keys
          return Object.keys(result.data);
        } else if (result.type === 'array') {
          // If the deepest level is an array with strings or numbers, get the labels
          return result.data.map((_, index) => `${prefix}_${index}`);
        }
      } else {
        // No recognizable structure found
        throw new Error('Data does not match expected structure for objects or arrays.');
      }
    }
  }
}
  
const timeSeriesUtils = () => {
  const instance = new TimeSeriesUtils();
  return instance;
};
  
export default timeSeriesUtils();
  