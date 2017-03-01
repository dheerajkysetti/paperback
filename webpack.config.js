var webpack = require('webpack');
var path = require('path');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var DheWebpackPlugin = require('./build_scripts/dhe-webpack-plugin.js');

module.exports = {
    entry: {app:'./app/blog-root.component.ts',content:'./blog_content/blog_content_module.ts'},
    output: {
        path: 'dist/release',
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(ts)$/, loader: 'ts-loader', options: {}
            },
            {
                test: /\.(html)$/, loader: 'html-loader', options: {}
            },
            {
                test: /\.(jpeg|jpg|png)$/, loader: 'url-loader', options: {
                    limit:1000
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader","css-loader"]
            }
        ]
    },
    plugins: [
        // new UglifyJSPlugin({ mangle: false }),
        new DheWebpackPlugin()
    ]
};