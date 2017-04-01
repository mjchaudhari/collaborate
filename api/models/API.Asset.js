
var drive = require("./../googleDriveHelper.js")();
var mongo = require("./../db.connection.js");
var APIException = require("./API.Exception.js");
var apiException = new APIException();
var shortId = require("shortid");
var async = require ("async");
var utilies = require("./../utils.js");
var q =require("q");

var API = API || {} // Namespace
API.Asset = function(data){
    if(data == null){
        data = {};
    }
    this._id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.local = data.local;
    this.publish=data.publish;
    this.allowLike = data.allowLike;
    this.thumbnail = data.thumbnail;
    this.activateOn = data.activateOn;
    this.assetTypeId = data.assetTypeId;
    this.assetCategoryId = data.assetCategoryId;
    this.createdOn = data.createdOn;
    this.updatedOn = data.updatedOn;
    this.createdBy = data.createdBy;
    this.accessibility = data.accessibility;
    this.fileDetails        = data.fileDetails;
    this.path        = data.path;
    this.groupAssociations      =data.groupAssociations;
    
}
    
// //Properties
// API.Asset.prototype._id           =null;
// API.Asset.prototype.name          = null;
// API.Asset.prototype.description   = null;
// API.Asset.prototype.locale        = null;
// API.Asset.prototype.publish       = null;
// API.Asset.prototype.allowComment  = null;
// API.Asset.prototype.allowLike     = null;
// API.Asset.prototype.allowLike     = null;
// API.Asset.prototype.status        = null;
// API.Asset.prototype.thumbnail     = null;
// API.Asset.prototype.urls          = null;
// API.Asset.prototype.moderators    = null;
// API.Asset.prototype.activateOn    = null;
// API.Asset.prototype.expireOn      = null;
// API.Asset.prototype.updatedOn     = new Date();
// API.Asset.prototype.updatedById   = null;
// API.Asset.prototype.assetTypeId   = null;
// API.Asset.prototype.assetCategoryId =null;
// API.Asset.prototype.createdOn       =null;
// API.Asset.prototype.createBy        = null;
// API.Asset.prototype.accessibility        = null;
// API.Asset.prototype.auditTrail        = null;
// /**
//  * File details
//  * {name:'', url:'', path:'', type:'', size:'' }
//  */
// API.Asset.prototype.fileDetails        = [];
// API.Asset.prototype.path        = [];
// API.Asset.prototype.groupAssociations      =[];

/**
 * Save basic asset
 * @return promise
 */
API.Asset.prototype.save = function(){
    var defered = q.defer();
    //validate
    if(this.name == null){
        defered.reject(apiException.invalidInput("name required", "Asset"));
    }

    if(this.createdBy == null){
        defered.reject(apiException.invalidInput("creater required", "Asset"));
    }

    if(this.assetTypeId == null){
        defered.reject(apiException.invalidInput("assetType required", "Asset"));
        return;
    }
    
    if(this.path == null){
        defered.reject(apiException.invalidInput("path required", "Asset"));
        return;
    }

    if(this.groupAssociations == null || (this.groupAssociations != null && this.groupAssociations.length <= 0)){
        
        defered.reject(apiException.invalidInput("group associations required", "Asset"));
        return;
    
    }

    //If this is new object then create id for it
    if(this._id == null){
        this._id = shortId.generate();
    }

    //build object to save
    var data = utilies.clean(this);
    //save the assset
    mongo.connect()
    .then(function (db) {
        db.collection("assets")
        .findOneAndUpdate({ "_id": data._id },
            { $set: data }, 
            { "upsert": true, "forceServerObjectId": false, "returnOriginal": false }, 
            function (err, data) {
                if (err) {
                    defered.reject(new APIException(null, 'Asset', err));
                }
                else{
                    defered.resolve(data.value);
                }
            })
            .finally( function(){
                db.close();
            });
    });
    return defered.promise;
}

module.exports = API.Asset;


