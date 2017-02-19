
var path = require("path");
var fs = require('fs-extra'); 
var serverConfig = require('./../../serverConfig.js');
var fileHandler = require("./../file.handler.js");
var UtilsController = require("./../controllers/utils.controller.js");
var _dir = process.cwd();

module.exports = function(app) {
    
    
	var tmpUploadFolder = path.normalize(_dir + serverConfig.tempFileStore);
	
	/**
	 * @apiName /v1/file?filename  get the file
	 * @apiDescription Get the file 
     * @apiGroup Group
     *
     * @apiParam {string} filename [optional] 
	 * @apiExample {curl} Example usage:
 	 *     curl -i http://localhost/v1/utils/file/upload
	 * @apiHeader {String} Authorization the security token
	 * @apiHeaderExample {json} Header-Example:
	 *     {
	 *       "Authorization": "Bearer xajksdhfkalsduwerb7879fasdf--"
	 *     }      
     *
     * @apiSuccess {String} array of groups matching to the criteria .
	 *
	 */
	app.get('/file/*', function(req, res){
		var disklocation = tmpUploadFolder + '/' + req.params[0] ;
        if(fs.existsSync(disklocation)){
		  res.download(disklocation);}
        else{
            res.status(404).send("Not found");
        }
	});
    
    /**
     * Upload base64 thumbnail 
     * @apiParam {string} imgUrl - image in base64 string  
     * @apiParam {string} name - file name 
     * @apiSuccess {string} url of the ploaded image
     */
    app.post("/v1/thumbnail/binary", function(req, res){
        var base64String = req.body.imgUrl;
        var fileName = req.body.fileName;
        
        fileHandler.saveFileFromBase64(fileName, base64String, function(err, filePath){
            if(err){
                console.error(err);
                var e = new models.error(err,"");
                res.json(e);    
                return;
            };
            var downloadUrl = '//' + req.headers.host + '/file/'+fileName;
            var s = new models.success();
            s.data = fileName;
            res.json(s);
        });
	});
/**
	 * @apiName /v1/utils/categories/:name?/:categoryGroup Get categories
	 * @apiDescription Get asset categories
     * @apiGroup Config
     *
     * @apiParam {string} name [optional] of the config
     * @apiParam {string} categoryGroup [optional] name of the config
	 * @apiExample {curl} Example usage:
 	 *     curl -i http://localhost/v1/utils/categories?name=Ct_Comment&categoryGroup="AssetCategory"
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
                        "_id":string,
                        "Name":string,
                        "Description":string,
                        "DisplayName":string,
                        "IsContainer":bool,
                        "IsStandard":bool,
                        "ConfigGroup":string					
				}
	 */
	app.get("/v1/config/categories",  function(req, res){
		UtilsController.getCategories(req, function (d) {
			res.json(d);
		});
    });
}