var editorModule = angular.module("editorApp", []);

editorModule.controller("myCtrl", function($scope, $http) {

    getBlogReferenceData();
    $scope.posts = getPosts();

    //$('#more-button').attr('disabled', 'true'); TODO

    function getBlogReferenceData() {
        var blogsURL = 'http://josephhoare.com:8090/blogs';
        $http.post(blogsURL).then(function(response) {
            var blogs = JSON.parse(response.data.message);
            $scope.blogs = blogs;
            if ($scope.selectedBlog == undefined) {
                $scope.selectedBlog = $scope.blogs[0];
            }
        });
    }

    $scope.savePost = function() {
        var post = $scope.posts[0];
        post.blogId = $scope.selectedBlog.id;
        delete post.formattedDate;
        var returnToURL = "http://josephhoare.com/" + getURLByBlogId(post.blogId);
        var sendToURL = getSendToURLByPost(post);
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
                    alert('Failed creating post: ' + data.status + ', ' + data.errorMessage);
                }
            }
        });
    }
});


function getPosts() {

    var posts = retrieveOrInitPosts();
    posts = setUserDetails(posts);
    posts = formatDates(posts, true);
    return posts;

    function retrieveOrInitPosts() {
        var savedPost = sessionStorage.getItem('postToEdit');
        if (savedPost == undefined) {
            return [{createdDate: new Date()}];
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
    function formatDates(data) {
        var m_names = new Array("January", "February", "March",
            "April", "May", "June", "July", "August", "September",
            "October", "November", "December");
        for (var i = 0; i < data.length; i++) {
            var currentPost = data[i];
            if (typeof currentPost.formattedDate === 'undefined') {
                var date = new Date(+parseInt(currentPost.createdDate, 10));
                currentPost.formattedDate = m_names[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
            }
        }
        return data;
    }
}


function getURLByBlogId(blogId) {
    var result = '';
    switch(blogId) {
        case '1':
            result = 'fitness';
            break;
        default:
            result = undefined;
    }
    return result;
}

function getSendToURLByPost(post) {
    var extension;
    if (post.id) {
        extension = 'updatePost';
    } else {
        extension = 'createPost';
    }
    return 'http://josephhoare.com:8090/' + extension;
}

editorModule.filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);




