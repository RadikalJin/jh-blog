var editorModule = angular.module("editorApp", ['ngMaterial']);

editorModule.controller("myCtrl", function($scope, $http, $mdToast, $mdDialog) {

    getTagsReferenceData($scope, $http);
    getBlogReferenceData($scope, $http);
    getPosts($scope);

    window.addEventListener("load", function() {
        if (!$scope.posts[0].id) {
            document.getElementById('deleteButton').style.display = 'none';
        }
        $('#more-button').attr('disabled', 'true');
        $('#more-button').attr('title', 'The Read More button is disabled while editing');
    }, false);

    $scope.deletePost = function() {
        var confirm = $mdDialog.confirm()
            .title('Confirm deletion')
            .textContent('Are you sure you want to delete this post?')
            .ok('Delete post')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            var post = $scope.posts[0];
            post.blogId = $scope.selectedBlog.id;
            loadScript("../scripts/locationUtils.js", function () {
                var returnToURL = getReturnToURLByBlogId(post.blogId);
                callService('delete', post, returnToURL, $mdToast);
            });
        });
    };

    $scope.cancelButtonClicked = function() {
        var confirm = $mdDialog.confirm()
            .title('Confirm cancel changes')
            .textContent('Are you sure you want to cancel your changes to this post?')
            .ok('Confirm')
            .cancel('Stay');

        $mdDialog.show(confirm).then(function() {
            window.history.back();
        });
    };

    $scope.savePost = function() {
        var post = $scope.posts[0];
        post.blogId = $scope.selectedBlog.id;
        post.tags = $scope.tag_ex;
        delete post.formattedDate;
        loadScript("../scripts/locationUtils.js", function() {
            var returnToURL =  getReturnToURLByBlogId(post.blogId);
            var action = post.id ? 'update' : 'create';
            callService(action, post, returnToURL, $mdToast);
        });
    };



    $scope.tag_list = [];
    $scope.tag_ex = [];

    $scope.searchTag = function (query) {
        if ((/^\d+$/.test(query))) {
            var results = query ? $scope.tag_list.filter(
                function (tag) {
                    var regex = new RegExp(query,'gi');
                    return tag.id.match(regex);
                }
            ) : $scope.tag_list;
        } else {
            var results = query ? $scope.tag_list.filter(
                function (tag) {
                    var lowercaseQuery = angular.lowercase(query);
                    var regex = new RegExp(lowercaseQuery,'gi');
                    return tag.tagName.match(regex);
                }
            ) : $scope.tag_list;
        }
        return results;
    };

    $scope.transformChip = function (chip) {
        if (typeof chip === 'string' || chip instanceof String) {
            return {tagName:chip};
        } else {
            return chip;
        }
    }




});

function getTagsReferenceData(scope, http) {
    var blogName = 'fitness';
    var tagURL = 'http://josephhoare.com:8090/blogs/' + blogName + '/tags';
    http.post(tagURL).then(function(response) {
        var tags = JSON.parse(response.data.message);
        scope.tag_list = tags;
    });
}

function getBlogReferenceData(scope, http) {
    var blogsURL = 'http://josephhoare.com:8090/blogs';
    http.post(blogsURL).then(function(response) {
        var blogs = JSON.parse(response.data.message);
        scope.blogs = blogs;
        if (scope.selectedBlog == undefined) {
            scope.selectedBlog = scope.blogs[0];
        }
    });
}

function getPosts(scope) {
    loadScript("../scripts/dateUtils.js", function() {
        var posts = retrieveOrInitPosts();
        scope.posts = addFormattedDateToPosts(posts);
        scope.postsToDisplay = scope.posts;
        scope.tag_ex = posts[0].tags;
    });
    function retrieveOrInitPosts() {
        var savedPost = sessionStorage.getItem('postToEdit');
        if (savedPost == undefined) {
            return [{
                createdDate: new Date().getTime(),
                //TODO Get below username and id from global state
                userName: 'SamSilver',
                userId: '1'
            }];
        } else {
            return [JSON.parse(savedPost)];
        }
    }
}

function callService(action, post, returnToURL, mdToast) {
    var sendToURL = getSendToURLByAction(action);
    var pastVerb = getPastVerbByAction(action);
    $.ajax({
        type: "POST",
        url: sendToURL,
        data: JSON.stringify(post),
        contentType: 'application/json',
        success: function(data) {
            if (data.status == 'OK') {
                var message = 'Post successfully ' + pastVerb;
                showToast(mdToast, message, returnToURL);
            } else {
                var message = 'Failed to ' + action + ' post: ' + data.status + ', ' + data.message;
                showToast(mdToast, message);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            var message = 'Failed to ' + action + ' post: ' + thrownError;
            showToast(mdToast, message);
        }
    });
}

function showToast(mdToast, message, returnToURL) {
    mdToast.show(
        mdToast.simple()
            .textContent(message)
            .position('top right')
    ).then(
        returnToURL ?
            setTimeout(function(){afterToast(returnToURL)}, 2000)
        : ''
    );
}

function afterToast(returnToURL) {
    sessionStorage.removeItem('postToEdit');
    window.location = returnToURL;
}

editorModule.directive("checkImage", function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            attrs.$observe('ngSrc', function(ngSrc) {
                loadScript("../scripts/advancedUtils.js", function() {
                    checkImage(ngSrc, element);
                });
            });
        }
    };
});

editorModule.filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);
