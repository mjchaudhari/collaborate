
/// <reference path="../typings/angularjs/angular.d.ts"/>
// Code goes here
 //module = angular.module('ezDirectives', ['ngFileUpload']);
 var app = angular.module('app', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'ui.router',
      'ngStorage','ngFileUpload','uiCropper', 'ezDirectives','angular-cache','angularMoment',
      'cgBusy', 'toaster']);
 app.constant("config",{
     appTitle:"easy collaborate",
     apiBaseUrl : "",
     themes : ['default','White-theme','light-blue','amber','cyan', 'light-green','lime','cool-blue']
  	
 })
 app.config([ "$httpProvider","$urlRouterProvider", '$stateProvider', 'CacheFactoryProvider', '$localStorageProvider',
 function($httpProvider, $urlRouterProvider, $stateProvider, CacheFactoryProvider, $localStorageProvider ){
   
   

   angular.extend(CacheFactoryProvider.defaults, { maxAge: 1 * 60 * 1000 });
   $localStorageProvider.setKeyPrefix("__cpadmin");

    
   $httpProvider.interceptors.push('httpInterceptor');
   
   $urlRouterProvider.otherwise("/");
   
   $stateProvider
   .state("landing", {url:"/", templateUrl : "/modules/landing/landing.html"  })
   .state("account", {url:"/account", templateUrl : "/modules/account/accountContainer.html", abstract:"true"})
   .state("account.login", {url:"/login", templateUrl : "/modules/account/login.html"})
   .state("account.register", {url:"/register", templateUrl : "/modules/account/register.html"})
   .state("account.registerationsuccess", {url:"/registerationsuccess", templateUrl : "/modules/account/registration.success.html"})
   .state("account.forgotpassword", {url:"/forgotpassword", templateUrl : "/modules/account/forgotpassword.html"})     
   
   //requires login
   .state("home", {url:"", templateUrl : "/modules/homeContainer.html", abstract:true})
   .state("home.dashboard", {url:"/dashboard", templateUrl : "/modules/dashboard.html"})
   .state("home.groups", {url:"/groups", templateUrl : "/modules/groups/groups.html"})
   
   .state("home.group", {url:"/:g", templateUrl : "/modules/groups/group.html"})
   .state("home.group.board", {url:"/board", templateUrl : "/modules/groups/group.board.html"})
   .state("home.group.new", {url:"/detail", templateUrl : "/modules/groups/group.detail.html"})
   .state("home.group.detail", {url:"/detail", templateUrl : "/modules/groups/group.detail.html"})
//    .state("home.group.analytics", {url:"/analytics", templateUrl : "/modules/groups/group.analytics.html"})
   
   .state("home.asset", {url:"/:g/asset?p&t&a", templateUrl : "/modules/assets/asset.edit.html"})
      
      
      
    ;
      
 }]);
 //Initialize state provider here.
 app.run(['$state', function ($state) {
   //hook the httpintercepter here so that it will add the token in each request
   //$httpProvider.interceptors.push('httpInterceptor');
       
 }]);
 



'use strict';

