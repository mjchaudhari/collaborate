"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const Response_1 = require("./Response");
const Account_1 = require("./Account/Account");
class App {
    constructor() {
        this.port = process.env.PORT || "8085";
        this.app = express();
        this.config();
        this.routes();
    }
    start() {
        this.app.listen(this.port, () => {
            console.log("server started on ", this.port);
        });
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            next();
        });
    }
    routes() {
        var router = express.Router();
        router.get("/", (req, resp, next) => {
            //resp.json({data: "Good to see you. Lets collaborate!!!"});
            const a = new Account_1.Account();
            let auth = a.authenticate("9850890846", "654321")
                .then((res) => {
                resp.json(new Response_1.Success(res));
            })
                .catch((err) => {
                resp.json(new Response_1.Error(err.code, err.message));
            });
        });
        this.app.use("/", router);
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map