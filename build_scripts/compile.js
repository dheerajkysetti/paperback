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
  var blogList = createListPage();
  var indexTemplate = hbs.compile(fs.readFileSync(join(projectRoot, 'templates', 'shell.html'), 'utf-8'));
  var tmpObj = {};
  tmpObj.title = blog.blogTitle;
  tmpObj.description = blog.blogDescription;
  tmpObj.title = blog.blogTitle;
  tmpObj.author = blog.author;
  tmpObj.pageTitle = blog.blogTitle;
  tmpObj.tags = blog.tags;
  tmpObj.MAIN_HTML_CONTENT = blog.posts.length == 0 ? '' : blogList[0];
  var templatedString = indexTemplate(tmpObj);
  fs.writeFileSync(join(projectRoot, 'public', 'index.html'), templatedString);

}

function createListPage() {
  var postsInPage = _.chunk(blog.posts, BLOG_LIST_SIZE);
  var compiledHtml = hbs.compile(fs.readFileSync(join(projectRoot, 'templates', 'blog-list-shell.html'), 'utf-8'));
  var postPages = [], tCtx = [], retPages = [];
  postsInPage.forEach(function (page, index) {
    var tObj = {};
    tObj.hasPrevious = (postsInPage.length - 1) > index;
    tObj.hasNext = (postsInPage.length - 1) < index;
    tObj.posts = page;
    tObj.position = index;
    tObj.displayPagination = (postsInPage.length - 1) > 0;
    tObj.postsPages = postPages;
    if (index > 0) {
      postPages.push({ url: 'blog-list-page-' + (index + 1) + '.html', position: (index + 1) });
    } else {
      postPages.push({ url: 'index.html', position: (index + 1) });
    }
    tCtx.push(tObj);
  });

  tCtx.forEach(function (ctx, index) {
    retPages.push(compiledHtml(ctx));
  });
  return retPages;
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
