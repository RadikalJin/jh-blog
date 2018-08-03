var popularModule = angular.module("popularApp", []);

popularModule.controller("popularCtrl", function($scope, $http) {
    $scope.$watch("postURL", assignURL, true);
    function assignURL() {
        //TODO make real service
        var posts = [];
        for (var i = 1; i < 5; i++) {
            posts.push({
                imageURL: 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png',
                title: 'Sample ' + i,
                content: 'Test text here'
            });
        }
        $scope.posts = posts;

    /*    var url = $scope.postURL;
        $http.post(url).then(function(response) {
            var posts = JSON.parse(response.data.message);
            posts = formatDates(posts);
            $scope.posts = posts;
        });
    */
    };
});

popularModule.filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("App2"), ["popularApp"]);
});
