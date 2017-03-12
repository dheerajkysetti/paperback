const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
var blogDescription = require('../blog_content/blog_description.json');

app.use(express.static(path.join(__dirname, '..')));
app.use(bodyParser.json());

app.post('/editor/createblog', function (req, res) {
    var data = req.body;
    var tmplLoc = path.join(__dirname, '..', 'blog_content');

    tmplLoc = path.join(tmplLoc, data.url);

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

    blogDescription.posts.push(data);

    fs.ensureFile(tmplLoc, function () {
        fs.writeJson(path.join(__dirname, '../blog_content/blog_description.json'),
            blogDescription, function () {
                res.send({ status: 'ok' });
            });
    });
});

app.post('/editor/savetemplate', function (req,res) {

});

app.get('/editor/gettemplate', function (req,res) {

});


app.listen(3000, function () {
    console.log('App Ready. http://localhost:3000/editor/index.html');
});