var postsModule = angular.module("entriesApp", []);

postsModule.controller("myCtrl", function($scope, $http) {
    $scope.clickedMoreButton = function() {
        sessionStorage.setItem('postToEdit', JSON.stringify(this.post));
        window.location = '../editor';
    }

    $scope.$watch("postURL", assignURL, true);
    function assignURL() {
        var url = $scope.postURL;
        $http.post(url).then(function(response) {
            var posts = JSON.parse(response.data.message);
            loadScript("http://josephhoare.com/scripts/dateUtils.js", function() {
                $scope.posts = addFormattedDateToPosts(posts);
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

function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}


