"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AccountController_1 = require("./AccountController");
class AccountRoutes {
    constructor() {
    }
    getRouter() {
        let router = express_1.Router();
        let acctCtrl = new AccountController_1.AccountController(router);
        /* Routes */
        router.post("/authenticate", acctCtrl.authenticate);
        return router;
    }
}
const acctRoutes = new AccountRoutes();
const router = acctRoutes.getRouter();
exports.default = router;
//# sourceMappingURL=AccountRoutes.js.map