angular.module('app').factory('httpInterceptor', ["$rootScope", '$q', '$location', '$injector', '$localStorage','$log',
function ($rootScope, $q, $location, $injector , $localStorage, $log) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        if (config.url.search('authenticate') == -1 && config.url.search('resend')=='-1') {
                                
            config.headers = config.headers || {};

            var authData = $localStorage.__splituserat;
            if (authData) {
                
                config.headers.Authorization = 'Bearer ' + authData;
            }
        }
        return config;
    }

    // On request failure
    var _requestError= function (rejection) {
        return $q.reject(rejection);
    }

    // On response success
    var _response= function (response) {
        return response || $q.when(response);
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            if ($location.$$path.indexOf("login") <= -1  )
            {
                //$log.info('Unauthenticated...redirecting to login page.');
                //$injector.get('$state').go("account.login");
                $rootScope.$emit("onUnauthenticatedAccess");
            }
        }
        else {
            
            //$log.error('Status: ' + rejection.status + ' , Message: ' + rejection.statusText);
            //$log.debug( 'Response Error: - ' + JSON.stringify(rejection));
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.requestError = _requestError;
    authInterceptorServiceFactory.response = _response;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);
(function (){
    angular.module("app")
    .controller("indexController",indexController);
    
    indexController.$inject = ["$scope", "$rootScope","$q", "$log", "$state" ,"dataService", "config","authService"];
    
    function indexController($scope, $rootScope, $q, $log, $state, dataService, config,authService){
        $scope.initializingPromice = null;

        function init(){
            $scope.initializingPromice = authService.isAuthenticated()
            .then(function(d){
                $log.log("Initialized...")
            })
//             $scope.initializingPromice = $q.all([
//                 authService.isAuthenticated()
//             ]).then(function(d){
//                 $log.log("Initialized...")
//             })

        }
        
        $rootScope.$on("evtLogged", function(){
            $log.info("index logged in");
            if($state.params.returnUrl){

            }
            else{
                $state.go("home.groups");
            }
        })
        
        $rootScope.$on("onUnauthenticatedAccess", function(){
            $log.info("Require login");
            var returnUrl = ""
        })
        
        $scope.$back = function(){
            window.history.back();
        }
        
        init();
    }//conroller ends
})();

angular.module('app').factory('authService', ['$http', '$log','$q','config' ,'$localStorage', 'CacheFactory','dataService',
	function ($http, $log, $q, config, $localStorage, CacheFactory,dataService) {

    var authServiceFactory = {
        get isLoggedIn () {
            return _isLoggedIn;
        },
        get userDetail () {
            return _userDetail;
        },
        
        

    };
    var _isLoggedIn = false;
    var _userDetail = {
    };
	/**
    Register yourself
    */
    var _register = function( registerModel){
      var url = config.apiBaseUrl + "v1/account";
      
      return $http.post(url, registerModel);
    }
    
    var _resendPin = function( data){
      var url = config.apiBaseUrl + "v1/account/pin/resend";
      return $http.post(url, data);
    }
    var _login = function (userName, password) {
        var deferred = $q.defer();
        var model = {
            userName: userName
            , secret: password
        };
        var url = config.apiBaseUrl + "v1/account/authenticate";
        $http.post(url, model).then(
        function(d){
        	dataService.clearCache();
        	if(d.data.isError){
        		deferred.reject("Invalid Creadentials");	
				_logOut();
        		return;
        	}
            $localStorage.__splituser = d.data.data;
            $localStorage.__splituserat = d.data.data.accessToken;
            _userDetail = d.data.data;
            _isLoggedIn = true;
            deferred.resolve(d.data.data);
        },
        function (e){
            _logOut();
              deferred.reject(e);
          });
        return deferred.promise;
    };
     
    var _logOut = function () {
    	var deferred = $q.defer();
    	$q.all(
			$localStorage.__splituser = null,
			$localStorage.__splituserat=null
            
    	).then(function(){
    		dataService.clearCache();
            _isLoggedIn = false;
    		deferred.resolve();
    	});
		return deferred.promise;
    };

    var _isAuthenticated = function () {
        var url = config.apiBaseUrl + "v1/account/isAuthenticated";
        return $http.post(url).then(function(f){
            _isLoggedIn = !f.data.isError;
            if($localStorage.__splituser){
            	_userDetail = $localStorage.__splituser;
            }
        })
    };
    

    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.isAuthenticated = _isAuthenticated;
    
    
    authServiceFactory.resendPin = _resendPin;
    authServiceFactory.register = _register;
    
    function init(){
    	_isAuthenticated().then(function(){
			
	});
	
    }
    

    //init();
    return authServiceFactory;	
}])


angular.module('app').factory('dataService', 
function($http,$q, $log, config, $timeout, CacheFactory){
  if (!CacheFactory.get('dataServiceCache')) {
      
      CacheFactory.createCache('dataServiceCache', {
        deleteOnExpire: 'aggressive',
        recycleFreq: 1 * 60 * 1000
      });
    }

    var dataServiceCache = CacheFactory.get('dataServiceCache');
    var requestOpts = {cache: dataServiceCache};
    
  return {
    apiPrefix : config.apiBaseUrl,  
    clearCache:function(){
      CacheFactory.clearAll();
    },
    getUser : function( ){
      
    },
    getConfigCategories : function(name,categoryGroup){
      var querystring = [];
      if(name != null){
          querystring.push( "name=" + name);
      }
      if(categoryGroup != null){
          querystring.push( "categoryGroup=" + categoryGroup);
      }
      var q = "?" + querystring.join("&");
      
      var url = config.apiBaseUrl + "v1/config/categories" + q;
      return $http.get(url, requestOpts);
    },
    /**
    Register yourself
    */
    saveProfile : function( model){
      var url = config.apiBaseUrl + "/v1/profile";
      return $http.post(url, model);
    },
    getUsers : function(searchTerm ){
      if(searchTerm)
      {
        return $http.get(this.apiPrefix + "/v1/account/search" + "?term=" + searchTerm, requestOpts);
      }
      else
      {
        return $http.get(this.apiPrefix + "/v1/account/search", requestOpts);
      }
    },
    
    getGroups : function(){
      var defered = $q.defer();
      var url = config.apiBaseUrl + "/v1/groups?status=active";
      $http.get(url, requestOpts)
      .then(function(d){
        defered.resolve(d);
      }, function(e){
        defered.reject(e);
      });
      return defered.promise;
    },
    getGroup     : function(id){
      
      var url = config.apiBaseUrl + "/v1/groups?_id="+id;
      return $http.get(url, requestOpts);
    },
    saveGroup : function(grp){
      
      var url = config.apiBaseUrl + "/v1/group";
      return $http.post(url, grp);
    },
    getGroupMembers : function(id){
      var url = config.apiBaseUrl + "/v1/group/" + id + "/members/";
      return $http.get(url, requestOpts);
    },
    /**
    * @param data : {groupId: 1, members:"1,2,3" }
    **/
    addGroupMembers : function(data){
      
      var url = config.apiBaseUrl + "/v1/group/members";
      return $http.post(url, data);
    },
    
    /**
    * @param data : {groupId: 1, members:"1,2,3" }
    **/
    removeGroupMembers : function(data){
      
      var url = config.apiBaseUrl + "/v1/group/members/remove";
      return $http.post(url, data);
    },
    getFileTree : function(groupId){
      
      var url = config.apiBaseUrl + "/v1/group/" + groupId + "/fileTree";
      return $http.get(url, requestOpts);
    },
    /**
    * @param data : {groupId: 1, members:"1,2,3" }
    **/
    getAssets : function(filter){
      var qryString = "";

      if(filter.parentId)
      {
        if(qryString.length > 0){
          qryString+="&";
        }
        qryString+="parentId="+filter.parentId
      }
      if(filter.count)
      {
        if(qryString.length > 0){
          qryString+="&";
        }
        qryString+="count="+filter.count
      }
      if(filter.from)
      {
        if(qryString.length > 0){
          qryString+="&";
        }
        qryString+="from="+filter.from
      }

      var url = config.apiBaseUrl + "/v1/group/"+ filter.groupId +"/assets";
      if(qryString.length > 0){
        url+="?"+qryString;
      }
      return $http.get(url);
    },
    /**
    * @param data : {groupId: 1, members:"1,2,3" }
    **/
    getAssetTree : function(filter){
      var qryString = "";

      if(filter.parentId)
      {
        if(qryString.length > 0){
          qryString+="&";
        }
        qryString+="p="+filter.parentId
      }
      
      if(filter.levels)
      {
        if(qryString.length > 0){
          qryString+="&";
        }
        qryString+="levels="+filter.levels
      }
      
      if(filter.structureOnly)
      {
        if(qryString.length > 0){
          qryString+="&";
        }
        qryString+="structure_only=true"; 
      }
      
      var url = config.apiBaseUrl + "/v1/"+ filter.groupId +"/asset/hierarchy";
      if(qryString.length > 0){
        url+="?"+qryString;
      }
      return $http.get(url);
    },
    /**
    * @param data : {groupId: 1, members:"1,2,3" }
    **/
    getAsset : function(id){
      var url = config.apiBaseUrl + "/v1/asset?id="+id;
      
      return $http.get(url);
    },
    createAsset : function(data){
      var url = config.apiBaseUrl + "/v1/asset/create";
      return $http.post(url,data);
    },
    saveAsset : function(data){
      var url = config.apiBaseUrl + "/v1/asset";
      return $http.post(url,data);
    },
    saveAssetThumbnail : function(assetId, base64thumbnail){
        var url = config.apiBaseUrl + "/v1/asset/thumbnail/binary";
        return $http.post(url,{"assetId" : assetId, "base64ImgUrl" : base64thumbnail});
    },
    uploadThumbnail : function(fileName, base64Image){
        var url = config.apiBaseUrl + "/v1/thumbnail/binary";
        var data = {"fileName" : fileName, "imgUrl": base64Image};
        return $http.post(url,data)
    }
    
  };
});
/*
  Storage should store all data in main wrapper object with name cp-data.
  Ideal structure
  cp-api = {
    [key:value]
  }
  
  e.g.
  cp-api = {
      user:{FirstName: abc, 
      LastName : 'xyz', 
      AccessToken:'asdf-asd-afdgdg-', 
      dp:"asdf/asdf/asf"
      Status: "REGISTERED"
    }
  }
*/

angular.module('app').factory('storageService', 
function($q, $log, $localStorage){
  
  var createStorageIfNotExist = function(){
    if($localStorage["cp-data"] === undefined)
      {
        $localStorage["cp-data"] = {};  
      }
  }
  createStorageIfNotExist();
  return {
    appName : "cp-data",
    add : function(key, val)
    {
      createStorageIfNotExist();      
      if($localStorage["cp-data"][key] === undefined)
      {
        $localStorage["cp-data"][key] = {};  
      }
      $localStorage["cp-data"][key] = val;
    },
    
    get : function(key)
    {
      if($localStorage["cp-data"] == null){

        return null;
      }
      if($localStorage["cp-data"] && key){

        return $localStorage["cp-data"][key];
      }
      else{
        return $localStorage["cp-data"];
      }
    },    
    remove : function(key)
    {
      createStorageIfNotExist();
      if(key){
        if($localStorage["cp-data"][key] != undefined)
        {
          $localStorage["cp-data"][key] = undefined;  
        }
      } else{
        $localStorage["cp-data"] = {};
      }

    }
    
  };
});
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
            authService.login($scope.loginModel.userName, $scope.loginModel.password)
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
angular.module("app")
.controller("registerController", function($scope, $log, $state, storageService, dataService, authService){
  $scope.title = "Register";
  $scope.registerModel = {};
  $scope.blockUI = false;
  
  $scope.saveRegistration = function(){
    
    var model = {
        firstName: $scope.registerModel.fn
      , lastName: $scope.registerModel.ln
      , userName: $scope.registerModel.mobileNo
      , clientKey: $scope.registerModel.clientId
      , picture : $scope.registerModel.Thumbnail
    };
    
    authService.register(model).then(
      function(d){
        if(d.data.isError){

          return;
        }
        //toaster.pop('success', 'Registration successful', 'You will shortly recieve the authentication code via SMS.');
        var message = " Please enter your authorization code'";
        
        storageService.add('user',model);
        storageService.add('status',"REQUESTED");
        $state.go("account.registerationsuccess");
      },
      function (e){
        //$scope.addAlert(e.message,"danger");
        //toaster.pop('error', '', e.message);
      });
  }
  
});


angular.module("app")
.controller("registrationSuccessController", function($scope){
  $scope.title = "Registation success";
});


angular.module("app")
.controller("registrationSuccessController", function($scope){
  $scope.title = "Registation success";
});


angular.module("app")
.controller("registrationSuccessController", function($scope){
  $scope.title = "Registation success";
});



(function (){
    angular.module("app")
    .controller("assetEditController",assetEditController);
    
    assetEditController.$inject = ["$scope", "$rootScope", "$log", "$q", "$timeout",  "$state", "$stateParams", "dataService", "config","authService","$mdConstant","$mdToast", "Upload"];
    
    function assetEditController($scope, $rootScope,  $log, $q,$timeout, $state, $stateParams, dataService, 
            config, authService, $mdConstant, $mdToast, Upload){
        
        //bindable mumbers
        $scope.title    = "Edit Assets";
        $scope.assetId  = $stateParams.a;
        $scope.groupId  = $stateParams.g;
        $scope.parentId = $stateParams.p == undefined ? $stateParams.g : $stateParams.p;
        $scope.assetType = $stateParams.t;
        $scope.groupMembers = [];
        $scope.types = [];
        $scope.tempData = {
                "owners":[],
                "accessibility":[],
                "taskUpdate" : ""
        };
        $scope.errorMessage=[];
        $scope.file=null;
        $scope.promises = {};

        $scope.taskStatuses = [
            "Pending",
            "In Progress",
            "Completed",
            "Closed"
        ]
        
        $scope.asset = {
            "_id": $scope.assetId,
            "assetType" : $scope.assetType,
            "assetTypeId" : $scope.assetType != null ? $scope.assetType : null,
            "name":"",
            "description":"",
            "thumbnail":"",
            "urls":"",
            "groupAssociations": [$scope.groupId],
            "parentId": $scope.parentId,
            "allowLike":true,
            "allowComment":true,
            "publish": true,
            "activateOn":new Date(),
            "assetCategory":null,
            "accessibility" : []
        };
        
        $scope.uploadedFiles=null;
        
        function showSimpleToast (message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)
                .position('top')
                .hideDelay(3000)
                .action('OK')
            );
        };
        
        var preInit = function(){
            var assetPromise = getAsset($scope.assetId);
            var typePromise = getTypes();
            var membersPromise = _getUsers();
            
            $scope.promises.loading = $q.all([
                assetPromise, typePromise, membersPromise
            ])
            .then(function(){
                switch ($scope.asset.assetTypeId) {
                        case "type_task":
                            if($scope.asset.task == null){
                                $scope.asset.task = {}
                            }
                            if($scope.asset.task.updates == null){
                                $scope.asset.task.updates = [];
                            }

                            if($scope.asset.task.owners == null){
                                $scope.asset.task.owners = [];
                            }        
                            break;
                        case "type_calendar":
                            if($scope.asset.calendar == null){
                                $scope.asset.calendar = {}
                            }
                            break;
                        default:
                            break;
                }
                init();
            });
        }
    
        var init = function(){
            $log.debug("Init executed")
            var assetType = _.find($scope.types,{ "_id": $scope.assetType});
            $scope.asset.assetType = assetType;
            
        };
        
        function getAsset (id){
            var defer = $q.defer();
            
            if(id == null || id== 0){
                $timeout(function(){
                    $log.debug("getAsset resolved");
                    defer.resolve();
                },100)
            }
            else{
                $scope.promises.assetList = dataService.getAsset(id)
                .then(function(d){
                    $scope.asset = angular.copy(d.data.data);
                    $scope.asset.activateOn = new Date(d.data.data.activateOn);
                    if(d.data.data.expireOn){
                        $scope.asset.expireOn = new Date(d.data.data.expireOn);
                        $scope.asset.neverExpire = false;
                    }
                    else{
                        $scope.asset.neverExpire = true;
                    }
                    if($scope.asset.accessibility == null){
                        $scope.asset.accessibility= []
                    }

                    $scope.asset.accessibility.forEach(function(m){
                        m._name = m.firstName + ' ' + m.lastName;
                    })
                    
                    if($scope.asset.Files != null && $scope.asset.files.length >= 0){
                            var thumbnails = _.pluck($scope.asset.files, "thumbnailLink")
                            $scope.asset._thumbnails = thumbnails;
                    }else{
                            //$scope.asset._thumbnails = [$scope.asset.Thumbnail];
                    }
                
                    angular.copy($scope.asset.accessibility, $scope.tempData.accessibility); 
                    
                    switch ($scope.asset.assetTypeId) {
                        case "type_task":
                            if($scope.asset.task == null){
                                $scope.asset.task = {}
                            }
                            if($scope.asset.task.updates == null){
                                $scope.asset.task.updates = [];
                            }
                            if($scope.asset.task.owners == null){
                                $scope.asset.task.owners = [];
                            }
                            
                            $scope.asset.task.owners.forEach(function(m){
                                m._name = m.firstName + ' ' + m.lastName;
                            })
                            angular.copy($scope.asset.task.owners, $scope.tempData.owners);
                            
                            break;
                        case "type_calendar":
                            if($scope.asset.calendar == null){
                                $scope.asset.calendar = {}
                            }
                            break;
                    case "type_collection":
                            
                            break;
                        default:
                            break;
                    }

                     
                    defer.resolve($scope.asset);    
                },
                function(e){
                    defer.reject();
                });    
            }
            return defer.promise;
        }
        function getTypes (){
            var defer = $q.defer();
            $scope.promises.types = dataService.getConfigCategories(null,"assetType")
            .then(function(d){
                $scope.types = angular.copy(d.data.data);
                $log.debug("getCategories resolved");
                defer.resolve(d.data.data);    
            },
            function(e){
                defer.reject();
            });    
            return defer.promise;
        }
        
        function _getUsers(){
            
            return dataService.getGroupMembers($scope.groupId)
            .then(function(d){   
                var users = [];
                d.data.data.forEach(function(m){
                    m._name = m.firstName + ' ' + m.lastName;
                })

                angular.copy(d.data.data, $scope.groupMembers);
                //defer.resolve($scope.groupMembers);
            });
            
        }
        $scope.querySearchWorking = function (term){
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
                    var exist = _.findWhere($scope.asset.accessibility,{"_id":u._id});
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
        $scope.querySearch = function(term){
            $scope.searchResult=[];
            if(term && term.length > 0){

            }
            var defer = $q.defer();
            $timeout(function(){
                var regex = new RegExp(term,"i");
                var members = _.filter($scope.groupMembers,function(m){
                    return m._name.match(regex);
                });
                members.forEach(function(u){
                    u._name = u.firstName + ' ' + u.lastName;
                    //check if this user is alredy added
                    var exist = _.findWhere($scope.asset.accessibility,{"_id":u._id});
                    if(exist){
                        u.__added = true;
                    }
                });
                defer.resolve(members)
            },100)
                
            return defer.promise;
        }
        $scope.cancel = function() {
            $scope.$back();
        };
        $scope.toggleComentSetting = function(){
            $scope.asset.allowComment = !$scope.asset.allowComment; 
        }
        $scope.toggleLikeSetting = function(){
            $scope.asset.allowLike = !$scope.asset.allowLike; 
        }
        $scope.saveAsset = function(){

            // if($scope.file){
            //     _uploadAssetFile().then(function (f) {
            //         //get file names and add to the asset
            //         $scope.asset.Urls = f.fileName;
            //         return _saveAssetData()
            //     });
            // }
            // else{
            //     return _saveAssetData()
            // }
            return _saveAssetData();
        }
        
        function _saveAssetData(){
            if($scope.asset.parentId == undefined ){
                $scope.asset.parentId = $scope.parentId;
            } 
            
            if($scope.asset.expireOn && isNaN($scope.asset.expireOn.getDate())){
                $scope.asset.expireOn = new Date(9999,12,31)
            }
            
            //get owners and accessibility data
            if($scope.tempData.accessibility){
                $scope.asset.accessibility = _.pluck($scope.tempData.accessibility, "_id");        
            }

            if($scope.asset.task && $scope.tempData.owners){
                $scope.asset.task.owners = _.pluck($scope.tempData.owners, "_id");        
            }
            

            var defer = $q.defer();
            // upload on file select or drop
            Upload.upload({
                url: config.apiBaseUrl + "/v1/asset",
                data: $scope.asset
            }).then(function (d) {
                $scope.asset = d.data.data;
                if($scope.asset.accessibility == null){
                    $scope.asset.accessibility =[];
                }
                if(d.data.data.ActivateOn){
                    $scope.asset.ActivateOn = new Date(d.data.data.ActivateOn);
                }
                
                if(d.data.data.expireOn){
                    $scope.asset.expireOn = new Date(d.data.data.expireOn);
                    $scope.asset.neverExpire = false;
                }
                else{
                    $scope.asset.neverExpire = true;
                }
                $scope.asset.accessibility.forEach(function(m){
                    m._name = m.firstName + ' ' + m.lastName;
                })
                defer.resolve(d.data.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
                defer.resolve(resp);
            }, function (evt) {

                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + $scope.progressPercentage + '% ' );
                console.log(evt);
            });
            return defer.promise;
        }
        function _uploadAssetFile (){
            var defer = $q.defer();
            // upload on file select or drop
            Upload.upload({
                url: config.apiBaseUrl + "/v1/asset",
                data: {file: $scope.file}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                defer.resolve(resp.data.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
                defer.resolve(resp);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
            return defer.promise;
        };
        
        function _saveAssetFiles(){
            var defer = $q.defer();
            if($scope.asset.files || $scope.asset.files && $scope.asset.files.length  > 0)
            {
                $timeout(function(){
                    defer.resolve();
                },500);
            }
            return defer.promise;
        }
        
        function _validateAssetData(){
            if($scope.asset.Name == ""){
                
            }
            if($scope.asset.Description == ""){
                
            }
        }
        var showToast = function(msg,type) {
            if(type && type=="error"){
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(msg)
                    .position('left')
                    .hideDelay(3000)
                );    
            }
            else{
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(msg)
                    .position('left')
                    .hideDelay(3000)
                );
            }
            
        };
        $scope.addUpdate = function(u){
                $scope.asset.task.updates.push({
                    Update : $scope.tempData.taskUpdate,
                    UpdatedOn : new Date(),
                    UpdatedBy : authService.userDetail._id
                });

                $scope.tempData.taskUpdate = "";
        }
        preInit();
    }//conroller ends
})();


(function (){
    angular.module("app")
    .controller("assetLstController",assetLstController);
    
    assetLstController.$inject = ["$scope", "$rootScope", "$log", "$q", "$localStorage", "$state", "$stateParams" ,"dataService", "config","authService","$mdConstant","$mdToast", "$mdDialog", "$mdBottomSheet"];
    
    function assetLstController($scope, $rootScope,  $log, $q, $localStorage, $state, $stateParams, dataService, config, authService, $mdConstant, $mdToast, $mdDialog, $mdBottomSheet ){
        
        //bindable mumbers
        $scope.title = "Assets Crtl";
        $scope.groupId = $stateParams.g;
        $scope.parentId = $stateParams.p;
        $scope.breadcrumb = [];
        $scope.promices = {};
        $scope.parent = null;
        $scope.assets = [];
        
        $scope.hierarchy = null;
        $scope.selectedNode = null;
        $scope.nodeParentTrail = null;

        $scope.searchText ="";
        $scope.searchResult = [];
        
        $scope.isAllChecked = false;
        $scope.isIndeterminate = false;
        $scope.filter = {
            groupId:$scope.groupId,
            parentId:$scope.parentId,
            count:null,
            from:null
        };

        $scope.hierarchyTreeOptions = {
            idAttrib        : "_id",
            nameAttrib      : "Name",
            childrenAttrib  : "Children"
        };

        function showSimpleToast (message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)
                .position('top')
                .hideDelay(3000)
                .action('OK')
            );
        };
       
        $scope.selectAllChecked = function() {
            var selected = _.where($scope.assets,{"__isSelected":true});
            $scope.toggleAll()
            return selected.length === $scope.assets.length;
        };
        $scope.toggle = function (asset) {
            if(asset.__isSelected){
                asset.__isSelected = !asset.__isSelected;    
            }
            else{
                asset.__isSelected = true;
            }
            determineSelectAll()
        };

        $scope.toggleAll = function() {
            var status = $scope.isAllChecked;
            _.forEach($scope.assets, function(a){
                a.__isSelected = status;
            });        
        };
        
        
        $scope.edit = function(a,assetType){
            var assetId = a == null ? undefined : a._id;
            var assetType = a == null ? assetType : a.AssetTypeId;
            var groupId = a == null ? $scope.groupId : a.GroupId;
            var parentId = a == null ? $scope.parentId :a.ParentId;
 
            $state.transitionTo("home.group.asset",{"g":$scope.groupId,"p" : $scope.parentId,"type":assetType,"a":assetId, });
            
        }
        $scope.qedit = function(a,assetType){
                var assetId = a == null ? undefined : a._id;
            var params = {
                    assetId: assetId,
                    groupId : a.GroupId,
                    parentId:a.ParentId,
                    assetType : assetType
                };
            $mdDialog.show({
                templateUrl: './views/assets/asset.edit.html',
                controller: 'assetEditController',
                locals: {params},
                clickOutsideToClose:true,
                fullscreen : true
            })
            .then(function(result) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Saved!')
                    .position('top right')
                    .hideDelay(1500)
                );
                //Update the folder in tree
                var asset = result; //result.data.data;
                if(asset.AssetTypeId == "type_collection"){
                    getAssetHierarchy();
                }
                init();
                $state.transitionTo("home.group.assets",{"g":$scope.groupId, "p" : $scope.parentId}, {"notify":false});
                
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        }

        $scope.onAssetSelected = function(node){
            
            $scope.selectedAsset = node;
            $scope.parentId = node._id;
            $scope.filter.parentId = node._id;
            init();

            $state.transitionTo("home.group.assets",{"g":$scope.groupId, "p" : $scope.parentId}, {"notify":false});
        }
        
        $scope.onRowSelected = function (asset){
            
            $log.debug("dbl clicked!" + asset._id);
            
            if(asset.AssetTypeId == "type_collection"){
                //open folder
                $scope.parentId = asset._id;
                $scope.filter.parentId = asset._id;
                init();
                
                $state.transitionTo("home.group.assets",{"g":$scope.groupId, "p" : $scope.parentId}, {"notify":false});
            }
            else{
                //openInviewer(asset._id);
                $log.debug('open in viewer');
            }
        }

        
        function determineSelectAll(){
            var selected = _.where($scope.assets,{"__isSelected":true});
            $scope.isAllChecked = selected.length === $scope.assets.length;
            if(selected.length == 0 ||
                selected.length === $scope.assets.length){
                $scope.isIndeterminate = false;    
            }
            else{
                $scope.isIndeterminate = selected.length != $scope.assets.length;    
            }

        }
        var preInit = function(){
               var tasks = [];
            tasks.push(getAssetHierarchy());
            $q.all([
                tasks
            ])
            .then(function(){
                init();      
                
            });
            
        }
    
        var init = function(){
            var tasks = [];
            tasks.push(getAssets());  
            
            $q.all([
                tasks
            ])
            .then(function(){
                  //set selectedNode
                  
            });
        };
        function getAssets (){
            $scope.filter.structureOnly = false;
            $scope.promices.assetList = dataService.getAssetTree($scope.filter)
            .then(function(d){
                $scope.parent = d.data.data;
                $scope.breadcrumb = [d.data.data];
                setParent($scope.parentId);
                angular.copy(d.data.data.Children, $scope.assets);                
            },
            function(e){
            });
            return $scope.promices.assetList;
        }

        function getAssetHierarchy(){
            
            var filter = {
                parentId : $scope.filter.groupId,
                groupId : $scope.filter.groupId,
                structureOnly : true
            }
            $scope.promices.hierarchy = dataService.getAssetTree(filter)
            .then(function(d){
                $scope.parent = d.data.data;
                $scope.breadcrumb = [d.data.data];
                $scope.hierarchy = angular.copy(d.data.data);   
                
                //setTree($scope.parent._id);
            },
            function(e){

            });
            return $scope.promices.hierarchy;
        }

        function setParent(parentId){
            //Select node from tree t highlight
            _hlp.treeWalker($scope.hierarchy, function(n){
                if(n && n ._id == parentId){
                    $scope.selectedNode = n;
                }
            });
        }

        preInit();


    }//conroller ends
})();


