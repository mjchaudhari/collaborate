var path = require("path");
var fs = require('fs-extra'); 
var gDrive = require("./googleDriveHelper.js")();
var shortid	= require("shortid");
var serverConfig = require('./../serverConfig.js');
var _dir = process.cwd();

var tempUploadFolder = path.normalize(__dirname + serverConfig.tempFileStore);

exports.saveFileFromBase64 = function(fileName, b64String, callback){
    var matches = b64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
  
  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }
  
  if(fileName == null || fileName == ""){
      fileName = shortid.generate();
  }
  
  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  var filePath = tmpUploadFolder + "/" + fileName;
  if(!filePath.endsWith(response.type)){
      filePath += "." + response.type.slice(-3);
  }
  fs.writeFile(filePath, response.data, function(err) {  
      if(err){
          callback(err);
          return;
      }
      callback(null, filePath);
  });
  
} 

exports.uploadToGoogleDrive = function(container,filePath, callback){
    var fileName = path.basename(filePath);
    var file;
    var options = {
        resource:file,
        media:{
            mimeType:"",
            body:null,
        }
        
    }
    gDrive.upload()
}