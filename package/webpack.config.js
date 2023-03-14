const path = require("path");

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    filename: "ml5.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "ml5",
      type: "umd",
      export: "default"
    },
  },
};