(function (){
    angular.module("app")
    .controller("fileLstController",fileLstController);
    
    fileLstController.$inject = ["$scope", "$rootScope", "$log", "$q", "$localStorage", "$state", "$stateParams" ,"dataService", "config","authService","$mdConstant","$mdToast", "$mdDialog", "$mdBottomSheet"];
    
    function fileLstController($scope, $rootScope,  $log, $q, $localStorage, $state, $stateParams, dataService, config, authService, $mdConstant, $mdToast, $mdDialog, $mdBottomSheet ){
        
        //bindable mumbers
        $scope.title = "Uploaded Files";
        $scope.groupId = $stateParams.g;
        $scope.parentId = $stateParams.p;
        $scope.breadcrumb = [];
        $scope.promices = {};
        
        $scope.hierarchy = null;
        $scope.selectedNode = null;
        
        $scope.searchText ="";
        $scope.searchResult = [];
        
        $scope.hierarchyTreeOptions = {
            idAttrib        : "id",
            nameAttrib      : "name",
            childrenAttrib  : "children"
        };

        function showSimpleToast (message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)
                .position('top')
                .hideDelay(3000)
                .action('OK')
            );
        };
       
        
        $scope.onAssetSelected = function (asset){
            $log.debugf(asset.Name);
            
        }
        var preInit = function(){
               var tasks = [];
            tasks.push(getAssetHierarchy());
            $q.all([
                tasks
            ])
            .then(function(){
                init();       
            });
        }
    
        var init = function(){
            var tasks = [];
            tasks.push(getFiles());  
            
            $q.all([
                tasks
            ])
            .then(function(){
                  //set selectedNode
                  
            });
        };
        function getFiles (){
            
            $scope.promices.tree = dataService.getFileTree($scope.groupId)
            .then(function(d){
                $scope.parent = d.data.data;
                $scope.breadcrumb = [d.data.data];
                setParent($scope.parentId);
                angular.copy(d.data.data.Children, $scope.assets);                
            },
            function(e){
            });
            return $scope.promices.tree;
        }

        function getAssetHierarchy(){
            $scope.promices.hierarchy = dataService.getFileTree($scope.groupId)
            .then(function(d){
                $scope.breadcrumb = [d.data.data];
                $scope.hierarchy = angular.copy(d.data.data);   
                $scope.selectedNode = $scope.hierarchy; 
            },
            function(e){

            });
            return $scope.promices.hierarchy;
        }

        function setParent(parentId){
            //Select node from tree t highlight
            _hlp.treeWalker($scope.hierarchy, function(n){
                if(n && n ._id == parentId){
                    $scope.selectedNode = n;
                }
            });
        }

        preInit();


    }//conroller ends
})();

