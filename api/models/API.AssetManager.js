var APIException = require("./API.Exception.js");
var apiException = new APIException();
var Asset = require("./API.Asset.js");
var Collection = require("./API.Asset.Collection.js");
var mongo = require("./../db.connection.js");
var _ = require("underscore-node");
//var Task = require("./API.Asset.Task.js");
var q =require("q");
var API = API || {} // Namespace

API.AssetManager = function(){

};
    
API.AssetManager.prototype.buildAsset = function(data){
    var defered = q.defer();
    var asset = null;
    switch (data.assetTypeId) {
        case "type_collection":
        {
            asset = new Collection(data);
                break;
        }
    
        default:
            break;
    }
    //If there is not 
    if(data.parentId == "" || data.parentId == null){
        data.parentId = data.groupId;
    }

    determinePath([data.parentId])
    .then(function(paths){
        asset.path = paths[0];
        defered.resolve(asset);
    }, function() {
        defered.reject(apiException.Exception());
    });
    
    return defered.promise;
}

    /**
 * Get asset by id
 * @param {string} assetId - 
 * @return {object} asset - matching asset
 */
API.AssetManager.prototype.getAssetById = function(assetId){
    var self = this;
    var defer = q.defer();
    mongo.connect()
    .then(function(db){
        db.collection("assets").findOne({"_id":assetId}, function(err,data){
            db.close();
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(data);
            }
        });
    });

    return defer.promise;
}

/**
 * get assets
 * @param {object} options
 * @param {string} options.profileId 
 * @param {string} options.groupId
 * @param {string} options.parentId optional if the parent id is not provided then fetches all assets in group 
 * @param {string} options.levels optios defaults to 1
 * @param {string} options.structureOnly option defaults to true
 */
API.AssetManager.prototype.getAssets = function(options){
    var defer = q.defer();
    options.levels = options.levels || 1,
    options.structureOnly = options.structureOnly ? true : false 
    
    if(options.from == null ){
        options.from = new Date("01-01-01");
    }
    
    mongo.connect( ).then(function(db){
        
        //find the groups of this user
        var filter = { "_id": options.groupId,  "members": { $in: [options.profileId] } }
        db.collection("groups").find(filter).toArray(function(err, data){
            if(err){
                db.close();  
                defer.reject(apiException.serverError("", "AssetManager", err));
                return;
            }
            if(data.length <= 0 ){
                db.close();
                //This user has no access to the assets of this group.
                defer.reject(defer.reject(apiException.unauthorized()));
                return;
            }
            
            var parentId = options.parentId;
            if(options.parentId == null){
                parentId = options.groupId;
            }
            //{ "groupAssociations": { $in: ["HyDE4G-Ye"] } }
            //{ "groupAssociations": {"$in":["H1yoqKmql"] } }
            var filter = {
                "groupAssociations": {"$in" : [options.groupId]},
                //"auditTrail.updatedOn" : {"$gte": options.from},
            }
            if(options.structureOnly){
                filter.assetTypeId = "type_collection"
            }
            
            var accessibilityExpr = {"$or": [
                {"createBy":options.profileId}, 
                {"accessibility" : null}, {"accessibility" : { $in: [options.profileId] }}]};
            var pathsExpr = {    
                "$or" :[
                        {
                            "_id" : parentId,     
                        },
                        {
                            "path": new RegExp('/' + parentId + '/', 'i') 
                        }, 
                        {
                            "path": new RegExp('/' + parentId + '$')
                        }
                    ]
            };
            
            filter["$and"] = [accessibilityExpr, pathsExpr ];
            db.collection("assets").find(filter).toArray(function(err, data){
                db.close();
                if(err){      
                    db.close();  
                    defer.reject(apiException.serverError("", "AssetManager", err));
                    return;
                }
                
                //var hierarchy = buildTree(data, parentId, options.levels);
                defer.resolve(data);
            });
        });
    });
    return defer.promise;
}

function determinePath(parentIds, callback){
    var defer = q.defer();
    var parentIds = parentIds;
    mongo.connect( )
    .then(function(db){
        db.collection("assets").find({"_id":{$in: parentIds }}).toArray(function(err, data){
            var result = data;
            if(err){
                defer.reject(err);

            } else{
                var paths = [];
                if(result == null || (_.isArray(result) && result.length == 0)){
                    //if the result is null, it means the parent is root element itself.
                    //consider parentId itself as result.
                    parentIds.forEach(function (parentId) {
                        paths.push( "/" + parentId);
                    }); 
                }
                else{
                    parentIds.forEach(function (parentId) {
                        result.forEach(function(a){
                            if(a._paths == null){
                                
                                paths.push( "/" + parentId) ;
                            }
                            else{
                                a._paths.forEach(function(p){
                                    var newPath = p + "/" + parentId;
                                    paths.push(newPath);    
                                });    
                            }
                            
                        });
                    });    
                }
                defer.resolve(paths);
            }
        });
    });
    return defer.promise;
}

module.exports = API.AssetManager   ;