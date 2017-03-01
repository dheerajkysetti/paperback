var htmlTemplate = require('./dhe-posts.component.html');

require('./dhe-posts.component.css');

angular.module('myBlog').
    component('dhePostsList', {
        template: htmlTemplate,
        controller: ['blogDataService', DhePostsListController]
    });

function DhePostsListController(blogDataService:any) {
    var $ctrl = this;

    $ctrl.posts = blogDataService.getPosts();
    
}