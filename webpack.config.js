const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");

const commonConfig = {
  context: __dirname,
  entry: "./src/index.js",
  output: {
    filename: "ml5.min.js",
    path: resolve(__dirname, "dist"),
    library: {
      name: "ml5",
      type: "umd",
      export: "default",
    },
  },
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
};

const productionConfig = {
  mode: "production",
  devtool: "source-map",
  output: {
    publicPath: "/",
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
