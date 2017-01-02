tagsApp = angular.module('tagsApp', ['ngMaterial', 'shared-service']);

tagsApp
    .controller('tagsCtrl', function($scope, $element, SharedService) {

        var t = this;

        t.searchTerm = '';
        t.tags = ['Run Report' ,'Swimming' ,'Running' ,'Cycling' ,'Advice', 'Triathlon'];
        t.selectedTags = [];
        t.onCloseFilter = function() {
            clearSearchTerm();
            $scope.change();
        };
        function clearSearchTerm() {
            t.searchTerm = '';
        }
        t.selectAll = function() {
            t.selectedTags = t.tags;
            var allButton = document.getElementById('select-all');
            allButton.style.display = 'none';
            var noneButton = document.getElementById('select-none');
            noneButton.style.display = 'inline';
        };
        t.selectNone = function() {
            t.selectedTags = [];
            var allButton = document.getElementById('select-all');
            allButton.style.display = 'inline';
            var noneButton = document.getElementById('select-none');
            noneButton.style.display = 'none';
        };
        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.
        $element.find('input').on('keydown', function(ev) {
            ev.stopPropagation();
        });

        $scope.text = function(){ return SharedService.get() };
        $scope.change = function(){
            SharedService.change(t.selectedTags)
        }
    });

angular.module('shared-service', [])
    .service('SharedService', function($rootScope, $window){
        var text = [];
        $window.rootScopes = $window.rootScopes || [];
        $window.rootScopes.push($rootScope);

        if (!!$window.sharedService){
            return $window.sharedService;
        }

        $window.sharedService = {
            change: function(newText){
                text = newText;
                angular.forEach($window.rootScopes, function(scope) {
                    if(!scope.$$phase) {
                        scope.$apply();
                    }
                });
            },
            get: function(){
                return text;
            }
        }

        return $window.sharedService;
    });

angular.element(document).ready(function() {
    var app1El = document.getElementById("App1");
    var tagEl = document.getElementById("AppTags");
    angular.bootstrap(app1El, ['entriesApp', 'shared-service']);
    angular.bootstrap(tagEl, ['tagsApp', 'shared-service']);
});