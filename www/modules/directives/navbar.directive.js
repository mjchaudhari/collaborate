(function (){
      this.tpl = [
        '    <nav class="navbar navbar-inverse navbar-fixed-top fixed-top sticky-top bg-primary">',
        '        <div class="navbar-header">',
        '            <a class="navbar-brand" href="">{{title}}</a>',
        '            <button class="float-left navbar-toggler" type="button" ng-click="onBackClick()"><span class="material-icons">arrow_back</span></button>',
        '            <button class="float-right navbar-toggler" type="button" ng-click="onOkClick()" ><span class="material-icons">done</span> </button>',
        '        </div>',
        '    </nav>',

    ].join('\n');
    
    angular.module("app")
    .directive('navbar', ['$timeout', 
        function ($timeout) {
            return{
                restrict: "E",
                template: tpl,
                replace: true,
                scope: {
                    title:"=?",
                    backAction : "=?",
                    okAction: "=?"
                },
                controller: ["$scope", function($scope){
                    
                    $scope.onBackClick = function(){
                        if($scope.backAction){
                            $scope.backAction();
                        }
                    }
                    $scope.onOkClick = function(item){
                        if($scope.okAction){
                            $scope.okAction();
                        }
                    }
                }]
            }
        }
    ]);
})();