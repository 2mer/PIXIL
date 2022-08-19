const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './sandbox/index.tsx',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'server'),
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'public'),
		},
		compress: true,
		port: 9000,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'sandbox/index.html'),
		}),
	],
	mode: 'development',
};
