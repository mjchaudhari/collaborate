import {serverConfig} from "./serverConfig"
import {MongoClient, Db} from 'mongodb';

export class  DB {
    constructor(){
        
    }

    public connect(): Promise<Db>{
        return new Promise((resolve, reject) => {
            MongoClient.connect(serverConfig.getMongoURI())
            .then((client)=>{
                resolve(client.db(serverConfig.getDbName()));
            })
            .catch((err)=>{
                reject({code: "DB_CONN"});
            })
        });
        //return p;
    }
}