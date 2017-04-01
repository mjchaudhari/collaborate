
var drive = require("./../googleDriveHelper.js")();
var mongo        = require("./../db.connection.js")
var APIException = require("./API.Exception.js");
var q =require("q");

var apiException = new APIException();
var API = API || {} // Namespace
API.Group = function(data){
    
    //Properties
    this._id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.locale = data.locale;
    this.status = data.status;
    this.thumbnail = data.thumbnail;
    this.members = data.members;
    this.url = data.url;
    this.groupType = data.groupType;
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
    this.updatedOn  = data.updatedOn;
    this._fileStorage = data._fileStorage;
}

API.Group.prototype.init = function(id, userId, cb){
    console.log("API.Group : init");
    _dbConfig.mongodbClient.connect( _dbConfig.mongoURI,function(err, db){
        db.collection("groups")
        .findOne({"_id":id, "members" : {$in: [userId]}}, function (e, g) {
            if(e){
                return cb(e,g);
            }
            else if(g == null){
                return cb("Group is not found", null);
            }
            var filter = {"_id" : {$in : g.Members}};
            db.collection("profiles").find(filter).toArray(function(e, data){
                if(e){
                    db.close();
                    return cb(new models.error(e));
                }
                if(data){
                    db.close();
                    _id = g._id;
                    this.name = g.name;
                    this.description = g.description;
                    this.locale = g.locale;
                    this.status = g.status;
                    this.thumbnail = g.thumbnail;
                    this.members = g.data;
                    this.url = g.url;
                    this.groupType = g.groupType;
                    this.createdBy = g.createdBy;
                    this.updatedBy = g.createdBy;
                    this.updatedOn  = g.updatedBy;
                    this._fileStorage = g._fileStorage;
                    return cb(err, this);
                };
            });
        });
    });
}
/**
 * get the group members
 * @param {object} options 
 * @return {object} options._id - group id
 * @return {array[object]} group.memberes - members
 
 */
API.Group.prototype.getMembers = function (options, cb) {
    if (options == null) {
        options = {};
    }
    var search = {};
    
    if (options._id && options._id != 0) {
        search._id = options._id;
    }
    
    mongo.connect()
    .then(function (db) {
        db.collection("groups")
        .findOne({"_id" : search._id}, function (e, resultGroup) {
            if (e) {
                db.close();
                return cb(new APIException(null, 'Group', err));
            }
            else if(resultGroup == null){
                var ex = new ApiException();
                db.close();
                return cb(new ex.notFound("Group Not found", 'Group', err));
            }

            var result = [];
        
            //{"_id":  {$in: ["VJvggm7ug","VJ0esDQ_e","41yeBrY_l","NJ6PJdKFe","EyfRUZB5x"]} }
            var members = resultGroup.members;
            db.collection("profiles")
            .find({ "_id": { $in: members } }).toArray(function (e, members) {
                db.close();
                if (e) {
                    return cb(new APIException(null,'Group', e));
                }
                else {
                    return cb(null, members);
                }
            });
        });
    });
};
API.Group.prototype.getFilesFromStorage = function(callback){
    if(!this._isReady){
        //throw new API.ApiException("Group is not instanciated.", "Group.getFileStarage()");
        return callback("Group is not instanciated.");
    }
    drive.getFiles({parentId : this._fileStorage}, function(e,d){

        return callback(e,d);
    });
    
}

API.Group.prototype.getFileTreeFromStorage = function(callback){
    if(!this._isReady){
        //throw new API.ApiException("Group is not instanciated.", "Group.getFileStarage()");
        return callback("Group is not instanciated.");
    }
    drive.getFileTree({parentId : this._fileStorage}, function(e,d){
        return callback(e,d);
    });
    
}

API.Group.prototype.getFileFromStorage = function(params,callback){
    if(!this._isReady){
        //throw new API.ApiException("Group is not instanciated.", "Group.getFileStarage()");
        return callback("Group is not instanciated.");
    }
    drive.getFile({id : params.id}, function(e,d){
        return callback(e,d);
    });
    
}

function buildAssetModel(data, currentUser, createId) {
    if(createId == undefined){
        createId = true;
    }
    
    var isNew = data._id == null; 
    var a = {}
    
    //Check if this is new docuemnt
    if(data._id){
        a._id = data._id;
    }
    else if(data._id == null && createId){
        a._id = shortId.generate();    
    }
    
    a._uid = data._uid ? "" : a._id
    
    a.groupId = data.groupId;
    if(data.TopicId ){
        a.topicId = data.topicId
    }
    else{
        a.topicId = data.groupId
    }
    
    //We do not consider the paths those are sent with data as we want to determine it ourself.
    if(data.parentIds){
        a.parentIds = data.parentIds;
    }
    else{
        a.parentIds = [data.groupId];
    }
    
    a.name          = data.name;
    a.description   = data.description;
    a.locale        = data.locale;
    a.publish       = data.publish;
    a.allowComment  = data.allowComment;
    a.allowLike     = data.allowLike;
    a.status        = data.status;
    a.thumbnail     = data.thumbnail;
    a.urls          = data.urls;
    a.moderators    = data.moderators;
    a.activateOn    = data.activateOn;
    a.expireOn      = data.expireOn;
    a.alloudTypes   = data.allowedTypes;
    a.updatedOn     = new Date();
    a.updatedById   = currentUser._id; 
    if(data.accessibility){
        a.accessibility = data.accessibility;
    }

    if (data.assetType != null){
        a.assetTypeId = data.assetType._id;
    }
    else if (data.assetTypeId != null){
        a.assetTypeId = data.assetTypeId;
    }
    
    if (data.assetCategory != null){
        a.assetCategoryId = data.assetCategory._id
    }
    else if (data.assetCategoryId != null){
        a.assetCategoryId = data.assetCategoryId
    }
    
    if(isNew){
        a.areatedOn = new Date();
        a.areateBy = currentUser._id;
    }
    //Audit trail
    a.auditTrail = data.auditTrail;
        
    if(a.auditTrail == null){
        a.auditTrail = [];    
    } 
    a.auditTrail.push({
        action: data._id == null ? "Create" : "Update",
        updatedById : currentUser._id,   
        updatedOn : new Date(),
        description : "",
        notify : true,
    });
    
    a.customData = data.customData;
        
    switch (data.assetTypeId) {
        case "type_collection":
        {
            a.allowComment  = false;
            a.allowLike     = false;
            break;
        }
        case "type_document":
        {
            break;
        }
        case "type_calendar":
        {
            a.calendar.startDate         = data.calendar.startDate;
            a.calendar.endDate           = data.calendar.endDate;
            a.calendar.venue             = data.calendar.venue;
            a.calendar.venueAddress      = data.calendar.venueAddress;
            a.calendar.venueMapLocation  = data.calendar.venueMapLocation;
            a.calendar.contact           = data.calendar.contact;
            break;
        }
        case "type_task":
        {
            a.task = {};
            a.task.taskType = data.task.taskType;
            a.task.taskStatus    = data.task.taskStatus;
            a.task.isClosed  = data.task.isClosed;
            a.task.closedOn  = data.task.closedOn;
            a.task.owners    = data.task.owners;
            a.task.updates   = data.task.updates; 
            
            break;
        }
        case "type_demand":
        {
            break;
        }
        case "type_transaction":
        {
            break;
        }
        case "type_form":
        {
            break;
        }
        
        default:{
            
            break;
        }
            
    }
    
    return a;
}

module.exports = API.Group;
