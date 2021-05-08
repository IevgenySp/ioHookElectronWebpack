const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    mainFields: ["main", "module", "browser"],
  },
  entry: "./src/index.js",
  target: "electron-renderer",
  devtool: "source-map",
  externals: {
    iohook: "iohook" // Need to be axternal due to .node binaries which can't be bundled
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, "build/src"),
    filename: "[name].js",
  },
  plugins: [
      new HtmlWebpackPlugin()
  ]
};
