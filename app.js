var http = require('http');
var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');

// socket.io use
var cors = require('cors');
var app = express();
var port = process.argv[2];
var dbPort = process.argv[3];
var dbName = "dev";

const swaggerUI = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerDefinition = {
	info: {
		title: 'Madori4 APIS',
		version: '1.0.0',
		description: 'Madori4 API'
	},
	host: '218.38.52.30:3030',
	basePath: '/'
};

var options = {
	swaggerDefinition: swaggerDefinition,
	apis: ['./routes/*.js']
};

var swaggerSpec = swaggerJSDoc(options);

/*app.get('/swagger.json', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});*/

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(bodyParser.urlencoded({extended: true}));


app.set('port',  port);
app.set('dbName',  dbName);
app.set('dbPort',  dbPort || 27017);

var mongooseApi = require('./database/mongooseApi');
var dbName = app.get('dbName');
var dbPort = app.get('dbPort');
let conn = mongooseApi.connectDB(dbName, dbPort);
//let AWS = require('aws-sdk');
//AWS.config.loadFromPath(__dirname + "/config/awsconfig.json");
//let s3 = new AWS.S3();

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log('express port : ' + app.get('port') + ', dbName : ' + app.get('dbName')
					+ ', dbPort : ' + app.get('dbPort'));
});

const router = require('./routes/routers')(app);
const mediaRouter = require('./routes/media');	// add image router file
app.use('/', mediaRouter);
const reviewRouter = require('./routes/review');	// add image router file
app.use('/', reviewRouter);
