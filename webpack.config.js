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
      export: "default",
    },
  },
  ignoreWarnings: [
    // Suppress warning about import.meta in @huggingface/transformers
    // This is a known issue with webpack and ESM modules
    {
      module: /node_modules\/@huggingface\/transformers/,
      message: /Critical dependency: Accessing import\.meta directly/,
    },
  ],
};

const developmentConfig = {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    publicPath: "/dist/",
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
      util: false
    },
  }
};

const productionConfig = {
  mode: "production",
  entry: {
    ml5: "./src/index.js",
    "ml5.min": "./src/index.js",
  },
  devtool: "source-map",
  output: {
    publicPath: "/",
    filename: "[name].js",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: "ml5.min.js",
        exclude: "ml5.js",
        extractComments: false,
      }),
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      util: false
    },
  }
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