(function (){
    angular.module("app")
    .controller("formEditController",formEditController);
    
    formEditController.$inject = ["$scope", "$rootScope", "$log", "$q", "$timeout",  "$state", "$stateParams", "dataService", "config","authService","$mdConstant","$mdToast", "Upload","$mdBottomSheet","params"];
    
    function formEditController($scope, $rootScope,  $log, $q,$timeout, $state, $stateParams, dataService, config, authService, $mdConstant, $mdToast, Upload,$mdBottomSheet,params ){
        
        //bindable mumbers
        $scope.title    = "Edit Assets";
        if(params == null){
            pditms = {};
        }
        $scope.assetId  = paramsEditetId;
        $scope.groupId  = params.groupId;
        $scope.parentId = params.parentId;
        $scope.categories = [];
        
        $scope.errorMessage=[];
        $scope.file=null;
        $scope.promises = {};
        $scope.asset = {
            "_id":$scope.assetId,
            //"CategoryId" : $scope.selectedCategory._id,
            "Name":"",
            "Description":"",
            "Thumbnail":"",
            "Urls":"",
            "GroupId":$scope.groupId,
            "ParentId":$scope.parentId,
            "AllowLike":true,
            "AllowComment":true,
            "Publish":true,
            "ActivateOn":new Date(),
            "AssetCategory":null
        }
        
        $scope.uploadedFiles=null;
        
        function showSimpleToast (message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)
                .position('top')
                .hideDelay(3000)
                .action('OK')
            );
        };
        
        var preInit = function(){
            
            var tasks = [];
            var assetPromise = getAsset($scope.assetId);
            var categoryPromise = getCategories();
            
            $q.all([
                assetPromise,categoryPromise
            ])
            .then(function(){
                init()
            });
        }
    
        var init = function(){
            $log.debug("Init executed")
        };
        
        function getAsset (id){
            var defer = $q.defer();
            
            if(id == null || id== 0){
                $timeout(function(){
                    $log.debug("getAsset resolved");
                    defer.resolve();
                },100)
            }
            else{
                $scope.promises.assetList = dataService.getAsset(id)
                .then(function(d){
                    $scope.asset = angular.copy(d.data.data);
                    $scope.asset.ActivateOn = new Date(d.data.data.ActivateOn);
                    if(d.data.data.ExpireOn){
                        $scope.asset.ExpireOn = new Date(d.data.data.ExpireOn);
                        $scope.asset.neverExpire = false;
                    }
                    else{
                        $scope.asset.neverExpire = true;
                    }
                    defer.resolve(d.data.data);    
                },
                function(e){
                    defer.reject();
                });    
            }
            return defer.promise;
        }
        
        function getCategories (){
            var defer = $q.defer();
            $scope.promises.categories = dataService.getCategories()
            .then(function(d){
                $scope.categories = angular.copy(d.data.data);
                $log.debug("getategories resolved");
                defer.resolve(d.data.data);    
            },
            function(e){
                defer.reject();
            });    
            return defer.promise;
        }
        
        $scope.cancel = function() {
            $mdBottomSheet.hide();
        };
        $scope.toggleComentSetting = function(){
            $scope.asset.AllowComment = !$scope.asset.AllowComment; 
        }
        $scope.toggleLikeSetting = function(){
            $scope.asset.AllowLike = !$scope.asset.AllowLike; 
        }
        $scope.saveAsset = function(){
            if($scope.asset._id == null){
                _createAsset().then(
                    function (d) {
                        if($scope.file){
                            _uploadAssetFile().then(function (f) {
                                //get file names and add to the asset
                                $scope.asset.Urls = f.fileName;
                                return _saveAssetData()
                            });
                        }
                    }
                );
            }
            else{
                if($scope.file){
                    _uploadAssetFile().then(function (f) {
                        //get file names and add to the asset
                        $scope.asset.Urls = f.fileName;
                        return _saveAssetData()
                    });
                }
                else{
                    return _saveAssetData()
                }
            }
            
            
        }
        function _createAsset(){
            return dataService.createAsset($scope.asset).then(
                function(d){
                    $scope.asset._id = d.data.data._id;       
                },
                function(e){
                    
                }
            )
        }
        function _saveAssetData(){
            return dataService.saveAsset($scope.asset).then(
                function(d){
                    $mdBottomSheet.hide(d);
                },
                function(e){
                    showToast(e.message);
                }
            )
        }
        function _uploadAssetFile (){
            var defer = $q.defer();
            // upload on file select or drop
            Upload.upload({
                url: 'v1/file',
                data: {file: $scope.file}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                defer.resolve(resp.data.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
                defer.resolve(resp);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
            return defer.promise;
        };
        
        function _saveAssetFiles(){
            var defer = $q.defer();
            if($scope.asset.files || $scope.asset.files && $scope.asset.files.length  > 0)
            {
                $timeout(function(){
                    defer.resolve();
                },500);
            }
            return defer.promise;
        }
        
        function _validateAssetData(){
            if($scope.asset.Name == ""){
                
            }
            if($scope.asset.Description == ""){
                
            }
        }
        var showToast = function(msg,type) {
            if(type && type=="error"){
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(msg)
                    .position('left')
                    .hideDelay(3000)
                );    
            }
            else{
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(msg)
                    .position('left')
                    .hideDelay(3000)
                );
            }
            
        };
        
        preInit();
    }//conroller ends
})();
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

