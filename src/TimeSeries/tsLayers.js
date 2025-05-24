export const createTsLayers = (
  seriesShape,
  hiddenUnits,
  outputUnits = null
) => {
  return {
    classification_spatial: [
      {
        type: "conv1d",
        filters: 8,
        kernelSize: 3,
        activation: "relu",
        inputShape: seriesShape,
      },
      {
        type: "maxPooling1d",
        poolSize: 2,
      },
      {
        type: "conv1d",
        filters: 16,
        kernelSize: 3,
        activation: "relu",
      },
      {
        type: "maxPooling1d",
        poolSize: 2,
      },
      {
        type: "flatten",
      },
      {
        type: "dense",
        units: hiddenUnits,
        activation: "relu",
      },
      {
        type: "dense",
        units: outputUnits,
        activation: "softmax",
      },
    ],
    classification: [
      {
        type: "lstm",
        units: 16,
        activation: "relu",
        inputShape: seriesShape,
        returnSequences: true,
      },
      {
        type: "lstm",
        units: 8,
        activation: "relu",
        returnSequences: false,
      },
      {
        type: "dense",
        units: hiddenUnits,
        activation: "relu",
      },
      {
        type: "dense",
        units: outputUnits,
        activation: "softmax",
      },
    ],
    regression_spatial: [
      {
        type: "conv1d",
        filters: 8,
        kernelSize: 3,
        activation: "relu",
        inputShape: seriesShape,
      },
      {
        type: "maxPooling1d",
        poolSize: 2,
      },
      {
        type: "conv1d",
        filters: 16,
        kernelSize: 3,
        activation: "relu",
      },
      {
        type: "maxPooling1d",
        poolSize: 2,
      },
      {
        type: "flatten",
      },
      {
        type: "dense",
        units: hiddenUnits,
        activation: "relu",
      },
      {
        type: "dense",
        units: outputUnits,
        activation: "sigmoid",
      },
    ],
    regression: [
      {
        type: "lstm",
        units: 16,
        activation: "relu",
        inputShape: seriesShape,
        returnSequences: true,
      },
      {
        type: "lstm",
        units: 8,
        activation: "relu",
      },
      {
        type: "dense",
        units: hiddenUnits,
        activation: "relu",
      },
      {
        type: "dense",
        units: outputUnits,
        activation: "sigmoid",
      },
    ],
    default: [
      {
        type: "lstm",
        units: 16,
        activation: "relu",
        inputShape: seriesShape,
      },
      {
        type: "lstm",
        units: 8,
        activation: "relu",
      },
      {
        type: "dense",
        units: hiddenUnits,
        activation: "relu",
      },
      {
        type: "dense",
        units: outputUnits,
        activation: "sigmoid",
      },
    ],
  };
};
