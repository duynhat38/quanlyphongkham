var jwt = require('jsonwebtoken');
var config = require('./../config');

module.exports = {
    encode: function(payload) {
        var token = jwt.sign(payload, config.secretKey, { expiresIn: '7d' });
        return token;
    },
    decode: function(token) {
        var res = jwt.verify(token, config.secretKey, function(err, decoded) {
            if (err) {
                return { success: false, message: 'Failed to authenticate token.' };
            } else {
                return { success: true, message: 'Authenticate token.', decodePayload: decoded };
            }
        });
        return res;
    }
}