var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
var expressValidator = require('express-validator');

//app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
require('./helpers/optionsExpressValidator.js')(app);


var dbName = "/musicclub";
//var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" + process.env.OPENSHIFT_MONGODB_DB_HOST + dbName;

// var connection_string = 
//   process.env.MONGOLAB_URI || 
//   process.env.MONGOHQ_URL || 
//   'mongodb://localhost/HelloMongoose';

var connection_string = 'mongodb://usermusic:usermusic@ds051853.mongolab.com:51853/musicclub';
mongoose.connect(connection_string);
var db = mongoose.connection;
db.on('error', function () {
    throw new Error('unable to connect to database at ' + connection_string);
});


var port = process.env.PORT || 1337;

require('./routes.js')(app);

app.listen(port);
console.log('Listening... ');