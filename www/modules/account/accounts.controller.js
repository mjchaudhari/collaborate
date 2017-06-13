(function (){
    angular.module("app")
    .controller("accountController",accountController);
    
    accountController.$inject = ["$scope", "$rootScope", "$log", "$q", "$localStorage", "$state" ,"dataService", "config","authService", "toaster"];
    
    function accountController($scope, $rootScope,  $log, $q, $localStorage, $state, dataService, config, authService, toaster){
        
        //bindable mumbers
        $scope.title = "Accounts";
        
        $scope.message = "";
        $scope.loginModel = {
            userName:"",    
            password:"",
            confirmPassword:""
        }
        $scope.signIn = function(){
            $rootScope.__busy = authService.login($scope.loginModel.userName, $scope.loginModel.password)
            .then(function(d){
                $rootScope.$emit("evtLogged");
            },
            function(e){
                toaster.pop({
                    type: 'error',
                    title: '',
                    body: 'Login failed. Try again',
                    showCloseButton: true
                });
            });

        }
    } //conroller ends
})();