(function (){
    angular.module("app")
    .controller("groupController",groupController);
    
    groupController.$inject = ["$scope", "$rootScope", "$log", "$q", "$localStorage", "$state", "$stateParams" ,"dataService", "config","authService"];
    
    function groupController($scope, $rootScope,  $log, $q, $localStorage, $state, $stateParams, dataService, config, authService){
        
        //bindable mumbers
        $scope.title = "Groups";
        $scope.groupsList = [];
        $scope.promices = {};
        $scope._id = $stateParams.g;
        $scope.view = $stateParams.v;
        $scope.selectedTab = 'analytics';
        $scope.group = null;

        
        function getGroupDetail (){
            $scope.promices.groupDetail = dataService.getGroup($scope._id)
            .then(function(d){
                $scope.group = angular.copy(d.data.data[0]);
            },
            function(e){

            });
            return $scope.promices.groupPromice;
        }

        var preInit = function(){
            var tasks = [];
            tasks.push(getGroupDetail());
            $q.all([
                tasks
            ])
            .then(function(){
                init()
            });
        }

        var init = function(){

        };
        
        $scope.tabSelected = function(tab){
            //set the current tab to route
            
        }

        function setView(){
            switch ($scope.view){
                case 'analytics' : {
                    $scope.selectedTab = 'analytics';
                    break;
                }
                case 'details' : {
                    $scope.selectedTab = 'details';
                    break;
                }
                case 'assets' : {
                    $scope.selectedTab = 'assets';
                    break;
                }
                case 'settings' : {
                    $scope.selectedTab = 'settings';
                    break;
                }
            }
        }

        preInit();

    }//conroller ends
})();

