const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin =
// 	require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	entry: './src/index.ts',
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
		path: path.resolve(__dirname, 'build'),
		library: { name: 'pixil', type: 'umd' },
	},
	externals: {
		'pixi.js': {
			commonjs: 'pixi.js',
			commonjs2: 'pixi.js',
			amd: 'pixi.js',
			root: 'PIXI',
		},
		'pixi-viewport': {
			commonjs: 'pixi-viewport',
			commonjs2: 'pixi-viewport',
			amd: 'pixi-viewport',
			root: 'PIXI_VIEWPORT',
		},
	},
	// plugins: [new BundleAnalyzerPlugin()],
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					keep_classnames: true,
				},
			}),
		],
	},
	mode: 'production',
};
