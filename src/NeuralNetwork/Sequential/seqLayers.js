export const createSeqLayers = (
  seriesShape,
  hiddenUnits,
  outputUnits = null
) => {
  return {
    classificationWithCNN: [
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
    regressionWithCNN: [
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

    // Ready-to-use preset for multi-step weather regression.
    // Stacked LSTM (32 → 16) with tanh activation and light dropout.
    // Output uses linear activation because ml5 normalises targets before
    // training and denormalises them on predict — no squashing needed.
    weatherForecast: [
      {
        type: "lstm",
        units: 48,
        activation: "tanh",
        kernelInitializer: "glorotUniform",
        recurrentInitializer: "glorotUniform",
        inputShape: seriesShape,
        returnSequences: true,
        dropout: 0.1,
        recurrentDropout: 0.05,
      },
      {
        type: "lstm",
        units: 24,
        activation: "tanh",
        kernelInitializer: "glorotUniform",
        recurrentInitializer: "glorotUniform",
        returnSequences: false,
        dropout: 0.1,
        recurrentDropout: 0.05,
      },
      // Non-linear mixing stage: lets the model compose the LSTM's temporal
      // summary into sharper per-feature patterns (e.g. diurnal temperature shape)
      // before the final linear projection.
      {
        type: "dense",
        units: 32,
        activation: "relu",
        kernelInitializer: "glorotUniform",
      },
      {
        type: "dense",
        units: outputUnits,
        activation: "linear",
        kernelInitializer: "glorotUniform",
      },
    ],
  };
};
