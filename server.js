var express = require('express'),
    app = express(),
    routes = require('./routes'),
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

var mongoUri = 'mongodb://usermusic:usermusic@ds051853.mongolab.com:51853/musicclub';
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', function () {
    throw new Error('unable to connect to database at ' + mongoUri);
});

var oauth = require('./controllers/oauth'),
        music = require('./controllers/music'),
        drive = require('./controllers/drive'),
        user = require('./controllers/user'),
        auth = require('./middlewares/authResource');
    
    

var port = process.env.PORT || 1337;

//require(routes)(app);

    app.post('/api/oauth/token', oauth.token);
    
    app.all('/api/*', auth); 

    app.post('/api/drive', drive.sync);
    app.get('/api/music/artist', music.allArtist);
    app.post('/api/music/start', music.createSession);

    app.get('/api/user/:user_type', user.findUserByType);
    app.post('/api/user/:user_id/Follow', user.follow);
    app.delete('/api/user/:user_id/Follow', user.unfollow);
    app.get('/api/user/:keyword/searchByName', user.searchByName);

app.listen(port);
console.log('Listening... ');