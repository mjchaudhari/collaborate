(function () {
      this.memberListBtnTpl = [
      
        '<i class="material-icons" ng-click="openMemberListPopup()">add_circle_outline</i>'
      
        
    ].join('\n');
    
    angular.module("app")
    .directive('memberList', ['$timeout', 
        function ($timeout) {
            return{
                restrict: "E",
                template: memberListBtnTpl,
                replace: false,
                scope: {
                    btnName: "=",
                    selectedMembers: "=",
                    done: "=",
                    options : "=?"
                    
                },
                controller: ["$scope", "$uibModal", "dataService", function($scope, $uibModal, dataService){
                    $scope.openMemberListPopup = function(){
                        //set selected attribute to each of member list
                        var memberModal = $uibModal.open({
                            ariaLabelledBy: 'modal-title',
                            ariaDescribedBy: 'modal-body',
                            windowTemplateUrl:"/modules/directives/modal.window.tpl.html",
                            templateUrl : "/modules/directives/member.list.tpl.html",
                            windowClass:"my-modal-dialog",
                            windowTopClass : "full-page-modal",
                            controller: "memberListPopupCtrl",
                            size:'lg',
                            resolve:{
                                options: function(){
                                    return $scope.options;
                                }
                            }
                        });
                        memberModal.result
                        .then(function(data){
                            angular.copy(data, $scope.selectedMembers);
                            if($scope.done){
                                $scope.done($scope.selectedMembers);
                            }
                        }, function(){
                            //cancelled
                        });

                    }
                }]
            }
    }])
    .controller("memberListPopupCtrl", ["$scope", "$log", "$q", "$timeout", "dataService","$uibModalInstance", "options", function($scope, $log, $q, $timeout, dataService, $uibModalInstance, options){
        $scope.title = "Search Members";
            $scope.members = [];
            $scope.searchTerm = "";
            $scope.selectedItems = [];
            if(options == null){
                options = {};
            }

            $scope.memberOptions = {
                select: true,
                onSelect : selectMember
            }
            
            function selectMember(m){
                m.selected = !m.selected;
            }


            $scope.search = function(searchTerm){
                //get the members
                //if members are provided then use that list otherwise fetch
                var userPromise = null;
                if(options.members){
                    userPromise = $timeout(function(){
                        angular.copy(options.members, $scope.members);
                    }, 10);
                }
                else if(options.groupId){
                    //get members in group
                    userPromise = dataService.getGroupMembers(options.groupId)
                    .then(function(data){
                        angular.copy(options.members, $scope.members);
                    }, function(){

                    });
                }
                else {
                    //get all members
                    userPromise = dataService.getUsers($scope.searchTerm);
                }

                userPromise
                .then(function(data){
                        angular.copy(data.data.data, $scope.members);
                        $scope.members.forEach(function(m){
                            m._name = m.firstName + ' ' + m.lastName;
                            m.name =m._name;
                        });
                    }, function(err){

                    });
            }

            $scope.ok = function(){
                $scope.selectedItems = _.where($scope.members, {selected: true});
                $uibModalInstance.close($scope.selectedItems);
            }

            $scope.cancel = function(){
                $uibModalInstance.dismiss();
            }
    }]);
    

})();