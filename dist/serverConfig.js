"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serverConfig;
(function (serverConfig) {
    const mongoURI = "mongodb://admin:admin@ds050077.mongolab.com:50077/easyapp";
    let DbName = "easyapp";
    function getMongoURI() {
        return mongoURI;
    }
    serverConfig.getMongoURI = getMongoURI;
    function getDbName() {
        return DbName;
    }
    serverConfig.getDbName = getDbName;
    function setDbName(name) {
        DbName = name;
    }
    serverConfig.setDbName = setDbName;
})(serverConfig = exports.serverConfig || (exports.serverConfig = {}));
//# sourceMappingURL=serverConfig.js.map