var webpack = require('webpack');
var path = require('path');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var DheWebpackPlugin = require('./build_scripts/dhe-webpack-plugin.js');

module.exports = {
    entry: './app/blog-root.component.ts',
    output: {
        path: 'dist/release',
        filename: 'app.bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)$/, loader: 'ts-loader', options: {}
            },
            {
                test: /\.(html)$/, loader: 'html-loader', options: {}
            },
            {
                test: /\.(jpeg|jpg|png)$/, loader: 'url-loader', options: {}
            },
            {
                test: /\.css$/,
                use: ["style-loader","raw-loader"]
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin({ mangle: false }),
        new DheWebpackPlugin()
    ]
};