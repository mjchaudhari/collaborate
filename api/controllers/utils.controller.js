/*
Manage user user
*/
var _dir = process.cwd();
var _ = require("underscore-node");
var async = require ("async");
var path = require("path");
var models = require("./../response.models.js").models;
var Core = require("./../models/API.Core.js");

exports.getCategories = function(req, cb){
    var name = "";
    var categoryGroup = "";
    if( req.query != null ){
        name = req.query.name;
        categoryGroup = req.query.categoryGroup;
    }
    core.getCategories(name, categoryGroup, function (e,d){
        if(e)
        {
            res.json(new models.error(e));
        }
        res.json(new models.success(d));
    });
};
    