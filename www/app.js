
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
   
//    .state("home.group", {url:"/:g", templateUrl : "/modules/groups/group.html"})
//    .state("home.group.board", {url:"/board", templateUrl : "/modules/groups/group.board.html"})
//    .state("home.group.new", {url:"/detail", templateUrl : "/modules/groups/group.detail.html"})
//    .state("home.group.detail", {url:"/detail", templateUrl : "/modules/groups/group.detail.html"})
//    .state("home.group.analytics", {url:"/analytics", templateUrl : "/modules/groups/group.analytics.html"})
   
//    .state("home.asset", {url:"/:g/asset?p&t&a", templateUrl : "/modules/assets/asset.edit.html"})
      
      
      
    ;
      
 }]);
 //Initialize state provider here.
 app.run(['$state', function ($state) {
   //hook the httpintercepter here so that it will add the token in each request
   //$httpProvider.interceptors.push('httpInterceptor');
       
 }]);
 

