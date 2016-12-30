var editorModule = angular.module("editorApp", ['ngMaterial']);

editorModule.controller("myCtrl", function($scope, $http, $mdToast, $mdDialog) {

    getBlogReferenceData($scope, $http);
    getPosts($scope);

    window.addEventListener("load", function() {
        if (!$scope.posts[0].id) {
            document.getElementById('deleteButton').style.display = 'none';
        }
        $('#more-button').attr('disabled', 'true');
        $('#more-button').attr('title', 'The Read More button is disabled while editing');
    }, false);

    $scope.savePost = function() {
        var post = $scope.posts[0];
        post.blogId = $scope.selectedBlog.id;
        delete post.formattedDate;
        loadScript("../scripts/locationUtils.js", function() {
            var returnToURL =  getReturnToURLByBlogId(post.blogId);
            var action = post.id ? 'update' : 'create';
            callService(action, post, returnToURL, $mdToast);
        });
    }

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
    }
});

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
        posts = setUserDetails(posts);
        scope.posts = addFormattedDateToPosts(posts);
    });
    function retrieveOrInitPosts() {
        var savedPost = sessionStorage.getItem('postToEdit');
        if (savedPost == undefined) {
            return [{createdDate: new Date().getTime()}];
        } else {
            return [JSON.parse(savedPost)];
        }
    }
    function setUserDetails(data) {
        //TODO Get below username and id from global state
        data[0].userName = 'SamSilver';
        data[0].userId = '1';
        return data;
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
