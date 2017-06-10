
(function (){
    angular.module("app")
    .controller("groupDetailController",groupDetailController);
    
    groupDetailController.$inject = ["$scope", "$rootScope", "$log", "$q", "$localStorage", "$state", "$stateParams" ,"dataService", "config","authService","toaster", "$uibModal"];
    
    function groupDetailController($scope, $rootScope,  $log, $q, $localStorage, $state, $stateParams, dataService, config, authService, toaster, $uibModal ){
        
        //bindable mumbers
        
        $scope.promices = {};
        $scope._id = $stateParams.g == "new" ? null : $stateParams.g;
        $scope.title = $scope._id == null ? "Create Group" : "Edit Group";
        $scope.group = null;
        $scope.groupCopy = null;

        $scope.selectedMembers = [] ;
        
        $scope.view = $stateParams.v;
        
        $scope.searchText ="";
        $scope.searchResult = [];
        
        $scope.querySearch   = _querySearch;
        $scope.saveGroupDetails = _saveGroupDetails;

        $scope.memberOptions = {
            remove: true,
            onRemove : removeMember,
        }
        function selectMember(){

        }
        function showSimpleToast (message) {
            toaster.pop({
                type: 'error',
                title: '',
                body: message,
                showCloseButton: true
            });
        };

        var preInit = function(){
            var tasks = [];
            if($scope._id){
                tasks.push(getGroupDetail());
                $rootScope.__busy = $q.all(tasks)
                .then(function(){
                    init()
                });   
            }
            else{
                init();
            }
        }

        var init = function(){

        };

        function getGroupDetail (){
            return dataService.getGroup($scope._id)
            .then(function(d){
                $scope.group = angular.copy(d.data.data[0]);
                if($scope.group.members){
                    $scope.group.members.forEach(function(m){
                        m._name = m.firstName + ' ' + m.lastName;
                        m.name =m._name;
                    })
                }
                $scope.groupCopy = angular.copy($scope.group);
            },
            function(e){

            });
        }

        function _querySearch(term){
            $scope.searchResult=[];
            if(term && term.length > 0){

            }
            var defer = $q.defer();
            dataService.getUsers(term)
            .then(function(d){
                var result = [];
                angular.copy(d.data.data, result);
                result.forEach(function(u){
                    u._name = u.firstName + ' ' + u.lastName;
                    //check if this user is alredy added
                    var exist = _.findWhere($scope.group.members,{"_id":u._id});
                    if(exist){
                        u.__added = true;
                    }
                })
                var sorted = _.sortBy(result,"_name");
                //angular.copy(sorted,$scope.searchResult)
                defer.resolve(sorted)
            }, function(){
              defer.reject()  ;
            });
            return defer.promise;
        }
        
        function _getUsers(term){
            var defer = $q.defer();
            dataService.getUsers(term)
            .then(function(d){   
                var users = [];
                d.data.data.forEach(function(u){
                    u._name = u.firstName + ' ' + u.lastName;
                    u.name =u._name;
                });
                defer.resolve(d.data.data);
            });
            return defer.promise;
        }
        
        function _saveGroupDetails(){
            //basic validation
            if($scope.group.name == ""){
                showSimpleToast("Group name requied");
                return;
            }

            dataService.saveGroup($scope.group)
            .then(function(g){
                //if this group is created by current user then allow user to manage users
                $scope.group._id = g.data.data._id;
                $scope.group.members = g.data.data.members;
                $scope.group.members.forEach(function(u){
                    u._name = u.firstName + ' ' + u.lastName;
                    u.name =u._name;
                });
                $scope.group.createdBy = g.data.data.createdBy;
                showSimpleToast("Group saved");
            },
            function(e){
                $log.error(e);
            });
        }
        
        $scope.onMembersSelected = function(){
            if($scope.selectedMembers == null){
                return;
            }
            $scope.selectedMembers.forEach(function(m){
                //find and add
                var existing = _.findWhere($scope.group.members, {__id: m.__id});
                if(angular.isUndefined(existing)){
                    m._name = m.firstName + ' ' + m.lastName;
                    $scope.group.members.push(m);
                }
            });
        };
        function removeMember(member){
            $log.info(member._name);
        }
        preInit();


    }//conroller ends
})();