(function (){
    angular.module("app")
    .controller("groupBoardController",groupBoardController);
    
    groupBoardController.$inject = ["$scope", "$rootScope", "$log", "$q", "$localStorage", "$state", "$stateParams" ,"dataService", "config","authService"];
    
    function groupBoardController($scope, $rootScope,  $log, $q, $localStorage, $state, $stateParams, dataService, config, authService ){
        
        //bindable mumbers
        $scope.title = "";
        $scope.promices = {};
        $scope._id = $stateParams.g;
        $scope.group = null;
        $scope.groupCopy = null;
        $scope.selectedMembers = null;
        $scope.view = $stateParams.v;
        $scope.searchText ="";
        $scope.searchResult = [];
        
        function showSimpleToast (message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)
                .position('bottom')
                .hideDelay(3000)
                .action('OK')
            );
        };

        var preInit = function(){
            var tasks = [];
            tasks.push(getGroupDetail());
            tasks.push(getTopics());
            $q.all([
                tasks
            ])
            .then(function(){
                init()
            });
        }

        var init = function(){

        };
        
        $scope.details = function(){
            $state.go("home.group.detail",{"g": $scope.group._id});
            $scope.mainTitle = $scope.group.name;
        }

        function getGroupDetail (){
            $scope.promices.groupBoard = dataService.getGroup($scope._id)
            .then(function(d){
                $scope.group = angular.copy(d.data.data[0]);
                $scope.title = $scope.group.name;
                if($scope.group.members){
                    $scope.group.members.forEach(function(m){
                        m._name = m.firstName + ' ' + m.lastName;
                    })
                }
                $scope.groupCopy = angular.copy($scope.group);
            },
            function(e){

            });
            return $scope.promices.groupPromice;
        }
        function getTopics (){
            $scope.promices.groupTopics = dataService.getAssets({groupId:$scope._id})
            .then(function(d){
                $scope.topics = angular.copy(d.data.data);
            },
            function(e){

            });
            return $scope.promices.groupPromice;
        }
        
        $scope.newTopic = function(){
            $state.go("home.asset", { "g": $scope._id, "t": "type_collection" });
        }
        preInit();


    }//conroller ends
})();

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
        $scope.listItemOptions = {select:false, onSelect : openBoard, edit:true, onEdit : editGroup, thumbnailProp : 'thumbnail'};
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
            $scope.promises.init = $q.all([
                tasks
            ])
            .then(function(){
                init();
            });
        }

        var init = function(){

        };
        
        $scope.createGroup = function(){
            $state.go("home.group.new",{"g": "new"});
        }
        
        function editGroup(g){
            $state.go("home.group.detail",{"g": g._id});
        }

        function openBoard(g){
            $state.go("home.group.board",{"g": g._id});
            $scope.mainTitle = g.name;
        }
        
        preInit();

    }//conroller ends
})();
(function (){
    angular.module("app")
    .controller("landingController",landingController);
    
    landingController.$inject = ["$scope", "$log", "$state" ,"dataService", "config","authService"];
    
    function landingController($scope, $log, $state, dataService, config, authService){
        $scope.user = null
        $scope.startApp = function(){
            if(authService.isLoggedIn){
                $state.go("home.dashboard");
            }
            else{
                $state.go("account.login");
            }
        }
        function init(){
            if(authService.isLoggedIn){
                $scope.user = authService.userDetail
                    
            }
        }

        init();
    }//conroller ends
})();

