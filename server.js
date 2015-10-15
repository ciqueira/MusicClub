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
//require('./helpers/optionsExpressValidator.js')(app);

// var mongoUri = 'mongodb://usermusic:usermusic@ds051853.mongolab.com:51853/musicclub';
// mongoose.connect(mongoUri);
// var db = mongoose.connection;
// db.on('error', function () {
//     throw new Error('unable to connect to database at ' + mongoUri);
// });


var port = process.env.PORT || 1337;

//require(routes)(app);

app.listen(port);
console.log('Listening... ');