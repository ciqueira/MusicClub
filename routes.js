module.exports = function (app) {
    
    // var oauth = require('./controllers/oauth'),
    var    music = require('./controllers/music');
    //     drive = require('./controllers/drive'),
    //     user = require('./controllers/user'),
     var   auth = require('./middlewares/authResource');
    
    //app.post('/api/oauth/token', oauth.token);
    
    app.all('/api/*', auth); 

//     app.post('/api/drive', drive.sync);
     app.get('/api/music/artist', music.allArtist);
//     app.post('/api/music/start', music.createSession);
// 
//     app.get('/api/user/:user_type', user.findUserByType);
//     app.post('/api/user/:user_id/Follow', user.follow);
//     app.delete('/api/user/:user_id/Follow', user.unfollow);
//     app.get('/api/user/:keyword/searchByName', user.searchByName);
};