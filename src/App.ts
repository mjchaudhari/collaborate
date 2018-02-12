import * as bodyParser from 'body-parser';
import * as path from "path"
import * as  express  from "express";
import {  } from "morgan";

import {Success, Error} from "./Response"

import { Account} from "./Account/Account"

export class App{
    public app: express.Application;
    private port: string = process.env.PORT || "8085";

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        
    }

    start() {
        this.app.listen(this.port, () => {
            console.log("server started on ", this.port);
        })
    }
    config(){
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));

        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            next();
      });
    }

    routes(){
        var router = express.Router();
        router.get("/", (req, resp, next) =>{
            //resp.json({data: "Good to see you. Lets collaborate!!!"});
            const a = new Account();
            let auth = a.authenticate("9850890846", "654321")
            .then((res)=>{
                resp.json(new Success(res));
            })
            .catch((err)=>{
                resp.json(new Error(err.code, err.message));
            });
        });
        this.app.use("/", router);
    }

}