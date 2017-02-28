var htmlTemplate = require('./dhe-posts.component.html');

require('./dhe-posts.component.css.css');

angular.module('myBlog').
    component('dhePostsList', {
        template: htmlTemplate

    });
