import  * as lodash  from "lodash";

export class Error {
    public error = {
        
    }
    constructor(errCode, message){
        this.error = {
            "code": errCode || 0,
            "message": message || "Internal error"
        }
    }
}
export class Success {
    
    constructor(data){
        lodash.extend(this, data);
    }
    

}