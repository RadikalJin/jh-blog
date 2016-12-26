var postsModule = angular.module("entriesApp", []);

postsModule.controller("myCtrl", function($scope, $http) {
    $scope.clickedMoreButton = function() {
        sessionStorage.setItem('postToEdit', JSON.stringify(this.post));
        window.location = '/editor';
        //TODO Change this url
    }

    $scope.$watch("postURL", assignURL, true);
    function assignURL() {
        var url = $scope.postURL;
        $http.post(url).then(function(response) {
            var posts = JSON.parse(response.data.message);
            posts = formatDates(posts);
            $scope.posts = posts;
        });
    };
    function formatDates(data) {
        var m_names = new Array("January", "February", "March",
            "April", "May", "June", "July", "August", "September",
            "October", "November", "December");
        for (var i = 0; i < data.length; i++) {
            var currentPost = data[i];
            var date = new Date(+parseInt(currentPost.createdDate, 10));
            currentPost.formattedDate = m_names[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        }
        return data;
    }
});

postsModule.filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("App1"), ["entriesApp"]);
});



