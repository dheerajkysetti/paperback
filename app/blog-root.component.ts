declare var require: any;

require('./blog-root.component.css');

angular.module('myBlog', []);

angular.module('myBlog').
    component('blogRoot', {
        template: `<dhe-header></dhe-header><dhe-content></dhe-content>`
    });

require('./header/dhe-header.component.ts');

