var userData, userDataUp, musicOneDrive = [], isRefreshToken = false,
    User = require('../models/User'),
    Music = require('../models/Music'),
    userController = require('./user.js'),
    musicController = require('./music.js'),
    oneDrive = require('./core/oneDrive');
var async = require('async');
var jwt = require('jsonwebtoken');

function getPar(name, url) {
    if (!url) {
        url = window.location.href;
    }
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
    if (!results) {
        return undefined;
    }
    return results[1] || undefined;
}

exports.getAync = function (userDataUp, callback) {
    
    if (!userDataUp.isCallSync)
        callback(null, userDataUp);
    
    console.log('-start sync for user ' + userDataUp.uid);
    
    async.waterfall([
                 
        function (callback) {
            
            //Recupera dados do usuário no banco
            console.log('find user database');
            
            if (userDataUp.isCallSync) {
                
                userController.findByUid(userDataUp.uid, null, null, function (error, userData) {
                    
                    var dateTokenExpires = userData.drive.lastUpdateDateTime + (userData.drive.expiresIn * 1000);
                    var dateNow = new Date().setMilliseconds(0);
                    
                    if (dateNow > dateTokenExpires)
                        refreshToken = true;
                    
                    callback(null, userData);
                });
                
            } else
                callback(null, userDataUp);
            
        }, function (userData, callback) {
            
            //Se necessário atualizar o token
            console.log('refresh token onedrive');
            
            //if (isRefreshToken) {
            
            //Atualizar token - onedrive
            oneDrive.refreshToken(userData, function (error, body) {
                
                body = JSON.parse(body);
                
                if (body.error)
                    return callback(body, null);
                
                //Atualizar objeto userData: Drive
                userData.drive = {
                    tokenType: body.token_type,
                    expiresIn: body.expires_in,
                    scope: body.scope,
                    accessToken: body.access_token,
                    refreshToken: body.refresh_token,
                    userId: body.user_id
                };
                
                callback(null, userData);
            });
                
            //} else
            //    callback(null, userData);


        }, function (userData, callback) {
            
            //Compartilhar pasta de musica - onedrive
            console.log('shered folder createlink onedrive');

            oneDrive.createLink(userData.drive.accessToken, function (error, body) {
                
                if (body.error)
                    return callback(body, null);
            });
            
            callback(null, userData);

        },
        function (userData, callback) {
            
            //Buscar musicas - onedrive
            console.log('list music onedrive');
            
            var resultData, countPage = 0, countItem = 0, skipTokenValue, skipToken = true;
            
            try {
                oneDrive.listChildren({ accessToken: userData.drive.accessToken, skipToken: null }, function (error, body) {
                    resultData = JSON.parse(body);
                    
                    musicOneDrive = oneDrive.forMusic(resultData, userData._id, userData.name);
                    console.log('items ' + musicOneDrive.length);
                    
                    skipToken = (resultData["@odata.nextLink"])? true:false;
                    if (skipToken) {
                        skipTokenValue = getPar('skiptoken', resultData["@odata.nextLink"].replace("&$skiptoken", '&skiptoken'));

                        async.forever(
                            function (next) {
                                oneDrive.listChildren({ accessToken: userData.drive.accessToken, skipToken: skipTokenValue }, function (error, body) {
                                    resultData = JSON.parse(body);
                                    
                                    musicOneDrive = musicOneDrive.concat(oneDrive.forMusic(resultData, userData._id, userData.name));
                                    console.log('items ' + musicOneDrive.length);

                                    skipToken = (resultData["@odata.nextLink"])? true:false;
                                    if (skipToken) {
                                        skipTokenValue = getPar('skiptoken', resultData["@odata.nextLink"].replace("&$skiptoken", '&skiptoken'));
                                        next();
                                    }
                                    else
                                        callback(null, userData, musicOneDrive.length, musicOneDrive);
                                });
                            });
                    } else
                        callback(null, userData, musicOneDrive.length, musicOneDrive);
                });
            } catch (error) { console.log(error) }
            
        },
        function (userData, countItem, musicOneDrive, callback) {
            
            //Manter musica banco de dados
            console.log('add music database');

            userData.shareSongs = countItem;
            musicController.addArray(musicOneDrive, function (error, result) {
                callback(null, userData);
            });

        },
        function (userData, callback) {
            
            //Atualiza dados do usuário no banco
            console.log('update user database');

            if (userDataUp.isNew == false) {
                
                userData.drive = {
                    tokenType: userDataUp.drive.tokenType,
                    expiresIn: userDataUp.drive.expiresIn,
                    scope: userDataUp.drive.scope,
                    accessToken: userDataUp.drive.accessToken,
                    refreshToken: userDataUp.drive.refreshToken,
                    userId: userDataUp.drive.userId
                };
                userData.drive.lastUpdateDateTime = new Date().setMilliseconds(0);
            }
            
            userData.updateDate = new Date().setMilliseconds(0);
            userController.update(userData, null, null, function (error, result) {
            });
            
            callback(null, userData);
        }
    ], function (error, result) {
        if (error) {
            console.log('--error: ' + JSON.stringify(error));
            return;
        }
        
        
        console.log('-stop sync');
        userData = null, userDataUp = null, musicOneDrive = [];
        callback(null, result);
    });
}

exports.sync = function (req, res) {
    
    var decoded = jwt.decode(req.token, { complete: true });
    
    
    exports.getAync({ uid: decoded.payload.uid, isCallSync: true }, function (error, results) {
    });
    
    res.status(202).end();
};