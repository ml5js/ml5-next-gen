class NeuralNetworkUtils {
  constructor(options) {
    this.options = options || {};
  }

  /**
   * Normalize a value between min and max, return 0 if min === max
   * @param {number} value - The value to normalize
   * @param {number} min - The minimum bound
   * @param {number} max - The maximum bound
   */
  normalizeValue(value, min, max) {
    // When min is equal to max, set everything to 0
    if (min === max) {
      return 0;
    }
    return (value - min) / (max - min);
  }

  /**
   * unNormalizeValue
   * @param {*} value
   * @param {*} min
   * @param {*} max
   */
  // eslint-disable-next-line class-methods-use-this
  unnormalizeValue(value, min, max) {
    if (min === max) {
      return min;
    }
    return value * (max - min) + min;
  }

  /**
   * getMin
   * @param {*} _array
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  getMin(_array) {
    // return Math.min(..._array)
    return _array.reduce((a, b) => {
      return Math.min(a, b);
    });
  }

  /**
   * getMax
   * @param {*} _array
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  getMax(_array) {
    return _array.reduce((a, b) => {
      return Math.max(a, b);
    });
    // return Math.max(..._array)
  }

  /**
   * checks whether or not a string is a json
   * @param {*} str
   */
  // eslint-disable-next-line class-methods-use-this
  isJsonOrString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * zipArrays
   * @param {*} arr1
   * @param {*} arr2
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  zipArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      console.error("arrays do not have the same length");
      return [];
    }

    const output = [...new Array(arr1.length).fill(null)].map((item, idx) => {
      return {
        ...arr1[idx],
        ...arr2[idx],
      };
    });

    return output;
  }

  /**
   * createLabelsFromArrayValues
   * @param {*} incoming
   * @param {*} prefix
   */
  // eslint-disable-next-line class-methods-use-this
  createLabelsFromArrayValues(incoming, prefix) {
    let labels;
    if (Array.isArray(incoming)) {
      labels = incoming.map((v, idx) => `${prefix}_${idx}`);
    }
    return labels;
  }

  /**
   * takes an array and turns it into a json object
   * where the labels are the keys and the array values
   * are the object values
   * @param {*} incoming
   * @param {*} labels
   */
  // eslint-disable-next-line class-methods-use-this
  formatDataAsObject(incoming, labels) {
    let result = {};

    if (Array.isArray(incoming)) {
      incoming.forEach((item, idx) => {
        const label = labels[idx];
        result[label] = item;
      });
      return result;
    } else if (typeof incoming === "object") {
      result = incoming;
      return result;
    }

    throw new Error(
      "input provided is not supported or does not match your output label specifications"
    );
  }

  /**
   * returns a datatype of the value as string
   * @param {*} val
   */
  // eslint-disable-next-line class-methods-use-this
  getDataType(val) {
    let dtype = typeof val;

    if (dtype === "object") {
      if (Array.isArray(val)) {
        dtype = "array";
      }
    }

    return dtype;
  }
}

const neuralNetworkUtils = () => {
  const instance = new NeuralNetworkUtils();
  return instance;
};

export default neuralNetworkUtils();
