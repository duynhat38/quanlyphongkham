const jwt = require('../functions/jwt.js');
const User = require('../models/models.user');

module.exports.user = async function(req, res, next) {
    try {
        var token = req.headers['x-access-token'];
        // giải mã token
        var decodePayload = await jwt.decode(token)
        if (decodePayload.success) {
            const payload = decodePayload.decodePayload;
            const user = await User.findById(payload._id, ['_id', 'email', 'username'])
            if (user) {
                res.locals.user = user;
                next();
            } else {
                res.status(400).json({ error: true, message: 'Không tồn tại người dùng !!!' })
            }
        } else {
            res.status(400).json({ error: true, message: 'Failed to valid token !!!' })
        }
    } catch (err) { res.status(500).json({ error: true, message: 'Lỗi xác thực token !!!' }) }
}

module.exports.admin = async function(req, res, next) {
    try {
        var token = req.headers['x-access-token'];
        // giải mã token
        var decodePayload = await jwt.decode(token)
        if (decodePayload.success) {
            const payload = decodePayload.decodePayload;
            const user = await User.findById(payload._id, ['_id', 'email', 'username', 'role'])
            if (user) {
                if (user.role === 'admin') {
                    res.locals.user = user;
                    next();
                } else {
                    res.status(400).json({ error: true, message: 'Bạn không có quyền truy cập !!!' })
                }
            } else {
                res.status(400).json({ error: true, message: 'Không tồn tại người dùng !!!' })
            }
        } else {
            res.status(400).json({ error: true, message: 'Failed to valid token !!!' })
        }
    } catch (err) { res.status(500).json({ error: true, message: 'Lỗi xác thực token !!!' }) }
}