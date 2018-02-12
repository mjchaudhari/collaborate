export module serverConfig {
    
    const mongoURI :string = "mongodb://admin:admin@ds050077.mongolab.com:50077/easyapp";
    let DbName :string = "easyapp";
    
    export function getMongoURI (){
        return mongoURI;
    }
    export function getDbName (){
        return DbName;
    }
    export function setDbName (name){
        DbName = name;
    }
}