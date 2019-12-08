import * as passport from "passport";
import * as passportBearer from "passport-http-bearer"
import { Router, Request, Response, NextFunction } from "express";

import { Success, Error } from "./Response";
import { DB } from "./DB";
import { Profile } from "./Account/Profile";

class Auth {
    private bearerStrategy = passportBearer.Strategy;

    
    constructor(){
        passport.use(new this.bearerStrategy((token, done) => {
            this.verifyToken(token)
            .then((p) => {
                done(null, p);
            })
            .catch((e)=>{
                done(e);
            });
        }));
    }

    verifyToken(token):Promise<Profile>{
        let promise : Promise<Profile>;
        promise = new Promise((resolve, reject) => {
            new DB().connect()
            .then((db)=>{
                db.collection("users")
                .findOne({"acessToken": token})
                .then((user)=>{
                    if(user == null){
                        reject(new Error("NOTFOUND",""));
                    }
                    else {
                        db.collection("profiles")
                        .findOne({"_id":user.profileId})
                        .then((p)=>{         
                            var profile = new Profile(p);
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
export let isAuthenticated =  (req:Request, res:Response, next: NextFunction)=>{
    if(req.isAuthenticated()){
        return next();
    }
};