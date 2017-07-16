
(function (){
    angular.module("app")
    .controller("groupsController",groupsController);
    
    groupsController.$inject = ["$scope", "$rootScope", "$log", "$q", "$localStorage", "$state","$stateParams" ,"dataService", "config","authService"];
    
    function groupsController($scope, $rootScope,  $log, $q, $localStorage, $state, stateParams, dataService, config, authService){
        
        //bindable mumbers
        $scope.mainTitle = "Groups";
        $scope.groupList = [];
        $scope.promises = {};
        $scope.defaultGroupThumbnail = "./images/cp.png";
        $scope.listItemOptions = {select:false, onSelect : openBoard, thumbnailProp : 'thumbnail'};
        function getGroups (){
            var groupsPromise = dataService.getGroups()
            .then(function(d){
                angular.copy(d.data.data, $scope.groupList);
            },
            function(e){

            });
            $scope.promises.groupsPromise = groupsPromise;
            return groupsPromise;
        }

        var preInit = function(){
            var tasks = [];
            tasks.push(getGroups());
            $rootScope.__busy = $q.all(tasks)
            .then(function(){
                init();
            });
        }

        var init = function(){

        };
        
        $scope.createGroup = function(){
            $state.go("home.group.new",{"g": "new"});
        }
        
        function openBoard(g){
            $state.go("home.group.board",{"g": g._id});
            $scope.mainTitle = g.name;
        }
        
        preInit();

    }//conroller ends
})();