"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = require("./Account");
class AccountController {
    constructor(router) {
        this.router = router;
    }
    /**
     * Validate credentials
     * @param request
     *  @param request.user_name
     * @param request.secret
     * @param response
     */
    authenticate(request, response) {
        let a = new Account_1.Account();
        a.authenticate(request.body.userName, request.body.secret)
            .then((profile) => {
            return response.json(profile);
        })
            .catch((err) => {
            return response.json(err);
        });
    }
    getAccount(request, response) {
        let a = new Account_1.Account();
        a.authenticate(request.body.userName, request.body.secret)
            .then((profile) => {
            return response.json(profile);
        })
            .catch((err) => {
            return response.json(err);
        });
    }
}
exports.AccountController = AccountController;
//# sourceMappingURL=AccountController.js.map