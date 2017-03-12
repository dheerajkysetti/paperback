const hbs = require('handlebars');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const join = require('path').join;

const projectRoot = join(__dirname, '..');

var template = hbs.compile(fs.readFileSync(join(projectRoot, 'templates', 'shell.html'), 'utf-8'));
var templatedString = template({ HTML_CONTENT: '' });
fs.writeFileSync(join(projectRoot, 'public', 'index.html'), templatedString);


/*
chokidar.watch('.', {ignored: /[\/\\]\./}).on('all', (event, path) => {
  console.log(event, path);
});*/
