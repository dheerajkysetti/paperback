var mod = angular.module('BlogContent', []);
mod.service('blogDataService', [blogDataService]);



function blogDataService() {

    var INST = this;
    INST.getPosts = function () {
        return {
            "post_1": {
                title: "",
                template: "",
                order: 1
            }
        };
    };

}//End of blog description