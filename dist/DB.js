"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverConfig_1 = require("./serverConfig");
const mongodb_1 = require("mongodb");
class DB {
    constructor() {
    }
    connect() {
        return new Promise((resolve, reject) => {
            mongodb_1.MongoClient.connect(serverConfig_1.serverConfig.getMongoURI())
                .then((client) => {
                resolve(client.db(serverConfig_1.serverConfig.getDbName()));
            })
                .catch((err) => {
                reject({ code: "DB_CONN" });
            });
        });
        //return p;
    }
}
exports.DB = DB;
//# sourceMappingURL=DB.js.map