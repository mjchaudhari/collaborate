"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passportBearer = require("passport-http-bearer");
const Response_1 = require("./Response");
const DB_1 = require("./DB");
const Profile_1 = require("./Account/Profile");
class Auth {
    constructor() {
        this.bearerStrategy = passportBearer.Strategy;
        passport.use(new this.bearerStrategy((token, done) => {
            this.verifyToken(token)
                .then((p) => {
                done(null, p);
            })
                .catch((e) => {
                done(e);
            });
        }));
    }
    verifyToken(token) {
        let promise;
        promise = new Promise((resolve, reject) => {
            new DB_1.DB().connect()
                .then((db) => {
                db.collection("users")
                    .findOne({ "acessToken": token })
                    .then((user) => {
                    if (user == null) {
                        reject(new Response_1.Error("NOTFOUND", ""));
                    }
                    else {
                        db.collection("profiles")
                            .findOne({ "_id": user.profileId })
                            .then((p) => {
                            var profile = new Profile_1.Profile(p);
                            resolve(profile);
                        });
                    }
                });
            });
        });
        return promise;
    }
}
const auth = new Auth();
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
};
//# sourceMappingURL=Auth.js.map