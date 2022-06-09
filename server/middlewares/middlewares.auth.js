const jwt = require('../functions/jwt.js');
const Users = require('../models/models.users');

module.exports.authPermission = permission => {
    return async(req, res, next) => {
        try {
            var token = req.headers['x-access-token'];
            var decodePayload = await jwt.decode(token);
            if (decodePayload.success) {
                const payload = decodePayload.decodePayload;
                const user = await Users.findById(payload._id, ['_id', 'email', 'role'])
                if (!user) {
                    return res.status(400).json({ error: true, message: 'Không tồn tại người dùng !!!' })
                }
                if (permission.includes(user.role)) {
                    res.locals.user = user;
                    next();
                } else {
                    return res.status(400).json({ error: true, message: 'Bạn không có quyền truy cập !!!' })
                }
            } else {
                return res.status(400).json({ error: true, message: 'Phiên đăng nhập hết hạn !!!' })
            }
        } catch (err) { return res.status(500).json({ error: true, message: 'Error xác thực phiên đăng nhập !!!' }) }
    }
}