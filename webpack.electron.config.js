const path = require("path");
// MOST IMPORTANT PART OF ALL BUILD! WITHOUT THIS PLUGIN EXTERNAL PLUGINS
// NODE DEPENDENCIES LIKE PATH/FS/CHILD_PROCESS CAN'T BE IMPORTED
const nodeExternals = require('webpack-node-externals');

module.exports = {
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "source-map",
  entry: "./electron/main.js",
  target: "electron-main",
  externals: [nodeExternals({
    // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
  })],
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      }
    ],
  },
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(__dirname, "build/electron"),
    filename: "[name].js",
  },
};
