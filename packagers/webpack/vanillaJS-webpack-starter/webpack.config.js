const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const webpackConfig = {

	headers: {
	  "Access-Control-Allow-Origin": "https://gundb.eyfl.io",
	  "Access-Control-Allow-Credentials": "true",
	  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-id, Content-Length, X-Requested-With",
	  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
	},
	entry: path.resolve(__dirname, "src", "index.js"),

	output: {
		filename: "[name].[contenthash].bundle.js",
		path: path.resolve(__dirname, "dist"),
		clean: true
	},
	devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"]
					}
				}
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset"
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: "VanillaJS Webpack Starter",
			template: path.resolve(__dirname, "src", "index.html")
		})
	],

	optimization: {
		splitChunks: {
			cacheGroups: {
				node_vendors: {
					name: "vendor",
					test: /[\\/]node_modules[\\/]/,
					chunks: "all",
					priority: 1
				}
			}
		}
	},

	mode: "production"
};

module.exports = webpackConfig;
