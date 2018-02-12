"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("../Response");
const DB_1 = require("../DB");
const Profile_1 = require("./Profile");
class Account {
    constructor() {
    }
    authenticate(userName, password) {
        const p = new Promise((resolve, reject) => {
            new DB_1.DB().connect()
                .then((db) => {
                db.collection("profiles")
                    .findOne({ "userName": userName })
                    .then((profile) => {
                    if (profile == null) {
                        reject(new Response_1.Error("UNAUTHENTICATED", ""));
                    }
                    else {
                        //Find user and match password
                        db.collection("users")
                            .findOne({ "profileId": profile._id })
                            .then((user) => {
                            var p = new Profile_1.Profile(profile);
                            resolve(p);
                        })
                            .catch((err) => {
                            reject(new Response_1.Error("UNAUTHENTICATED", ""));
                        });
                    }
                })
                    .catch(() => {
                    reject(new Response_1.Error("UNAUTHENTICATED", ""));
                });
            });
        });
        return p;
    }
    getGroups() {
    }
}
exports.Account = Account;
//# sourceMappingURL=Account.js.map