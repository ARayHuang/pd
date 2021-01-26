const path = require('path');
const config = require('config');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const extractRoot = new MiniCssExtractPlugin({
	filename: 'css/admin.css',
});
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MODE = 'development';

module.exports = {
	mode: MODE,
	devtool: 'source-map',
	optimization: {
		runtimeChunk: true,
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
			},
			{
				test: /\.css$/,
				exclude: /(node_modules(?!\/antd|\/ljit-react-components)|bower_components)/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',

					},
				],
			},
			{
				test: /\.styl$/,
				exclude: [
					/(node_modules|bower_components)/,
				],
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'stylus-loader',
					},
				],
			},
			{
				test: /\.pug$/,
				use: ['pug-loader'],
			},
			{
				test: /\.(png|jpg|gif|ttf|eot|woff|woff2|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]',
						},
					},
				],
			},
		],
	},
	devServer: {
		port: config.WEBPACK.PORT,
		contentBase: 'public',
		historyApiFallback: {
			rewrites: [
				{ from: /^\/client/, to: '/client-app.html' },
				{ from: /^\/management/, to: '/management-app.html' },
			],
		},
		proxy: {
			'/api/client': {
				target: config.CLIENT.BASE_API_URL,
				pathRewrite: { '^/api/client': '' },
			},
			'/api/management': {
				target: config.MANAGEMENT.BASE_API_URL,
				pathRewrite: { '^/api/management': '' },
			},
		},
	},
	entry: {
		'client-console': path.join(__dirname, 'app', 'client-console', 'index.js'),
		'management-console': path.join(__dirname, 'app', 'management-console', 'index.js'),
	},
	output: {
		path: path.join(__dirname, './public'),
		filename: 'js/[name].js',
		publicPath: '/',
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(MODE),
				MODE: JSON.stringify(config.MODE),
				SOCKET_URL: JSON.stringify(config.CLIENT.SOCKET_URL),
				CLIENT_BASE_API_URL: JSON.stringify('/api/client'),
				MANAGEMENT_BASE_API_URL: JSON.stringify('/api/management'),
			},
		}),
		extractRoot,
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new HtmlWebpackPlugin({
			filename: 'client-app.html',
			chunks: ['client-console'],
			template: 'views/client-app.pug',
		}),
		new HtmlWebpackPlugin({
			filename: 'management-app.html',
			chunks: ['management-console'],
			template: 'views/management-app.pug',
		}),
	],
	resolve: {
		alias: {
			'client-console': path.join(__dirname, './app/client-console/'),
			'management-console': path.join(__dirname, './app/management-console/'),
			'ljit-store-connecter': path.join(__dirname, './app/ljit-store-connecter/'),
			immutable: path.join(__dirname, './node_modules/immutable'),
		},
	},
};
