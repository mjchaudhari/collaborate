(function (){
      this.memberTpl = [
        '<div class="container-fluid padding-0">' ,
            '<div class="row">' ,
                '<div class="col-2">',
                    '<img ng-if="member.picture != null && member.picture != \'\'" ng-src="{{member.picture || defaultMemberThumbnail}}" class="thumbnail sq sq-sm" />',
                    '<i ng-if="member.picture == null || member.picture == \'\'" class="material-icons-lg">person</i>',
                '</div>',
                '<div class="col-8">',
                    '<h7 class="">{{member.firstName}} {{member.lastName}}</h7>',
                '</div>',
                '<div class="col-2">',
                    '<i ng-if="options.select" class="material-icons-md" ng-class="{\'text-primary\':member.selected}" ng-click="onSelect(member)">check_circle</i>',
                    '<i ng-if="options.edit" class="material-icons-md" ng-click="onEdit(member)">edit</i>',
                    '<i ng-if="options.remove" class="material-icons-md" ng-click="onRemove(member)">remove_circle_outline</i>',
                '</div>',
            '</div>',
        '</div>'
    ].join('\n');
    
    angular.module("app")
    .directive('member', ['$timeout', 
        function ($timeout) {
            return{
                restrict: "E",
                template: memberTpl,
                replace: false,
                scope: {
                    member : "=",
                    options: "=?"                  
                },
                controller: ["$scope", function($scope){
                    $scope.onSelect = function(m){
                        if($scope.options.onSelect){
                            $scope.options.onSelect(m);
                        }
                    }
                    $scope.onEdit = function(m){
                        if($scope.options.onEdit){
                            $scope.options.onEdit(m);
                        }
                    }
                    $scope.onRemove = function(m){
                        if($scope.options.onRemove){
                            $scope.options.onRemove(m);
                        }
                    }
                }]
            }
        }
    ]);
})();