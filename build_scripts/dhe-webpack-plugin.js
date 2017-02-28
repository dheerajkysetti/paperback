const shelljs = require('shelljs');
const fs = require('fs-extra');

function DheWebpackPlugin() {
};

DheWebpackPlugin.prototype.apply = function (compiler) {
    compiler.plugin('run', function (compiler, callback) {
        
        fs.copy('./app/index.html','./dist/release/index.html');
   

        callback();
    });
};

module.exports = DheWebpackPlugin;