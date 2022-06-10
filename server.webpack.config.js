const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: './server/server.js',
    target: 'node',
    node: {
        __dirname: false,
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'server.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['@babel/env'],
                    compact: true,
                },
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './server/keys', to: 'keys' },
            ],
        }),
    ],
};
