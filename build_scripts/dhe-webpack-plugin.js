const shelljs = require('shelljs');
const fs = require('fs-extra');
var blogDescription = require('../blog_content/blog_description.json');

function DheWebpackPlugin() {
};

DheWebpackPlugin.prototype.apply = function (compiler) {
    compiler.plugin('run', function (compiler, callback) {
        
        fs.copy('./app/index.html','./dist/release/index.html');
        blogDescription

        callback();
    });
};

module.exports = DheWebpackPlugin;