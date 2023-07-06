const { resolve } = require("path");

module.exports = function (env, argv) {
  const common = {
    context: __dirname,
    entry: "./src/index.js",
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
  };

  const dev = {
    mode: "development",
    devtool: "inline-source-map",
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
  };

  const prod = {
    mode: "production",
    devtool: "source-map",
  };

  if (env.production) {
    return { ...common, ...prod };
  } else {
    return { ...common, ...dev };
  }
};
