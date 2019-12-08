
import { Success, Error } from "../Response";
import * as shortId from "shortid"
import { DB } from "../DB";
import { Profile } from "./Profile";

export class Account {
    public id: string;
    public username: String;
    public firstName: string;
    public lastName: string;
    public mobileno: string;
    public emailId: string;
    public address: string;
    public city: string;
    public picture: string;
    private passowrd: string


    constructor() {


    }

    public authenticate(userName, password): Promise<Profile> {
        const p : Promise<Profile> = new Promise((resolve, reject) => {
            new DB().connect()
                .then((db) => {
                    db.collection("profiles")
                        .findOne({ "userName": userName })
                        .then((profile) => {
                            if (profile == null) {
                                reject(new Error("UNAUTHENTICATED", ""));
                            }
                            else {
                                //Find user and match password
                                db.collection("users")
                                    .findOne({ "profileId": profile._id, secret: password })
                                    .then((user) => {
                                        var p = new Profile(profile);
                                        resolve(p);
                                    })
                                    .catch((err) => {
                                        reject(new Error("UNAUTHENTICATED", ""));
                                    })
                            }
                        })
                        .catch(() => {
                            reject(new Error("UNAUTHENTICATED", ""));
                        });

                });
        });
        return p;
    }
    public getProfile(userName): Promise<Profile> {
        const p : Promise<Profile> = new Promise((resolve, reject) => {
            new DB().connect()
                .then((db) => {
                    db.collection("profiles")
                        .findOne({ "userName": userName })
                        .then((profile) => {
                            if (profile == null) {
                                reject(new Error("UNAUTHENTICATED", ""));
                            }
                            else {
                                //Find user and match password
                                db.collection("users")
                                    .findOne({ "profileId": profile._id })
                                    .then((user) => {
                                        var p = new Profile(profile);
                                        resolve(p);
                                    })
                                    .catch((err) => {
                                        reject(new Error("UNAUTHENTICATED", ""));
                                    })
                            }
                        })
                        .catch(() => {
                            reject(new Error("UNAUTHENTICATED", ""));
                        });

                });
        });
        return p;
    }
    public getGroups() {

    }

}