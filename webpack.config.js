var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		game: './game/main.js',
		editor: './level-editor/main.js'
	},
	output: {
		path: __dirname + '/dist',
		publicPath: '',
		filename: '[name]-bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'url-loader'
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			'jQuery': 'jquery',
			'$': 'jquery',
			'global.jQuery': 'jquery',
			'_': 'lodash'
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: 'body',
			scriptLoading: 'blocking',
			chunks: ['game']
		}),
		new HtmlWebpackPlugin({
			filename: 'level-editor.html',
			template: 'level-editor.html',
			inject: 'body',
			scriptLoading: 'blocking',
			chunks: ['editor']
		}),
		//copy all game images from "/img" to "/dist/img"
		new CopyWebpackPlugin({
			patterns: [
				{
					from: './img',
					to: './img'
				}
			]
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname)
		}
	}
};
