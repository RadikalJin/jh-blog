var postsModule = angular.module("entriesApp", []);

postsModule.controller("myCtrl", function($scope, $http) {
    window.addEventListener("load", function() {
        $scope.$apply();
    }, false);

    $scope.clickedMoreButton = function() {
        sessionStorage.setItem('postToEdit', JSON.stringify(this.post));
        window.location = '../editor';
    }

    $scope.$watch("postURL", assignURL, true);
    function assignURL() {
        var url = $scope.postURL;
        $http.post(url).then(function(response) {
            var posts = JSON.parse(response.data.message);
            loadScript("../scripts/dateUtils.js", function() {
                $scope.posts = addFormattedDateToPosts(posts);
                $scope.$apply();
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


