var mongoose = require('mongoose'),
    Music = mongoose.model('Music'),
    userController = require('./user.js');
var jwt = require('jsonwebtoken');

Array.prototype.getUnique = function () {
    var u = {}, a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}

exports.addArray = function (musicOneDrive, callback) {
    
    Music.collection.deleteMany({ sharedBy : musicOneDrive[0].sharedBy },
      function (errorA, results) {
        
        Music.create(musicOneDrive, function (error, result) {
            callback(error, result);
        });
    });
};

exports.allArtist = function (req, res) {
    
    Music.collection.distinct('artist', function (err, docs) {
        return res.status(200).json({ result: docs.getUnique().sort() });
    });
};
exports.createSession = function (req, res) {
    
    req.assert('artists', ['ARTISTAS_OBRIGATÓRIO', 1110]).isArray();
    
    var errors = req.validationErrors();
    if (errors) {
        res.status(500).json(errors);
        return;
    }
    
    var decoded = jwt.decode(req.token, { complete: true });
    
    userController.findByUid(decoded.payload.uid, null, null, function (err, result) {
        
        var uidUsers = [], random = null, query;
        
        var followUsers = result.follow;
        for (var i = 0, len = followUsers.length; i < len; i++) {
            uidUsers[i] = followUsers[i]._id;
        }
        uidUsers[followUsers.length] = result._id;
        
        query = { sharedBy: { $in: uidUsers }, artist: { $in: req.body.artists } };
        //query = { sharedBy: { $in: uidUsers }, $or: [{ albumArtist: { $in: req.body.artists }, artist: { $in: req.body.artists } }] };
        
        Music.count(query, function (err, count) {
            random = Math.floor(Math.random() * count);
            Music.collection.find(query, { skip: random, limit: 10 }).toArray(function (err, docs) {
                
                //docs.length
                return res.status(201).json(docs);
            });
        });
    });
};