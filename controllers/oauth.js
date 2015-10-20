var drive = require('./drive.js'),
    User = require('../models/User'),
    userController = require('./user.js'),
    oneDrive = require('./core/oneDrive');
var async = require('async');
var jwt = require('jsonwebtoken');

exports.token = function (req, res) {
    
    var code = req.body.client_secret.split(':')[1];
    var providerName = req.body.client_secret.split(':')[0];
    
    async.waterfall([
        function (callback) {
            
            //Solicita access token de autorização - onedrive
            oneDrive.accessTokens(code, function (error, body) {
                var body = JSON.parse(body)
                
                if ((body.error != null) || (error))
                    callback(body);
                else
                    callback(null, body);
            });

        },
        function (dataAccess, callback) {
            
            //Solicita dados básico do usuário - onedrive
            oneDrive.aboutMe(dataAccess.access_token, function (error, body) {
                
                var body = JSON.parse(body);
                
                if ((body.error != null) || (error))
                    callback(body);
                else {
                    
                    var userData = new User({
                        uid: body.id,
                        provider: 'OneDrive',
                        fistName: body.first_name,
                        lastName: body.last_name,
                        name: body.name,
                        email: null,
                        photoUrl: null,
                        shareSongs: null,
                        drive: {
                            tokenType: dataAccess.token_type,
                            expiresIn: dataAccess.expires_in,
                            scope: dataAccess.scope,
                            accessToken: dataAccess.access_token,
                            refreshToken: dataAccess.refresh_token,
                            userId: dataAccess.user_id,
                            lastUpdateDateTime: new Date().setMilliseconds(0)
                        }
                    });
                    callback(null, userData);
                }
            });

        },
        function (userData, callback) {
            
            //<<Criar Usuário>>
            userController.findByUid(userData.uid, req, res, function (error, result) {
                
                if (result === null) {
                    userData.createDate = new Date().setMilliseconds(0);
                    userData.updateDate = new Date().setMilliseconds(0);
                    userController.add(userData, req, res, function (error, result) {
                        result.isNew = true;
                        callback(null, result);
                    });
                }
                else {
                    
                    result.drive = {
                        tokenType: userData.drive.tokenType,
                        expiresIn: userData.drive.expiresIn,
                        scope: userData.drive.scope,
                        accessToken: userData.drive.accessToken,
                        refreshToken: userData.drive.refreshToken,
                        userId: userData.drive.userId,
                        lastUpdateDateTime: new Date().setMilliseconds(0)
                    };
                    
                    result.updateDate = new Date().setMilliseconds(0);
                    userController.update(result, req, res, function (error, result) {
                        userData.isNew = false;
                        callback(null, result);
                    });
                }
            });
        },
        function (userData, callback) {
            
            //<<Sync Drive>>
            drive.getAync(userData, callback);
        }
    ], function (error, result) {
        if (error)
            return res.status(500).json(error);
        
        var token = jwt.sign({ uid: result.uid }, 'Ci23fWtahDYE3dfirAHrJhzrUEoslIxqwcDN9VNhRJCWf8Tyc1F1mqYrjGYF', { expiresInSeconds : 3600 });
        
        return res.json({
            "access_token": token,
            "token_type": "bearer",
            "expires_in": 3600
        });
    });
};