(function (){
    angular.module("app")
    .controller("dashoardController",dashoardController);
    
    dashoardController.$inject = ["$scope", "$rootScope", "$log", "$q", "$localStorage", "$state" ,"dataService", "config","authService"];
    
    function dashoardController($scope, $rootScope,  $log, $q, $localStorage, $state, dataService, config, authService){
        
        //bindable mumbers
        $scope.title = "Dashboard";
        
        
    }//conroller ends
})();


(function (){
    angular.module("app")
    .controller("homeController",homeController);
    
    homeController.$inject = ["$scope", "$rootScope", "$log", "$window", "$q", "$localStorage", "toaster", "$state", "$stateParams", "dataService", 
        "config", "authService", "$uibModal"];
    
    function homeController($scope, $rootScope, $log, $window, $q, $localStorage, toaster, $state, $stateParams, dataService, 
        config, authService, $uibModal){
        
        //bindable mumbers
        $scope.mainTitle  = "Collaborate";
        $scope.nextTheme = _nextTheme
        $scope.themes = config.themes,
        $scope.theme = $localStorage.theme;
        $scope.user = $localStorage.__splituser;
        //$scope.fabOpen = false;
        $scope.groupsList = [];
        
        $scope.nodeParentTrail=[];
        $scope.selectedMenu = null;
        $scope.menu = null;
        
        if($scope.theme == undefined){
            $scope.theme = 0;
        }
        
        
        $scope.logoff = function(ev){
            //TODO; Ask for confirmation here
            
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Log off')
                  .textContent('Unsaved data will be lost. Are you sure you want to logoff?')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Yes, Log off.')
                  .cancel('No, Do not logoff');

            $mdDialog.show(confirm)
            .then(function() {
                authService.logOut();
                $state.go("landing")
                }, 
                function() {
                    $scope.status = 'You decided to keep your debt.';
                });
           
        }
        $scope.toggleLeft = function(){
            return $mdSidenav('left')
            .toggle();
        }

        function _toggleLeft(){
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Log off')
                  .textContent('Unsaved data will be lost. Are you sure you want to logoff?')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Yes, Log off.')
                  .cancel('No, Do not logoff');

            $mdDialog.show(confirm)
            .then(function() {
                authService.logOut();
                $state.go("landing")
                }, 
                function() {
                    $scope.status = 'You decided to keep your debt.';
                });
           
        }
        $scope.toggleSideBar = function(id){
            return $mdSidenav(id)
            .toggle();
        }

        $scope.historyBack = function(){
            $window.history.back();
        }
        
        //Set next theme
        function _nextTheme (){
            if(($scope.theme + 1) >= config.themes.length){
                $scope.theme = 0;
            }
            else{
                $scope.theme++;
            }
            
            //storageService.add("theme",$scope.theme) ;	
            
            
        }

        function getGroups (){
            var p = dataService.getGroups()
            .then(function(d){
                angular.copy(d.data.data, $scope.groupsList);
                var sectionHeader = {
                        id: 'Groups',
                        name: 'Groups',
                        children: [],
                        icon:'group'
                }

                //build menu sections
                $scope.groupsList.forEach(function(g){
                   
                   var section = {
                       id:g._id,
                       name: g.name,
                       icon:'people_outline',
                       children:[
                            {
                                id:g._id + 1,
                                name: 'Assets',
                                icon:'list',
                                parentId:g._id
                            },
                       ] 
                   };
                   sectionHeader.children.push(section);
                });
                
                $scope.menu = sectionHeader;
            },
            function(e){

            });
            return p;
        }
        $scope.onSelect = function(node){
            $log.debug(node);
            $scope.selectedMenu = node;

            switch (node.Name) {
                case "Groups":{
                    $state.go("home.groups", {"g":node.parentId});
                    break;
                }
                case "Assets":{
                    $state.go("home.group.assets", {"g":node.parentId, "p":node.parentId});
                    break;
                }
            }            
        }
        
        var preInit = function(){
            var tasks = [];
            tasks.push(getGroups());
            var initPromice = $q.all(tasks)
            .then(function(){
                init()
            });
            $rootScope.__busy = initPromice;
        }
        
        var init = function(){

        };

        preInit();

    }//conroller ends
})();