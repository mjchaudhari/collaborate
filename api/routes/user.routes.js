
//User routes
var models = require("./../response.models.js").models;
var AccountController = require("./../controllers/account.controller.js");
var apiCore = require("./../models/API.Core.js");
var _dir = process.cwd();

module.exports = function (app) {
	
	/**
     * @api {get} /v1/authenticate Authenticate the user and get access token
     * @apiName Authenticate user secret
     * @apiGroup User
     * @apiParam {number} userName 
     * @apiParam {number} secret
	 *
     * @apiSuccess on success returns the authentication token which should be validated with each subsequent request
    */
	app.post('/v1/account/authenticate', function (req, res) {
		console.log("authenticate");
		AccountController.authenticate(req, function (d) {
			res.json(d);
		});
	});
	/**
     * @api {get} /v1/resend 
     * @apiName Resend the pin
     * @apiGroup User
     * @apiParam {number} userName 
	 *
     * @apiSuccess on success returns the authentication token
    */
	app.post('/v1/account/pin/resend', function (req, res) {
		var v1 = new userCtrl.v1();
		console.log("resend pin");
		console.log(req.body);
		AccountController.resetPasword(req, function (d) {
			res.json(m);
		});
	});

	/**
     * @api {get} /v1/isLoggedIn 
     * @apiName Check if user is authenticated
     * @apiGroup User
     * @apiParam {number} userName 
	 *
	 * @apiHeader {String} Authorization the security token
	 * @apiHeaderExample {json} Header-Example:
	 *     {
	 *       "Authorization": "Bearer xajksdhfkalsduwerb7879fasdf--"
	 *     } 
     * @apiSuccess on success returns the authentication token
    */
	app.post('/v1/account/isAuthenticated', function (req, res) {
		console.log('isLoggedIn');
		if (req.isAuthenticated())
			res.json(new models.success('true'));
		else
			res.json(new models.error("false"));
	});

	/**
	 * @apiName /v1/user/search/:term? Get users
	 * @apiDescription Get the groups of the logged in user has created and the groups he is member of.
     * @apiGroup Group
     *
     * @apiParam {number} id [optional] of the group
	 * @apiExample {curl} Example usage:
 	 *     curl -i http://localhost/v1/user/search?term=mahesh
	 * @apiHeader {String} Authorization the security token
	 * @apiHeaderExample {json} Header-Example:
	 *     {
	 *       "Authorization": "Bearer xajksdhfkalsduwerb7879fasdf--"
	 *     }      
     *
     * @apiSuccess {String} array of groups matching to the criteria .
	 *
	 * @apiSuccessExample {JSON} {
				"isError": false,
				"data": [
					{
					"FirstName": string,
					"LastName": string,
					"UserName":string,
					"Status": string",
					"CreatedOn": date string,
					"EmailId": string
					}]
				}
	 */
	app.get("/v1/account/search:term?", function (req, res) {
		AccountController.searchUsers(req, function (data) {
			res.json(data);
		});
	})

	/**
     * @api {post} /v1/users Create user
     * @apiName Create or register user
     * @apiGroup User		
     *
     * 
     *
	 * * @apiSuccess {String} groups object [{Firstname:"", LastName : "", UserName:"", "Status":"", CreatedOn : "", EmailId:"",Picture:""}]
    */
	app.post('/v1/account/user', function (req, res) {		
		AccountController.createUser(req, function (d) {
			res.json(d);
		});
	});
}