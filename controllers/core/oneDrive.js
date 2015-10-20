var request = require("request"),
    Music = require('../../models/Music');

exports.forMusic = function (resultData, _id, name) {
    var musicOneDrive = [];
    for (i = 0; i < resultData.value.length; i++) {
        if (resultData.value[i].audio) {
            
            var musicData = new Music({
                idFile: resultData.value[i].id,
                sharedBy: _id,
                size: resultData.value[i].size,
                nameFile: resultData.value[i].name,
                streamUrl: resultData.value[i]["@content.downloadUrl"],
                album: resultData.value[i].audio.album,
                albumArtist: resultData.value[i].audio.albumArtist,
                artist: resultData.value[i].audio.artist,
                //composers: resultData.value[i].audio.composers,
                duration: resultData.value[i].audio.duration,
                title: resultData.value[i].audio.title,
                thumbnailUrl: '',
                createDate: new Date().setMilliseconds(0),
                updateDate: new Date().setMilliseconds(0)
            });
            
            musicOneDrive.push(musicData);
        }
    }


    return musicOneDrive;

};

exports.accessTokens = function (code, callback) {

    var options = {
        method: 'POST',
        url: 'https://login.live.com/oauth20_token.srf',
        form: 
 {
            client_id: '0000000040163619',
            redirect_uri: 'https://login.live.com/oauth20_desktop.srf',
            client_secret: 'ZP3r1WCc5aNt6AuqAPPGTiPn8LNKwjtT',
            code: code,
            grant_type: 'authorization_code'
        }
    };
    
    request(options, function (error, response, body) {
        callback(error, body);
    });
};
exports.refreshToken = function (userData, callback) {

    var options = {
        method: 'POST',
        url: 'https://login.live.com/oauth20_token.srf',
        form: 
 {
            client_id: '0000000040163619',
            redirect_uri: 'https://login.live.com/oauth20_desktop.srf',
            client_secret: 'ZP3r1WCc5aNt6AuqAPPGTiPn8LNKwjtT',
            refresh_token: userData.drive.refreshToken,
            grant_type: 'refresh_token'
        }
    };
    
    request(options, function (error, response, body) {
        callback(error, body);
    });

};
exports.listChildren = function (data, callback) {
    
    var options = {
        method: 'GET',
        url: 'https://api.onedrive.com/v1.0/drive/special/music:/:/children',
        qs: 
 {
            expand: 'thumbnails(select=id,large,medium,small,source)',
            select: 'id,name,size,audio,@content.downloadUrl'
        },
        headers: { authorization: 'Bearer ' + data.accessToken }
    };
    
    if (data.skipToken)
        options.qs.skiptoken = data.skipToken;
    
    request(options, function (error, response, body) {
        callback(error, body);
    });

    
 //   var options = {
 //       method: 'GET',
 //       url: 'https://api.onedrive.com/v1.0/drive/special/music:/:/view.search',
 //       qs: 
 //{
 //           q: '*',
 //           expand: 'thumbnails(select=id,large,medium,small,source)',
 //           //top: '10',
 //           select: 'id,name,size,audio,@content.downloadUrl' 
 //       },
 //       headers: { authorization: 'Bearer ' + data.accessToken }
 //   };
    
 //   if (data.skipToken)
 //       options.qs.skiptoken = data.skipToken;
    
 //   request(options, function (error, response, body) {
 //       callback(error, body);
 //   });
};
exports.aboutMe = function (accessToken, callback) {

    var options = {
        method: 'GET',
        url: 'https://apis.live.net/v5.0/me',
        qs: { access_token: accessToken }
    };
    
    request(options, function (error, response, body) {
        callback(error, body);
    });
};
exports.createLink = function (accessToken, callback) {

    var options = {
        method: 'POST',
        url: 'https://api.onedrive.com/v1.0/drive/special/music:/:/action.createLink',
        headers: 
 {
            'content-type': 'application/json',
            authorization: 'Bearer ' + accessToken
        },
        body: { type: 'view' },
        json: true
    };
    
    request(options, function (error, response, body) {
        callback(error, body);
    });
};
