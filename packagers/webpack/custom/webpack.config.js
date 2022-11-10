const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  stats: {
    errorDetails: false,
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:8765",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-id, Content-Length, X-Requested-With",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    },
    static: path.resolve(__dirname, './dist'),
    compress: true,
    hot: true,
    port: 9000,
  },
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html' // output file
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      // {
      //   test: /\.js$/, //Regular expression 
      //   exclude: /(node_modules|bower_components)/,//excluded node_modules 
      //   use: {
      //     loader: "babel-loader", 
      //     options: {
      //       presets: ["@babel/preset-env"]  //Preset used for env setup
      //     }
      //   }
      // },
    ],
  }
}