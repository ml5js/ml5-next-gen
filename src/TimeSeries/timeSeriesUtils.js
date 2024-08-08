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

  verifyAndFormatInputs(xInputs, options = null,classOptions){
    const dataFormat = this.checkInputStructure(xInputs, options);
    return this.formatInputsToObjects(xInputs,options,classOptions,dataFormat);
  }

  checkInputStructure(xInputs, options=null){
    if(!Array.isArray(xInputs)){
      throw new error('Syntax Error: Data Should be in an Array')
    } 
    let isObjects = true;
    let isArrays = true;
    let isValues = true;
    
    for (let i = 0; i < xInputs.length ; i++){
      if (nnUtils.getDataType(xInputs[i]) === 'object'){
        console.log('here')
        isArrays = false;
        isValues = false;
        if ( i > 0 ) {
          if (Object.keys(xInputs[i-1]).length !==  Object.keys(xInputs[i]).length || nnUtils.getDataType(xInputs[i-1]) === 'object'){
            throw new error('Data format is inconsistent')
          }
        }
      } else if (Array.isArray(xInputs[i])){
        console.log('here2')
        isObjects = false;
        isValues = false;
        if ( i > 0 ) {
          if (xInputs[i-1].length !==  xInputs[i].length || !Array.isArray(xInputs[i-1])){
            throw new error('Data format is inconsistent')
          }
        }
      } else {
        if (options.inputLabels){
  
          isObjects = false;
          isArrays = false;
  
        } else {
          throw new error('inputLabels is needed for 1D array inputs')
        }
      }
  
      if (isObjects) {
        return "ObjectSequence";
      } else if (isArrays) {
        return "ArraySequence";
      } else if (isValues) {
        return "ValueSequence";
      } else {
        throw new error('Syntax Error: Input Structure is unknown')
      }
    }
  }  

  formatInputsToObjects(xInputs, options=null,classOptions, dataFormat){
    switch(dataFormat){
      case 'ObjectSequence':
        return xInputs;
      case 'ArraySequence':
        return this.convertArraySequence(xInputs, options, classOptions);
      case 'ValueSequence':
        return this.convertValueSequence(xInputs,options);
      default:
        throw new error('Input Data Structure is unknown');
    }
  }

  convertArraySequence(xInputs, options=null, classOptions){
    let label = ''

    if (options !== null){
      if (options.inputLabels){
        label = options.inputLabels
        console.log('here1')
      }
    } else if (classOptions !== null){
      if (classOptions.inputs){
        label = classOptions.inputs;
      }
    } 
    
    if ((typeof label === 'string' && label === '') || 
    (Array.isArray(label) && label.length === 0)) {
      label = this.getLabelFromNestedArray(xInputs);
    }

    return xInputs.map((input)=>{
      const obj = {};
      input.forEach((value,ind) => {
        obj[label[ind]] = value;
      });
      return obj;
    })
  }

  convertValueSequence(xInputs, options=null){
    const {inputLabels} = options;
      if (xInputs.length % inputLabels.length !== 0){
        throw new error ("Invalid Input: Number of Labels don't match amount of values")
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

  verifyAndFormatOutputs(yInputs, options=null,classOptions){
    const {outputs} = classOptions;

    let outputLabels;
    

    if (options !== null) {
      if (options.outputLabels){
        outputLabels = options.outputLabels;
      }
    } 
    
    if (outputs.length > 0) {
      if (outputs.every((item) => typeof item === "string")) {
        outputLabels = outputs;
      }
    } else if ( typeof yInputs === "object") {
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

  prepareLabels(xInputs, yInputs, options = null,classOptions){
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
  
    return inputLabels, outputLabels
  
  }

  getLabelFromNestedArray(xInputs,prefix = 'label'){
    // Recursive function to find the deepest level of the array
    function traverseArray(array) {
      if (array.length > 0 && (typeof array[0] === 'string' || typeof array[0] === 'number')) {
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
      throw new Error('Input data must be an array.');
    }    
  }

  // labelsFromNestedArray(data){
  //   function processData(data, prefix = 'label') {
  //     // Recursive function to find the deepest level of the data and return the result
  //     function traverse(value) {
  //       if (Array.isArray(value)) {
  //         if (value.length > 0 && typeof value[0] === 'string') {
  //           // If the deepest unit is an array with strings
  //           return { type: 'array', data: value };
  //         } else if (value.length > 0 && typeof value[0] === 'number') {
  //           // If the deepest unit is an array with numbers
  //           return { type: 'array', data: value };
  //         } else {
  //           for (const item of value) {
  //             const result = traverse(item);
  //             if (result) return result;
  //           }
  //         }
  //       } else if (value !== null && typeof value === 'object') {
  //         return { type: 'object', data: value };  // If the deepest unit is an object
  //       }
  //       return null;
  //     }
    
  //     const result = traverse(data);
    
  //     if (result) {
  //       if (result.type === 'object') {
  //         // If the deepest level is an object, get the unique keys
  //         return Object.keys(result.data);
  //       } else if (result.type === 'array') {
  //         // If the deepest level is an array with strings or numbers, get the labels
  //         return result.data.map((_, index) => `${prefix}_${index}`);
  //       }
  //     } else {
  //       // No recognizable structure found
  //       throw new Error('Data does not match expected structure for objects or arrays.');
  //     }
  //   }

  //   output = processData(data, "label");

  //   console.log('labeling',output);
  //   return processData(data, "label");
  // }


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
        ys: ys
      };
    });
  }
}
  
const timeSeriesUtils = () => {
  const instance = new TimeSeriesUtils();
  return instance;
};
  
export default timeSeriesUtils();
  