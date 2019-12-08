import { Router, Request, Response } from "express";

import {Account} from "./Account";

export class AccountController{
    private router:Router;
    constructor(router: Router){
        this.router = router;
    }

    /**
     * Validate credentials
     * @param request
     *  @param request.user_name
     * @param request.secret
     * @param response 
     */
    public authenticate(request: Request, response: Response){
        let a = new Account();
        a.authenticate(request.body.userName, request.body.secret)
        .then((profile)=>{
            return response.json(profile);
        })
        .catch((err)=>{
            return response.json(err);
        });
    }
    public getAccount (request: Request, response: Response) {
        let a = new Account();
        a.authenticate(request.body.userName, request.body.secret)
        .then((profile)=>{
            return response.json(profile);
        })
        .catch((err)=>{
            return response.json(err);
        });
    }
}