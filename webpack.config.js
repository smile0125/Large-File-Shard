const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    bundle: path.join(__dirname, "./index.js"),
  },
  output: {
    path: path.join(__dirname, "./build"),
    filename: "index.js",
    library: "FileShard", // 指定类库名,主要用于直接引用的方式(比如使用script 标签)
    libraryExport: "default", // 对外暴露default属性，就可以直接调用default里的属性
    globalObject: "this", // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
    libraryTarget: "umd", // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },

  plugins: [new CleanWebpackPlugin()],

  optimization: {
    // 一般在生产环境中用到
    minimizer: [
      new TerserWebpackPlugin(),
    ],
  },
};
