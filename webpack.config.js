const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function (env, argv) {
  return {
    context: __dirname,
    entry: "./src/index.js",

    mode: env.production ? "production" : "development",
    devtool: env.production ? "source-map" : "inline-source-map",
    output: {
      filename: "ml5.js",
      path: resolve(__dirname, "dist"),
      publicPath: "/dist/",
      library: {
        name: "ml5",
        type: "umd",
        export: "default",
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
        crypto: false,
        fs: false,
        path: false,
      },
    },
    module: {
      rules: [
        {
          test: /llama2\.wasm$/,
          type: "asset/inline",
        },
        {
          test: /llama2\.data$/,
          type: "asset/inline",
          generator: {
            dataUrl: {
              encoding: "base64",
              mimetype: "application/octet-stream",
            },
          },
        },
      ],
    },
  };
};
