import * as tf from "@tensorflow/tfjs";
import axios from "axios";
import { saveBlob } from "../../utils/io";
import modelLoader from "../../utils/modelLoader";
import nnUtils from "../NeuralNetworkUtils";
import seqUtils from "./sequentialUtils";

import NeuralNetworkData from "../NeuralNetworkData";

class SequentialData extends NeuralNetworkData {
  constructor() {
    super();
  }

  /**
   * getDTypesFromData
   * gets the data types of the data we're using
   * important for handling oneHot
   * @private
   * @void - updates this.meta
   */
  getDTypesFromData() {
    const meta = {
      ...this.meta,
      inputs: {},
      outputs: {},
    };

    const sample = this.data.raw[0];

    // consistent dTypes have already been checked at add data
    const xs = Object.keys(sample.xs[0]); // since time series data is in form of array
    const ys = Object.keys(sample.ys);
    xs.forEach((prop) => {
      meta.inputs[prop] = {
        dtype: nnUtils.getDataType(sample.xs[0][prop]),
      };
    });

    ys.forEach((prop) => {
      meta.outputs[prop] = {
        dtype: nnUtils.getDataType(sample.ys[prop]),
      };
    });

    this.meta = meta;
  }

  /**
   * get back the min and max of each label
   * @private
   * @param {Object} inputOrOutputMeta
   * @param {"xs" | "ys"} xsOrYs
   * @return {Object}
   */
  getInputMetaStats(inputOrOutputMeta, xsOrYs) {
    const inputMeta = Object.assign({}, inputOrOutputMeta);

    Object.keys(inputMeta).forEach((k) => {
      if (inputMeta[k].dtype === "string") {
        inputMeta[k].min = 0;
        inputMeta[k].max = 1;
      } else if (inputMeta[k].dtype === "number") {
        let dataAsArray;
        if (xsOrYs === "ys") {
          dataAsArray = this.data.raw.map((item) => item[xsOrYs][k]);
        } else if (xsOrYs === "xs") {
          dataAsArray = this.data.raw.flatMap((item) =>
            item[xsOrYs].map((obj) => obj[k])
          );
        }
        inputMeta[k].min = nnUtils.getMin(dataAsArray);
        inputMeta[k].max = nnUtils.getMax(dataAsArray);
      } else if (inputMeta[k].dtype === "array") {
        const dataAsArray = this.data.raw.map((item) => item[xsOrYs][k]).flat();
        inputMeta[k].min = nnUtils.getMin(dataAsArray);
        inputMeta[k].max = nnUtils.getMax(dataAsArray);
      }
    });

    return inputMeta;
  }

  /**
   * convertRawToTensors
   * converts array of {xs, ys} to tensors
   * @param {*} dataRaw
   *
   * @return {{ inputs: tf.Tensor, outputs: tf.Tensor }}
   */
  convertRawToTensors(dataRaw) {
    const meta = Object.assign({}, this.meta);
    const dataLength = dataRaw.length;

    return tf.tidy(() => {
      const inputArr = [];
      const outputArr = [];

      dataRaw.forEach((row) => {
        // get xs
        const xs = row.xs;
        inputArr.push(xs);

        // get ys
        const ys = Object.keys(meta.outputs)
          .map((k) => {
            return row.ys[k];
          })
          .flat();

        outputArr.push(ys);
      });

      const inputs = tf.tensor(inputArr);

      const outputs = tf.tensor(outputArr.flat(), [
        dataLength,
        meta.outputUnits,
      ]);

      return {
        inputs,
        outputs,
      };
    });
  }

  /**
   * normalize the dataRaw input
   * @return {Array<object>}
   */
  normalizeDataRaw() {
    const normXs = this.normalizeInputData(this.meta.inputs, "xs");
    const normYs = this.normalizeInputData(this.meta.outputs, "ys");
    const normalizedData = seqUtils.zipArraySequence(normXs, normYs);

    return normalizedData;
  }

