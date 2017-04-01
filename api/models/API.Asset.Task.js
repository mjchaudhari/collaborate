
var drive = require("./../googleDriveHelper.js")();
var _dbConfig        = require("./../db.connection.js")
var Asset        = require("./API.Asset.js");
var q =require("q");

var API = API || {} // Namespace
API.Task = function(){}
//Prototype
API.Task.prototype = Asset.prototype;
//API.Task.__proto__ = Asset.prototype;

//Properties
API.Task.prototype.owners = [];
API.Task.prototype.updates = [];
API.Task.prototype.status = null; 

/**
 * Add and update to the task
 * @param {object} update
 * @param {string} update.message - message
 * @param {string} update.status  - new status
 * @param {string} update.updatedBy  - profileId of the task owner
 * @return {boolean} result
 */
API.Task.prototype.createUpdate = function(update){
    return true;
}
/**
 * Add and update to the task
 * @param {string} if of the update
 * @return {boolean} result
 */
API.Task.prototype.voidUpdate = function(id){
    return true;
} 
module.exports = API.Asset;
