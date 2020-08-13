/* global require module __dirname process */

const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const dev = process.env.NODE_ENV !== 'production'

module.exports = {
	target: 'web',
	mode: dev ? 'development' : 'production',
	devtool: 'source-map',
	entry: './src/index.jsx',
	resolve: {
		extensions: ['.jsx', '.js'],
		modules: [
			path.resolve('./src'),
			'node_modules',
		],
	},
	devServer: {
		historyApiFallback: true,
		port: 8081,
		proxy: {
			'/api': 'http://localhost:8080',
		},
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name].bundle.js?v=[chunkhash]',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
				],
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: 'react-svg-loader',
						options: {
							tsx: true,
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].bundle.css?v=[chunkhash]',
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
	],
}
