var express         = require('express');
var session 		= require('express-session');
var app             = express();
var port            = process.env.PORT || 8085;
var passport        = require('passport');
var path            = require("path");
var bodyParser      = require('body-parser');
var busboy          = require('connect-busboy');
var serverConfig = require('./serverConfig.js');

var tempUploadFolder = path.normalize(__dirname + "/../../tmpStore");
var multer  = require('multer')
var upload = multer({ dest: tempUploadFolder })

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));
app.use(express.static(path.join(__dirname, serverConfig.webRootDir)));
// required for passport
app.use(session({
      secret: 'letscCollaborate', 
      saveUninitialized: true,
      resave: true })); // session secret
					
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      next();
});

app.get('/', function (req, res, next) {
   console.log('in route');
   
  res.sendFile('./index.html');
});


// routes ======================================================================
//require('./api/routes/auth.routes.js')(dbConfig, app, authController); // load our routes and pass in our app and fully configured passport
//require('./api/routes/oauth.routes.js')(dbConfig, app); // load our routes and pass in our app and fully configured passport
require('./api/routes/user.routes.js')(app); // load our routes and pass in our app and fully configured passport
require('./api/routes/group.routes.js')(app); // load our routes and pass in our app and fully configured passport
// // require('./api/routes/utils.routes.js')(dbConfig, auth, app); // load our routes and pass in our app and fully configured passport
// require('./api/routes/asset.routes.js')(dbConfig, auth, app); // load our routes and pass in our app and fully configured passport


// launch ====================================================================== 
app.listen(port);
console.log('Start on port ' + port);

