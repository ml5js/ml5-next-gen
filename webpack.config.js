const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");

const commonConfig = {
  context: __dirname,
  entry: "./src/index.js",
  output: {
    filename: "ml5.js",
    path: resolve(__dirname, "dist"),
    library: {
      name: "ml5",
      type: "umd",
    },
  },
};

const developmentConfig = {
  mode: "development",
  entry: {
    ml5: "./src/index.js",
    "ml5-body-pose": "./src/BodyPose/index.js",
    "ml5-body-segmentation": "./src/BodySegmentation/index.js",
    "ml5-face-mesh": "./src/FaceMesh/index.js",
    "ml5-hand-pose": "./src/HandPose/index.js",
    "ml5-image-classifier": "./src/ImageClassifier/index.js",
    "ml5-neural-network": "./src/NeuralNetwork/index.js",
    "ml5-sentiment": "./src/Sentiment/index.js",
    "ml5-sound-classifier": "./src/SoundClassifier/index.js",
  },
  devtool: "inline-source-map",
  output: {
    publicPath: "/dist/",
    filename: "[name].js",
    library: {
      name: ["ml5"],
      type: "umd",
    },
  },
  devServer: {
    port: 8080,
    allowedHosts: "all",
    static: [
      {
        directory: resolve(__dirname, "dist"),
        publicPath: "/dist",
        watch: true,
      },
      {
        directory: resolve(__dirname, "examples"),
        publicPath: "/examples",
        watch: true,
      },
    ],
    open: "/examples",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "ml5",
    }),
  ],
  resolve: {
    fallback: {
      fs: false,
      util: false,
    },
  },
};

const productionConfig = {
  mode: "production",
  entry: {
    ml5: "./src/index.js",
    "ml5.min": "./src/index.js",
    "ml5-body-pose": "./src/BodyPose/index.js",
    "ml5-body-pose.min": "./src/BodyPose/index.js",
    "ml5-body-segmentation": "./src/BodySegmentation/index.js",
    "ml5-body-segmentation.min": "./src/BodySegmentation/index.js",
    "ml5-face-mesh": "./src/FaceMesh/index.js",
    "ml5-face-mesh.min": "./src/FaceMesh/index.js",
    "ml5-hand-pose": "./src/HandPose/index.js",
    "ml5-hand-pose.min": "./src/HandPose/index.js",
    "ml5-image-classifier": "./src/ImageClassifier/index.js",
    "ml5-image-classifier.min": "./src/ImageClassifier/index.js",
    "ml5-neural-network": "./src/NeuralNetwork/index.js",
    "ml5-neural-network.min": "./src/NeuralNetwork/index.js",
    "ml5-sentiment": "./src/Sentiment/index.js",
    "ml5-sentiment.min": "./src/Sentiment/index.js",
    "ml5-sound-classifier": "./src/SoundClassifier/index.js",
    "ml5-sound-classifier.min": "./src/SoundClassifier/index.js",
  },
  devtool: "source-map",
  output: {
    publicPath: "/",
    filename: "[name].js",
    library: {
      name: ["ml5"],
      type: "umd",
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
        exclude: /^(?!.*\.min\.js$).*\.js$/,
        extractComments: false,
      }),
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      util: false,
    },
  },
};

module.exports = function (env, args) {
  switch (args.mode) {
    case "development":
      return merge(commonConfig, developmentConfig);
    case "production":
      return merge(commonConfig, productionConfig);
    default:
      throw new Error("No matching configuration was found!");
  }
};
