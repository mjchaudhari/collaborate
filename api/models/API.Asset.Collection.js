
var drive = require("./../googleDriveHelper.js")();
var mongo = require("./../db.connection.js");
var Asset        = require("./API.Asset.js");
var q =require("q");


var API = API || {} // Namespace
API.Collection = function (data){
    //call base classes constructor
    Asset.call(this, data);
    this.allowedTypes = data.allowedTypes;
    this.contentCount = data.contentCount;
    this.cumulativeContentCount = data.cumulativeContentCount;
}
//Prototype

API.Collection.prototype = Object.create( Asset.prototype );
API.Collection.prototype.constructor = API.Collection;
//API.Collection.__proto__ = Asset.prototype;

//Properties
// API.Collection.prototype.allowedTypes = [];
// API.Collection.prototype.contentCount = null;
// API.Collection.prototype.cumulativeContentCount = null;

/**
 * Create or update the collection type asset
 * @return {object} promise
 */
API.Collection.prototype.save = function(){
    var self = this;
    var defered = q.defer();
    Asset.prototype.save.call(this)
    .then(function(a){
        //save this collection asset data.
        //here we must have got the _id of the current asset
        var data = {
            _id: a._id
            , allowedTypes: self.allowedTypes
        }

        mongo.connect()
        .then(function (db) {
            db.collection("assets")
            .findOneAndUpdate({ "_id": data._id },
                { $set: data }, 
                { "upsert": true, "forceServerObjectId": false, "returnOriginal": false }, 
                function (err, data) {
                    if (err) {
                        defered.reject(new APIException(null, 'Collection Asset', err));
                    }
                    else{
                        defered.resolve(data.value);
                    }
                });
        })
        .finally( function(){
            db.close();
        });;
    }, function(e){
        defered.reject(e);
    });
    return defered.promise;
};

module.exports = API.Collection;
