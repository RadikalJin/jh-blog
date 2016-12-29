var editorModule = angular.module("editorApp", []);

editorModule.controller("myCtrl", function($scope, $http) {

    getBlogReferenceData($scope, $http);
    getPosts($scope);

    window.addEventListener("load", function() {
        if ($scope.posts[0].id) {
            document.getElementById('deleteButton').style.display = 'inline';
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
            var pastVerb = getPastVerbByAction(action);
            var sendToURL = getSendToURLByAction(action);
            callSavePostService(sendToURL, post, returnToURL, pastVerb, action);
        });
    }

    $scope.deletePost = function() {
        if (window.confirm("Are you sure you want to delete this post?")) {
            var post = $scope.posts[0];
            post.blogId = $scope.selectedBlog.id;
            loadScript("../scripts/locationUtils.js", function () {
                var returnToURL = getReturnToURLByBlogId(post.blogId);
                var sendToURL = getSendToURLByAction('delete') + '/' + post.id;
                callDeletePostService(sendToURL, post, returnToURL);
            });
        }
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

function callSavePostService(sendToURL, post, returnToURL, pastVerb, presentVerb) {
    callService(sendToURL, JSON.stringify(post), returnToURL, pastVerb, presentVerb);
}

function callDeletePostService(sendToURL, post, returnToURL) {
    callService(sendToURL, JSON.stringify(post), returnToURL, 'deleted', 'delete');
}

function callService(sendToURL, data, returnToURL, pastVerb, presentVerb) {
    $.ajax({
        type: "POST",
        url: sendToURL,
        data: data,
        contentType: 'application/json',
        success: function(data) {
            if (data.status == 'OK') {
                alert('Post successfully ' + pastVerb);
                sessionStorage.removeItem('postToEdit');
                window.location = returnToURL;
            } else {
                alert('Failed to ' + presentVerb + ' post: ' + data.status + ', ' + data.message);
            }
        }
    });
}

editorModule.filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);
