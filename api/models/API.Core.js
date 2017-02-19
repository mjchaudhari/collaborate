
'use strict';
var mongo = require("./../db.connection.js");
var shortId = require("shortid");
var APIException = require("./API.Exception.js");
var apiException = new APIException();
var Profile = require("./API.Profile.js");
var async = require ("async");

var API = API || {}; // Namespace

/**
 * Core object. 
 */
API.Core = function (){

};
var _self= this;
this.createOrUpdateConfig = function(config,cb){
    mongo.connect().then(function(db){  
        db.collection("configs").findOneAndUpdate({"_id":config._id},{$set: config}, {"upsert":true, "forceServerObjectId":false, "returnOriginal":false}, 
        function (err, data) {
            if(cb){
                return cb(err,data);    
            }
        });
    });
};

API.Core.prototype.getCategories = function(name, categoryGroup, callback){
    var query = {};
    if(name){
        query.name =  { $regex : new RegExp(name,"i") };
    }
    if(categoryGroup){
        query.configGroup = { $regex : new RegExp(categoryGroup,"i") };;
    }
    mongo.connect().then(function(db){  
        db.collection("configs").find(query).toArray(function(e,d){
            return callback(e,d)
        });
    });
    
};
API.Core.prototype.initConfig = function (){
    var type_collection = {"_id":"type_collection", name:"type_collection", description:"Collection", "displayName":"Collection", "isContainer":true,"isStandard":true, "configGroup":"AssetType","isActive":true};
    var type_topic = {"_id":"type_topic", name:"type_topic", description:"Topic", "displayName":"Topic", "isContainer":true,"isStandard":true, "configGroup":"AssetType","isActive":true};
    var type_document = {"_id":"type_document",name:"type_document", description:"Document", "displayName":"Document", "isContainer":true,"isStandard":true, "configGroup":"AssetType","isActive":true};
    var type_calendar = {"_id":"type_calendar",name:"type_calendar", description:"Comment", "displayName":"Comment", "isContainer":false,"isStandard":true, "configGroup":"AssetType","isActive":true};
    var type_demand = {"_id":"type_demand", name:"type_demand", description:"Issue", "displayName":"Issue", "isContainer":true,"isStandard":true, "configGroup":"AssetType","isActive":true};
    var type_transacton = {"_id":"type_transacton",name:"type_transacton", description:"Announcement", "displayName":"Announcement", "isContainer":false,"isStandard":true, "configGroup":"AssetType","isActive":true};
    var type_form = {"_id":"type_form", name:"type_form", description:"Task", "displayName":"Task", "isContainer":true,"isStandard":true, "configGroup":"AssetType","isActive":true};
    var type_task = {"_id":"type_task", name:"type_task", description:"Task", "displayName":"Task", "isContainer":true,"isStandard":true, "configGroup":"AssetType","isActive":true};

    async.parallel([
        function(callback){
            _self.createOrUpdateConfig( type_collection, callback)
        },
        function(callback){
            _self.createOrUpdateConfig( type_topic, callback)
        },
        function(callback){    
            _self.createOrUpdateConfig( type_document, callback)
            },
        function(callback){    
            _self.createOrUpdateConfig( type_calendar, callback)
            },
        function(callback){    
            _self.createOrUpdateConfig( type_demand, callback)
            },
        function(callback){    
            _self.createOrUpdateConfig( type_transacton, callback)
            },
        function(callback){    
            _self.createOrUpdateConfig( type_task, callback)
            },
        function(callback){    
            _self.createOrUpdateConfig( type_form, callback)
            }
        ],
        function(err, callback) {
            // results is now equals to: {one: 1, two: 2}
            console.log("type config created");
    });
    
    var catTopic = {"_id":"ct_topic", name:"ct_topic", description:"Topic", "displayName":"Topic", "isContainer":true,"isStandard":true, "configGroup":"AssetCategory","isActive":true};
    var catDocument = {"_id":"ct_post",name:"ct_post", description:"Document", "displayName":"Document", "isContainer":true,"isStandard":true, "configGroup":"AssetCategory","isActive":true};
    var catComment = {"_id":"ct_comment",name:"ct_comment", description:"Comment", "displayName":"Comment", "isContainer":false,"isStandard":true, "configGroup":"AssetCategory","isActive":true};
    var catAnnouncement = {"_id":"ct_announcement",name:"ct_announcement", description:"Announcement", "displayName":"Announcement", "isContainer":false,"isStandard":true, "configGroup":"AssetCategory","isActive":true};
    var categoryTask = {"_id":"ct_task", name:"ct_task", description:"Task", "displayName":"Task", "isContainer":true,"isStandard":true, "configGroup":"AssetCategory","isActive":false};
    var categoryIssue = {"_id":"ct_issue", name:"ct_issue", description:"Issue", "displayName":"Issue", "isContainer":true,"isStandard":true, "configGroup":"AssetCategory","isActive":false};
    var categoryEvent = {"_id":"ct_event", name:"ct_event", description:"Event", "displayName":"Event", "isContainer":true,"isStandard":true, "configGroup":"AssetCategory","isActive":false};
    var categoryDemand = {"_id":"ct_demand",name:"ct_demand", description:"Demand for resource (help/money)", "displayName":"Demand", "isContainer":true,"isStandard":true, "configGroup":"AssetCategory","isActive":false};
    var categoryTransaction = {"_id":"ct_transaction",name:"ct_transaction", description:"Transaction", "displayName":"Transaction", "isContainer":true,"isStandard":true, "configGroup":"AssetCategory","isActive":false};
    var categoryQuestionnaire = {"_id":"ct_questionnaire",name:"ct_questionnaire", description:"Questionnaire", "displayName":"Questionnaire", "isContainer":true,"isStandard":true, "configGroup":"AssetCategory","isActive":false};
    
    
    async.parallel([
        function(callback){
            _self.createOrUpdateConfig( catTopic, callback);
        },
        function(callback){    
            _self.createOrUpdateConfig( catDocument,callback); 
        },
        function(callback){
            _self.createOrUpdateConfig( catComment, callback);
                },
        function(callback){
            _self.createOrUpdateConfig( catAnnouncement, callback);
                },
        function(callback){
            _self.createOrUpdateConfig( categoryTask, callback);
        },
        function(callback){
            _self.createOrUpdateConfig( categoryIssue, callback);
        },
        function(callback){
            _self.createOrUpdateConfig( categoryEvent, callback);
        },
        function(callback){
            _self.createOrUpdateConfig( categoryTransaction, callback);
        },
        function(callback){
            _self.createOrUpdateConfig( categoryQuestionnaire, callback);
        },
        function(callback){
            _self.createOrUpdateConfig( categoryDemand, callback);
        }
        ],
        function(err, results) {
            // results is now equals to: {one: 1, two: 2}
            console.log("category config created");
    });
};
/**
 * Authenticate user credentiala
 * @param {object} credential
 * @param {string} object.userName - user name
 * @param {string} object.secret - secret
 * @return {object} user profile
 * @param {string} user.accessToken - access token
 */
