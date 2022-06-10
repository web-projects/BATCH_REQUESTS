const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const DEBUG = process.env.NODE_ENV === 'development';

const config = {
   mode: DEBUG ? 'development' : 'production',
   entry: {
       app: ['babel-polyfill', 'isomorphic-fetch', './app/main.js'],
   },
   output: {
      path: path.resolve(__dirname, 'build', 'public'),
      filename: DEBUG ? 'js/bundle.js' : 'js/bundle.[hash].js',
      publicPath: '/',
   },
   devServer: {
      inline: true,
      port: 8080,
   },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['@babel/env', '@babel/react'],
            },
         },
         {
            test: /modernizr/,
            loader: 'imports-loader?this=>window!exports-loader?window.Modernizr',
         },
      ],
   },
   plugins: [
       new ExtractTextPlugin(DEBUG ? 'css/style.css' : 'css/style.[hash].css'),
       new HtmlWebpackPlugin({
           template: 'app/index.html',
           hash: !DEBUG,
           filename: '../index.html',
           inject: 'body',
           minify: {
               collapseWhitespace: !DEBUG,
           },
       }),
         new CopyWebpackPlugin({
            patterns: [
               { from: 'app/vendor' },
            ],
         }),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
   ],
   node: {
      dns: 'empty',
      net: 'empty',
   },
};

module.exports = config;
