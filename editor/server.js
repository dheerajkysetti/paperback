const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('bluebird').promisifyAll(require('fs-extra'));
const _ = require('lodash');
const hbs = require('handlebars');


var articleTemplate = hbs.compile(fs.readFileSync(path.join(__dirname, '../templates', 'article-shell.html'), 'utf-8'));

app.use(express.static(path.join(__dirname, '..')));
app.use(bodyParser.json());

app.post('/editor/createblog', function (req, res) {
    var data = req.body;
    var tmplLoc = path.join(__dirname, '..', 'blog_content');
    var blogDescription = fs.readJsonSync(path.join(__dirname, '../blog_content/blog_description.json'));

    const ret = _.find(blogDescription, function (blog) {
        return blog.url === data.url;
    });
    if (ret) {
        res.status(400).send({
            status: 'failure',
            message: " URL:" + data.url + " Already present"
        });
        return;
    }

    if (data.url == null || data.url.length == 0) {
        res.status(400).send({
            status: 'failure',
            message: " URL:" + data.url + " is Empty"
        });
        return;
    }

    //End of Guard checks

    if (data.url.split('.').pop() !== 'html') {
        data.url = data.url + '.html';
    }
    tmplLoc = path.join(tmplLoc, data.url);
    var projectRoot = path.join(__dirname, '..');
    data.htmlSrcUrl = tmplLoc.replace(projectRoot, '');

    blogDescription.posts.push(data);
    fs.ensureFileAsync(tmplLoc).then(function () {
        return fs.writeFileAsync(tmplLoc, articleTemplate(data));
    }).then(function () {
        return fs.writeJsonAsync(path.join(__dirname, '../blog_content/blog_description.json'), blogDescription);
    }).then(function () {

        res.send({ status: 'ok', path: data.htmlSrcUrl });
    }).catch(function (er) {
        res.sendStatus(500).send({ status: 'failure' });
    });

});

app.post('/editor/savetemplate', function (req, res) {

});

app.post('/editor/compile', function (req, res) {
    res.send({ status: 'ok' });
});


app.listen(3000, function () {
    console.log('App Ready. http://localhost:3000/editor/index.html');
});