API.Core.prototype.authenticate = function(credential, cb){
    console.log("controller : verifySecret");
    getUser(credential.userName, function(e, u){
        if(e){
            return cb(new apiException.serverError("invalid credentials","authenticate")); 
        }
        if(u == null){
            return cb(new apiException.notFound("invalid credentials","authenticate")); 
        }
        if(u.secret != credential.secret){
            return cb(new apiException.invalidInput("invalid credentials","authenticate")); 
        }
        generateToken(u._id, function(e, t){
            if(e){
                console.error(e);
                db.close();
                return cb(e);
            }
            var p = new Profile(u);
            p.accessToken = t.accessToken;
            // var ret = {
            //     _id : p._id,
            //     accessToken:t.accessToken,
            //     userName: p.userName,
            //     firstName: p.firstName,
            //     lastName: p.lastName,
            //     picture : p.picture,
            //     emailId: p.emailId,
            //     address : p.address,
            //     city : p.city,
            //     country : p.country,
            //     zipCode : p.zipCode
            // };
            return cb(null,p); 
        });
    });
};
API.Core.prototype.getUserFromAccessToken = function(accessToken, done){
    mongo.connect()
    .then(function(db){  
        db.collection("users")
        .findOne({"accessToken": accessToken}, function (err, user) {
            if (err) { 
                return done(err); 
            }
            if (!user) { 
                return done(null, false); 
            }
            db.collection("profiles").findOne({"_id":user.profileId}, function(e,p){
                db.close();
                var p = new Profile(p);
                
                return done(null,p);                    
            });
        });
    });    
};

