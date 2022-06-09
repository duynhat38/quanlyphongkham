var jwt = require('jsonwebtoken');
var config = require('./../config');

module.exports = {
    encode: async function(payload) {
        var token = await jwt.sign(payload, config.secretKey, { expiresIn: '1d' });
        return token;
    },
    decode: async function(token) {
        var res = await jwt.verify(token, config.secretKey, function(err, decoded) {
            if (err) {
                return { success: false, message: 'Failed to authenticate token.' };
            } else {
                return { success: true, message: 'Authenticate token.', decodePayload: decoded };
            }
        });
        return res;
    }
}