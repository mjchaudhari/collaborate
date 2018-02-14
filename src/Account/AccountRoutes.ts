import { Router } from "express";
import { AccountController } from "./AccountController";


class AccountRoutes{
    
    constructor(){
    
    }
    
    getRouter():Router{
        let router: Router = Router();
        let acctCtrl = new AccountController(router);

        /* Routes */

        router.post("/authenticate", acctCtrl.authenticate);

        return router;
    }
}

const acctRoutes = new AccountRoutes();
const router = acctRoutes.getRouter();
export default router;