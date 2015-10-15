var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        
        try { //TEMP: troca por validação de token
            
            var decoded = jwt.decode(bearerToken, { complete: true });
            var uid = decoded.payload.uid;

        } catch (error) {
            return res.status(403).end();
        }

        next();
    } else {
        res.send(403);
    }
}