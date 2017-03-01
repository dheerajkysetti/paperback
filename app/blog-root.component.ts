declare var require: any;

var rootTemplate = require('./blog-root.component.html');

angular.module('myBlog', ['ngRoute', 'BlogContent']);

angular.module('myBlog')
    .component('blogRoot', {
        template: rootTemplate
    })
    .config(['$routeProvider', '$locationProvider', AppConfig]);

function AppConfig($routeProvider: any, $locationProvider: any) {

    $routeProvider.when('/home', {
        template: '<dhe-posts-list></dhe-posts-list>'
    });
    $locationProvider
        .hashPrefix('!');

}

require('./blog-root.component.css');
require('./header/dhe-header.component.ts');
require('./posts-list/dhe-posts-list.component.ts');

