
var mongodb = require('mongodb');
var serverConfig = require('../serverConfig.js');
var q = require('q');
var mongoURI = serverConfig.mongoURI;
var connect = function(){
    var defer = q.defer();
    mongodb.MongoClient.connect(mongoURI, function(e, db){
        if(e){
            console.error(e);
            defer.reject("db connection Error");
        }

        defer.resolve(db);
    });
    return defer.promise;
};
module.exports = {
    uri: mongoURI,
    client: mongodb.MongoClient,
    connect : connect
};
    
