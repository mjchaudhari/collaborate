/*
Manage user user
*/
var _dir = process.cwd();
var _ = require("underscore-node");
var async = require ("async");
var path = require("path");
var models = require("./../response.models.js").models;
var Core = require("./../models/API.Core.js");
var apiAccount = require("./../models/API.Profile.js");

/**
 * Controller for group management
 */
exports.getGroups =function(req, cb)
{
    var profile = req.user; //req.userIsAcount and user.User is actual user profile
    
    var q = req.query;
    var options = {
        _id:q._id,
        name:q.name,
        status:q.status
    };
    profile.getGroups(options, function(e, result){
        if(e)
        {
            db.close();
            return cb(new models.error(e));
        }
        return cb(new models.success(result));
    });
};
/**
 * create or update group
 */
exports.createOrUpdateGroup = function(req, cb){
    var p = req.user;
    p.createOrUpdateGroup(req.body, function(e, data){
        if(e){
            return cb(new models.error(e));
        }
        return cb(new models.success(data));
    });

}