  /**
   * @param {Object} inputOrOutputMeta
   * @param {"xs" | "ys"} xsOrYs
   * @return {Array<object>}
   */
  normalizeInputData(inputOrOutputMeta, xsOrYs) {
    const dataRaw = this.data.raw;

    // the data length
    const dataLength = dataRaw.length;

    // the copy of the inputs.meta[inputOrOutput]
    const inputMeta = Object.assign({}, inputOrOutputMeta);

    // normalized output object
    const normalized = {};
    Object.keys(inputMeta).forEach((k) => {
      // get the min and max values
      const options = {
        min: inputMeta[k].min,
        max: inputMeta[k].max,
      };

      // depending on the input type, normalize accordingly
      if (inputMeta[k].dtype === "string") {
        const dataAsArray = dataRaw.map((item) => item[xsOrYs][k]);
        options.legend = inputMeta[k].legend;
        normalized[k] = this.normalizeArray(dataAsArray, options);
      } else if (inputMeta[k].dtype === "number") {
        let dataAsArray;
        if (xsOrYs === "ys") {
          dataAsArray = this.data.raw.map((item) => item[xsOrYs][k]);
        } else if (xsOrYs === "xs") {
          dataAsArray = this.data.raw.flatMap((item) =>
            item[xsOrYs].map((obj) => obj[k])
          );
        }
        normalized[k] = this.normalizeArray(dataAsArray, options);
      } else if (inputMeta[k].dtype === "array") {
        const dataAsArray = dataRaw.map((item) => item[xsOrYs][k]);
        normalized[k] = dataAsArray.map((item) =>
          this.normalizeArray(item, options)
        );
      }
    });

    let output;
    if (xsOrYs == "ys") {
      output = [...new Array(dataLength).fill(null)].map((item, idx) => {
        const row = {
          [xsOrYs]: {},
        };

        Object.keys(inputMeta).forEach((k) => {
          row[xsOrYs][k] = normalized[k][idx];
        });

        return row;
      });
    } else if (xsOrYs == "xs") {
      // reshape array - already ready for tensorconversion
      const features = Object.keys(inputMeta);
      const feature_length = features.length;

      const seriesStep = dataRaw[0]["xs"].length;

      const batch = normalized[features[0]].length / seriesStep;

      this.meta.seriesShape = [seriesStep, feature_length];
      let zipped = [];

      // zip arrays before reshaping
      for (let idx = 0; idx < seriesStep * feature_length * batch; idx++) {
        features.forEach((k) => {
          zipped.push(normalized[k][idx]);
        });
      }

      // reshaping
      output = seqUtils.reshapeTo3DArray(zipped, [
        batch,
        seriesStep,
        feature_length,
      ]);
    }

    return output;
  }

  normalizePredictData(dataRaw, inputOrOutputMeta) {
    const inputMeta = Object.assign({}, inputOrOutputMeta);
    const xsOrYs = "xs";
    const predict_normalized = {};
    Object.keys(inputMeta).forEach((k) => {
      // get the min and max values
      const options = {
        min: inputMeta[k].min,
        max: inputMeta[k].max,
      };
      if (inputMeta[k].dtype === "string") {
        const dataAsArray = dataRaw.map((item) => item[xsOrYs][k]);
        options.legend = inputMeta[k].legend;
        predict_normalized[k] = this.normalizeArray(dataAsArray, options);
      } else if (inputMeta[k].dtype === "number") {
        const dataAsArray = Array(dataRaw).flatMap((item) =>
          item.map((obj) => obj[k])
        );
        predict_normalized[k] = this.normalizeArray(dataAsArray, options);
      }
    });

    const features = Object.keys(inputMeta);
    const feature_length = features.length;

    const seriesStep = dataRaw.length;

    const batch = 1;
    let zipped = [];

    // zip arrays before reshaping
    for (let idx = 0; idx < seriesStep * feature_length * batch; idx++) {
      features.forEach((k) => {
        zipped.push(predict_normalized[k][idx]);
      });
    }
    // reshaping
    const output = seqUtils.reshapeTo3DArray(zipped, [
      batch,
      seriesStep,
      feature_length,
    ]);
    return output;
  }

  /**
   * applyOneHotEncodingsToDataRaw
   * does not set this.data.raws
   * but rather returns them
   */
  applyOneHotEncodingsToDataRaw() {
    const meta = Object.assign({}, this.meta);

    const output = this.data.raw.map((row) => {
      const xs = {
        ...row.xs,
      };
      const ys = {
        ...row.ys,
      };

      // get xs
      Object.keys(meta.inputs).forEach((k) => {
        if (meta.inputs[k].legend) {
          xs[k] = meta.inputs[k].legend[row.xs[k]];
        }
      });

      Object.keys(meta.outputs).forEach((k) => {
        if (meta.outputs[k].legend) {
          ys[k] = meta.outputs[k].legend[row.ys[k]];
        }
      });

      return {
        xs,
        ys,
      };
    });
    return output;
  }

  /**
   * loadJSON
   * @param {*} dataUrlOrJson
   * @param {*} inputLabels
   * @param {*} outputLabels
   * @void
   */
  async loadJSON(dataUrlOrJson, inputLabels, outputLabels) {
    try {
      let json;
      // handle loading parsedJson
      if (dataUrlOrJson instanceof Object) {
        json = Object.assign({}, dataUrlOrJson);
      } else {
        const { data } = await axios.get(dataUrlOrJson);
        json = data;
      }

      // format the data.raw array
      // this.formatRawData(json, inputLabels, outputLabels);
      return this.findEntries(json);
    } catch (err) {
      console.error("error loading json");
      throw new Error(err);
    }
  }

  /**
   * loadCSV
   * @param {*} dataUrl
   * @param {*} inputLabels
   * @param {*} outputLabels
   * @void
   */
  async loadCSV(dataUrl, inputLabels, outputLabels) {
    try {
      const myCsv = tf.data.csv(dataUrl);
      const loadedData = await myCsv.toArray();
      const json = {
        entries: loadedData,
      };
      // format the data.raw array
      return this.findEntries(json);
    } catch (err) {
      console.error("error loading csv", err);
      throw new Error(err);
    }
  }
}

export default SequentialData;
