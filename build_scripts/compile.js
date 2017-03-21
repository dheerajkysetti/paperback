const hbs = require('handlebars');
const fs = require('bluebird').promisifyAll(require('fs-extra'));
const chokidar = require('chokidar');
const _ = require('lodash');
const path = require('path');
const join = path.join;
const glob = require('glob');
const projectRoot = join(__dirname, '..');
const blog = require('../blog_content/blog_description.json');
const BLOG_LIST_SIZE = 10;

hbs.registerPartial('empty_page', "");

function createIndexHtml() {
  var indexTemplate = hbs.compile(fs.readFileSync(join(projectRoot, 'templates', 'shell.html'), 'utf-8'));
  var tmpObj = {};
  tmpObj.title = blog.blogTitle;
  tmpObj.description = blog.blogDescription;
  tmpObj.title = blog.blogTitle;
  tmpObj.author = blog.author;
  tmpObj.pageTitle = blog.blogTitle;
  tmpObj.tags = blog.tags;
  tmpObj.MAIN_HTML_CONTENT = blog.posts.length == 0 ? '' : fs.readFileSync(join(projectRoot,'public','blog-list-page-1.html'),'utf-8');
  var templatedString = indexTemplate(tmpObj);
  fs.writeFileSync(join(projectRoot, 'public', 'index.html'), templatedString);
}

function createListPage() {
  var postsInPage = _.chunk(blog.posts, BLOG_LIST_SIZE);
  var compiledHtml = hbs.compile(fs.readFileSync(join(projectRoot, 'templates', 'blog-list-shell.html'), 'utf-8'));
  var postPages = [], tCtx = [];
  postsInPage.forEach(function (page, index) {
    var tObj = {};
    tObj.hasPrevious = index == 0 || postsInPage.length < 1 ? false : true;
    tObj.hasNext = index == (postPages.length - 1) || postsInPage.length < 1 ? false : true;
    tObj.posts = page;
    tObj.position = index;
    tObj.postsPages = postPages;
    postPages.push({ url: 'blog-list-page-' + (index + 1) + '.html', position: (index + 1) });
    tCtx.push(tObj);
  });

  tCtx.forEach(function (ctx, index) {
    fs.writeFileSync(join(projectRoot, 'public', 'blog-list-page-' + (index+1) + '.html'), compiledHtml(ctx)); 
  });

}

function copyArticles() {
  var articleTemplate = hbs.compile(fs.readFileSync(join(projectRoot, 'templates', 'shell.html'), 'utf-8'));
  glob(projectRoot + '/blog_content/**/*.*', function (er, files) {
    files.forEach(function (f) {
      var ext = path.extname(f);
      if (ext === '.html') {
        fs.outputFileSync(join(projectRoot, 'public', f.replace(projectRoot, '')),
          articleTemplate({ HTML_CONTENT: fs.readFileSync(f, 'utf-8') }));
      }
    });

  });
}


createListPage();
createIndexHtml();
copyArticles();



/*
chokidar.watch('.', {ignored: /[\/\\]\./}).on('all', (event, path) => {
  console.log(event, path);
});*/
