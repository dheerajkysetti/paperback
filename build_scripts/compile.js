const hbs = require('handlebars');
const fs = require('bluebird').promisifyAll(require('fs-extra'));
const chokidar = require('chokidar');
const path = require('path');
const join = path.join;
const glob = require('glob');
const projectRoot = join(__dirname, '..');

var indexTemplate = hbs.compile(fs.readFileSync(join(projectRoot, 'templates', 'shell.html'), 'utf-8'));
var templatedString = indexTemplate({ HTML_CONTENT: '' });
fs.writeFileSync(join(projectRoot, 'public', 'index.html'), templatedString);


var articleTemplate = hbs.compile(fs.readFileSync(join(projectRoot, 'templates', 'article-shell.html'), 'utf-8'));

glob(projectRoot + '/blog_content/**/*.*', function (er, files) {

  files.forEach(function (f) {
    var ext = path.extname(f);
    if (ext === 'html') {
      fs.writeFileSync(join(projectRoot, 'public', f.replace(projectRoot, '')),
        articleTemplate({ HTML_CONTENT: fs.readFileSync(f, 'utf-8') }));
    }

  });

});

/*
chokidar.watch('.', {ignored: /[\/\\]\./}).on('all', (event, path) => {
  console.log(event, path);
});*/
