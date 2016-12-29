var editorModule = angular.module("editorApp", []);

editorModule.controller("myCtrl", function($scope, $http) {

    getBlogReferenceData($scope, $http);
    getPosts($scope);

    window.addEventListener("load", function() {
        $('#more-button').attr('disabled', 'true');
        $('#more-button').attr('title', 'The Read More button is disabled while editing');
    }, false);

    $scope.savePost = function() {
        var post = $scope.posts[0];
        post.blogId = $scope.selectedBlog.id;
        delete post.formattedDate;
        loadScript("../scripts/locationUtils.js", function() {
            var returnToURL =  getReturnToURLByBlogId(post.blogId);
            var sendToURL = getSendToURLByPost(post);
            callSavePostService(sendToURL, post, returnToURL);
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

function callSavePostService(sendToURL, post, returnToURL) {
    $.ajax({
        type: "POST",
        url: sendToURL,
        data: JSON.stringify(post),
        contentType: 'application/json',
        success: function(data) {
            if (data.status == 'OK') {
                alert('Post successfully saved');
                sessionStorage.removeItem('postToEdit');
                window.location = returnToURL;
            } else {
                alert('Failed creating post: ' + data.status + ', ' + data.message);
            }
        }
    });
}

editorModule.filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);
