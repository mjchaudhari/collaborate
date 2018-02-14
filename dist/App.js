"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const AccountRoutes_1 = require("./Account/AccountRoutes");
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
        this.app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
        this.app.use(bodyParser.json());
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            next();
        });
    }
    routes() {
        let router = express.Router();
        router.get("/", (req, resp, next) => {
            resp.send("Lets Collaborate");
        });
        router.post("/", (req, resp, next) => {
            resp.send("Hey " + req.body.name);
        });
        this.app.use("/v1/", router);
        // var acctRoutes = AccountRouter;
        // var acctRouter = acctRoutes.getRouter();
        this.app.use("/v1/account", AccountRoutes_1.default);
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map