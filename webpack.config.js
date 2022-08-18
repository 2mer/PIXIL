const path = require('path');

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
	},
	externals: {
		'pixi-viewport': {
			commonjs: 'pixi-viewport',
			commonjs2: 'pixi-viewport',
			amd: 'pixi-viewport',
		},
	},
};