API.Core.prototype.searchUsers = function(searchTerm, callback){
        
    var re = new RegExp( searchTerm , 'gi');
    mongo.connect()
    .then(function(db){
        var filter = {$or: [
            { 'firstName': { $regex: re }}, 
            { 'lastName': { $regex: re }},
            { 'userName': { $regex: re }},
            { 'emailId': { $regex: re }}]
        };
        db.collection("profiles").find(filter).toArray(function(e, data){
            if(e){
                db.close();
                return callback(new apiException.serverError(null, "Core", e)); 
            }
            db.close();
            //TODO: Format data before sending
            return callback(null, data);
        });
    });//Mongo connect end
};
/**
 * Get the user
 * @param {string} userName - user name
 * @return {object} userProfile - profile of the user
 */
API.Core.prototype.getUser = function(userName, cb){
    console.log("API.Core : init");
    mongo.connect()
    .then(function(db){
        db.collection("profiles").findOne({"userName":userName}, function(err,p){
            if(err){
                db.close();
                return cb(err,p);
            }   
            if(p == null){
                console.error("user credentials mismatch");
                db.close();
                return cb("Not found");
            }

            db.collection("users").findOne({"profileId":p._id}, function(err,a){
                db.close();
                var u = new Profile(p);
                return cb(null, u);                 
            });  
        });
    });
};
/**
 * Create or update user if exist
 * @param {object} user - user object to update
 * @return {object} userProfile - profile of the user
 * @return {string} userProfile.userName - user name
 * @return {string} userProfile.firstName - first name of the user
 * @return {string} userProfile.lastName - Last Name of the user
 * @return {string} userProfile.picture - picture of the user
 * @return {string} userProfile - EmailId of the user
 * @return {string} userProfile - Address of the user
 * @return {string} userProfile - City of the user
 * @return {string} userProfile - ZipCode of the user
 * @return {string} userProfile - ZipCode of the user
 * 
 */
API.Core.prototype.createUser = function(user, cb){
    //validate
    if(user.userName == null || user.userName == ""){
        return cb(new apiException.invalidInput("userName required", "Core")); 
    }
    //Find if this user already exist
    var filter = {"userName": user.userName};
    mongo.connect()
    .then(function(db){
        var filter = {"userName":user.userName};
        db.collection("profiles").find(filter).toArray(function(e, data){
            if (e) {
                db.close();
                return cb(new apiException.invalidInput(e.message, "Core")); 
            }
            if (data.length > 0){
                db.close();
                return cb(new apiException.invalidInput(user.userName + " already registered.", "Core")); 
            }
            var p = {
                _id: shortId.generate(),
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                status: "REQUESTED",
                alternateEmail: user.alternateEmail,
                emailId: user.emailId,
                picture: user.picture,
                address: user.address,
                createdOn: new Date(),
                city: user.city,
                country: user.country,
                zipCode: user.zipCode
            };
            //db.collection("profiles").insert(p, {"forceServerObjectId": false, "upsert": true, "fullResult": true}, function (e, data) {
            db.collection("profiles").insert(p, {"forceServerObjectId":true, "upsert":true,  "fullResult":true}, function(e, data){
                if (e) {
                    db.close();
                    return cb(new apiException.serverError(null, "Core", e));
                }
                var randomPin = getRandomPin();
                var u = {
                    _id: shortId.generate(),
                    profileId: p._id,
                    secret: randomPin,
                    forceReset: false,
                    secretsUsed: [randomPin]        
                };
                db.collection("users").insert(u, {"forceServerObjectId": true},  function(e, data){
                    if (e) {
                        db.close();
                        return cb(new apiException.serverError(null, "Core", e));
                    }
                    db.close();
                    return cb(null, p);
                });
            });
        });
    });//mongo connect
};

//Get random pin
var getRandomPin = function(){
    var randomPin = Math.floor(Math.random() * (999999 - 111111) + 111111);
    randomPin = 654321;
    return randomPin;
};
var generateToken = function(userId, callback){
    var token =  getRandomPin();
    token = userId;
    mongo.connect()
    .then(function(db){
        db.collection("users").update({"_id": userId},{$set: {"accessToken": token}}, function(e, d){
            if(e){
                return callback(e, d);    
            }
            return callback(null, {"accessToken": token});
        });
    });
};
var getUser = function(userName, cb){
    console.log("controller : verifySecret");
    mongo.connect()
    .then(function(db){
        db.collection("profiles").findOne({"userName":userName}, function(err,u){
            if(err){
                db.close();
                return cb(err, u);
            }   
            if(u == null){
                console.error("user not found");
                db.close();
                return cb("Not found");
            }

            db.collection("users").findOne({"profileId":u._id}, function(err,a){
                db.close();
                a.profile = u;
                return cb(null, a);                 
            });  
        });

    });
};

module.exports = API.Core;