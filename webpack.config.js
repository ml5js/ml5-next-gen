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
      publicPath: "/",
      library: {
        name: "ml5",
        type: "umd",
        export: "default",
      },
    },
    devServer: {
      port: 8080,
      allowedHosts: "all",
      static: {
        directory: resolve(__dirname, "dist"),
        watch: true,
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "ml5",
      }),
    ],
  };
};
