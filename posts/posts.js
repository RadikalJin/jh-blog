var postsModule = angular.module("entriesApp", []);

postsModule.controller("myCtrl", function($scope, $http) {
    $scope.clickedMoreButton = function() {
        sessionStorage.setItem('postToEdit', JSON.stringify(this.post));
        window.location = location.hostname + '/editor';
        //TODO Change this url
    }

    $scope.$watch("postURL", assignURL, true);
    function assignURL() {
        var url = $scope.postURL;
        $http.post(url).then(function(response) {
            var posts = JSON.parse(response.data.message);
            $.getScript('../scripts/dateUtils.js', function() {
                posts = addFormattedDateToPosts(posts);
                $scope.posts = posts;
            });
        });
    };
});

postsModule.filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("App1"), ["entriesApp"]);
});



