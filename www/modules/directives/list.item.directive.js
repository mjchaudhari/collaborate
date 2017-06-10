(function (){
      this.listItemTpl = [
        '<div class="container-fluid  padding-0">' ,
            '<div class="row">' ,
                '<span class="col-2" ng-click="onSelect(item)">',
                    '<img ng-src="{{item[options.thumbnailProp]}}" class="thumbnail circle circle-sm" ng-class="{\'no-image\':options.picture != null}" />',
                '</span>',
                '<span class="col-7" ng-click="onSelect(item)">',
                    '<a class="" ng-click="onSelect(item)"><h6>{{item.name}}</h6></a>',
                    '<p class="">{{item.description}}</p>',
                '</span >',
                '<span class="col-3 div-right">',
                    '<i ng-if="options.select" class="material-icons" ng-class="{\'text-primary\':item.selected}" ng-click="onSelect(item)">check_circle</i>',
                    '<i ng-if="options.edit" class="material-icons" ng-click="onEdit(item)">edit</i>',
                    '<i ng-if="options.remove" class="material-icons" ng-click="onRemove(item)">remove_circle_outline</i>',
                '</div>',
            '</div>',
        '</div>'
    ].join('\n');
    
    angular.module("app")
    .directive('listItem', ['$timeout', 
        function ($timeout) {
            return{
                restrict: "E",
                template: listItemTpl,
                replace: true,
                scope: {
                    item : "=",
                    options: "=?"                  
                },
                controller: ["$scope", function($scope){
                    if($scope.options == null){
                        $scope.options = {}
                    }
                    if($scope.options.thumbnailProp == null)
                    {
                        $scope.options.defaultThumbnail = "";
                        $scope.options.thumbnailProp = "picture";
                    }
                    $scope.onSelect = function(item){
                        if($scope.options.onSelect){
                            $scope.options.onSelect(item);
                        }
                    }
                    $scope.onEdit = function(item){
                        if($scope.options.onEdit){
                            $scope.options.onEdit(item);
                        }
                    }
                    $scope.onRemove = function(item){
                        if($scope.options.onRemove){
                            $scope.options.onRemove(item);
                        }
                    }
                }]
            }
        }
    ]);
})();