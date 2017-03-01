var htmlTemplate = require('./dhe-header.component.html');

require('./dhe-header.component.css');

angular.module('myBlog').
    component('dheHeader', {
        template: htmlTemplate

    });
