
(function (){
    angular.module("app")
    .controller("assetEditController",assetEditController);
    
    assetEditController.$inject = ["$scope", "$rootScope", "$log", "$q", "$timeout",  "$state", "$stateParams", "dataService", "config","authService", "toaster", "Upload"];
    
    function assetEditController($scope, $rootScope,  $log, $q,$timeout, $state, $stateParams, dataService, 
            config, authService, toaster, Upload){
        
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
        
        function showSimpleToast (message, type) {
            toaster.pop({
                type: type || 'info',
                title: '',
                body: message,
                showCloseButton: true
            });
        };
        
        var preInit = function(){
            var assetPromise = getAsset($scope.assetId);
            var typePromise = getTypes();
            var membersPromise = _getUsers();
            
            $rootScope.__busy = $q.all([
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
            $rootScope.__busy =  _saveAssetData();
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