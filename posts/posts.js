var postsModule = angular.module("entriesApp", ['shared-service', 'ngMaterial']);

postsModule.controller("myCtrl", function($scope, $http, SharedService) {
    window.addEventListener("load", function() {
        $scope.$apply();
    }, false);

    $scope.hoverIn = function() {
        this.hoverEdit = true;
    };
    $scope.hoverOut = function() {
        this.hoverEdit = false;
    };

    $scope.clickedEditButton = function() {
        sessionStorage.setItem('postToEdit', JSON.stringify(this.post));
        window.location = '../editor';
    };

    $scope.$watch("postURL", assignURL, true);
    function assignURL() {
        var url = $scope.postURL;
        $http.post(url).then(function(response) {
            var posts = JSON.parse(response.data.message);
            loadScript("../scripts/dateUtils.js", function() {
                posts = addFormattedDateToPosts(posts);

                //sort oldest to newest
                posts.sort(function(a, b){
                    return b.createdDate - a.createdDate;
                });

                $scope.tagsSearchable = true;

                $scope.allPosts = posts;
                $scope.postsToDisplay = posts;
                $scope.$apply();
            });
        });
    };

    $scope.tagsSearchable = false;

    $scope.text = function(){
        if ($scope.tagsSearchable) {
            var allPosts = $scope.allPosts;
            var filteredPosts = [];
            var tags = SharedService.get();

            var someTagsSet = typeof tags != "undefined" && tags != null && tags.length > 0;
            if (someTagsSet) {
                for (var i = 0; i < allPosts.length; i++) {
                    var currentPost = allPosts[i];
                    var matchedATag = function(haystack, arr) {
                        return arr.some(function (v) {
                            return haystack.indexOf(v) >= 0;
                        });
                    };
                    var hayStackTagNames = tags.map(function(a) { return a.tagName});
                    var needleTagNames = currentPost.tags.map(function(a) { return a.tagName});
                    if (matchedATag(hayStackTagNames, needleTagNames)) {
                        filteredPosts.push(currentPost);
                    }
                }
            } else {
                filteredPosts = allPosts;
            }
            $scope.postsToDisplay = filteredPosts;
        }
    };

    $scope.change = function(){
        SharedService.change('app 2 activated')
    }
});

postsModule.directive("checkImage", function($http) {
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

postsModule.filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);

postsModule.directive('scrollOnClick', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm) {
            $elm.on('click', function() {
                $("body").animate({scrollTop: $elm.offset().top}, "slow");
            });
        }
    }
});


