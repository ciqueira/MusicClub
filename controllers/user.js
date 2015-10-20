var mongoose = require('mongoose'),
    User = require('../models/User');
var jwt = require('jsonwebtoken');

exports.add = function (userData, req, res, callback) {
    User.create(userData, function (error, result) {
        callback(error, result);
    });
};

exports.update = function (userData, req, res, callback) {
    User.update({ "_id": userData._id }, userData,
    function (error, numberAffected) {
        callback(error, userData);
    });
}

exports.findByUid = function (uid, req, res, callback) {
    User.findOne({ 'uid': uid })
            .populate('follow')
            .exec(function (error, result) {
        callback(error, result);
    });
};

exports.findUserByType = function (req, res) {
    
    req.assert('user_type', ['SOMENTE_CARACTERES_ALFANUMÉRICOS', 1010]).isAlpha();
    req.assert('offset', ['SOMENTE_NÚMEROS', 1011]).optional().isInt();
    req.assert('limit', ['SOMENTE_NÚMEROS', 1012]).optional().isInt();
    
    var errors = req.validationErrors();
    if (errors) {
        res.status(500).json(errors);
        return;
    }
    
    var user_type = req.params.user_type;
    var offset = req.query.offset;
    var limit = req.query.limit;
    
    var decoded = jwt.decode(req.token, { complete: true });
    
    
    if (user_type === 'followed') {
        User.findOne({ 'uid': decoded.payload.uid })
            .populate('follow')
            .exec(function (error, result) {
            
            var ResultArray = [];
            for (var i = 0, len = result.follow.length; i < len; i++) {
                ResultArray.push({
                    userId: result.follow[i].uid,
                    fistName: result.follow[i].fistName,
                    lastName: result.follow[i].lastName,
                    name: result.follow[i].name,
                    shareSongs: result.follow[i].shareSongs
                });
            }
            
            return res.json({
                result: ResultArray
            });
        });
    } else {
        return res.json({
            result: [{
                    "userId": "",
                    "fistName": "Jason",
                    "lastName": "Anderson",
                    "name": "Jason Anderson",
                    "shareSongs": 54
                },
                {
                    "userId": "",
                    "fistName": "Magno",
                    "lastName": "Dias",
                    "name": "Magno Dias",
                    "shareSongs": 1854
                }]
        });
    }


    
};
exports.follow = function (req, res) {
    
    var user_id = req.params.user_id;
    
    var errors = req.validationErrors();
    if (errors) {
        res.status(500).json(errors);
        return;
    }
    
    //collection.findAndModify({a:1}, [['a', 1]], {$set:{b1:1}}, {new:true}, function(err, doc) {
    
    return res.status(201).end();
};
exports.unfollow = function (req, res) {
    
    var user_id = req.params.user_id;
    
    var errors = req.validationErrors();
    if (errors) {
        res.status(500).json(errors);
        return;
    }
    
    return res.status(202).end();
};
exports.searchByName = function (req, res) {
    
    req.assert('keyword', ['2_20_CARACTERES', 1013]).len(2, 20);
    
    var errors = req.validationErrors();
    if (errors) {
        res.status(500).json(errors);
        return;
    }
    
    var keyword = req.params.keyword;
    
    
    
    return res.status(200).json({
        "result": [
            {
                "userId": "",
                "fistName": "Jason",
                "lastName": "Anderson",
                "name": "Jason Anderson",
                "shareSongs": 54
            },
            {
                "userId": "",
                "fistName": "Magno",
                "lastName": "Dias",
                "name": "Magno Dias",
                "shareSongs": 1854
            }
        ]
    });
};