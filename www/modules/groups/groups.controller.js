
(function (){
    angular.module("app")
    .controller("groupsController",groupsController);
    
    groupsController.$inject = ["$scope", "$rootScope", "$log", "$q", "$localStorage", "$state","$stateParams" ,"dataService", "config","authService"];
    
    function groupsController($scope, $rootScope,  $log, $q, $localStorage, $state, stateParams, dataService, config, authService){
        
        //bindable mumbers
        $scope.mainTitle = "Groups";
        $scope.groupList = [];
        $scope.promices = {};
        $scope.defaultGroupThumbnail = "./images/cp.png";
        function getGroups (){
            var groupsPromice = dataService.getGroups()
            .then(function(d){
                angular.copy(d.data.data, $scope.groupList);
            },
            function(e){

            });
            $scope.promices.groupsPromice = groupsPromice;
            return groupsPromice;
        }

        var preInit = function(){
            var tasks = [];
            tasks.push(getGroups());
            $scope.promices.init = $q.all([
                tasks
            ])
            .then(function(){
                init();
            });
        }

        var init = function(){

        };
        $scope.openBoard = function(g){
            $state.go("home.group.board",{"g": g._id});
            $scope.mainTitle = g.name;
        }
        $scope.details = function(g){
            $state.go("home.group.detail",{"g": g._id});
            $scope.mainTitle = g.name;
        }
        preInit();

    }//conroller ends
})();