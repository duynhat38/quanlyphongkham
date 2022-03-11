const User = require('../models/models.user');
const bcrypt = require('bcrypt');
const hashPassword = require('../functions/hashPassword');

module.exports.index = async function(req, res) {
    try {
        const user = res.locals.user;
        if (user._id) {
            return res.status(200).json({ success: true, user: user })
        } else {
            return res.status(400).json({ error: true, message: 'Không tồn tại dữ liệu người dùng !!!' })
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi khi lấy dữ liệu người dùng !!!' })
    }
}

module.exports.get_all_users = async function(req, res) {
    try {
        const user = res.locals.user;
        if (user._id && user.role === 'admin') {
            const data = await User.find({}, ['-hashedPassword']);
            return res.status(200).json({ success: true, data: data })
        } else {
            return res.status(400).json({ error: true, message: 'Bạn không có quyền thực hiện !!!' })
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi khi lấy dữ liệu người dùng !!!' })
    }
}

module.exports.delete_user = async function(req, res) {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const user = res.locals.user;
        const userId = data.userId;
        if (user._id && user.role === 'admin') {
            var delete_user = await User.findByIdAndDelete(userId);
            if (delete_user) {
                return res.status(200).json({ success: true, message: 'Xoá thành công người dùng' })
            } else {
                return res.status(400).json({ error: true, message: 'Xoá người dùng thất bại !!!' })
            }
        } else {
            return res.status(400).json({ error: true, message: 'Bạn không có quyền thực hiện !!!' })
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi khi lấy dữ liệu người dùng !!!' })
    }
}

module.exports.change_password = async function(req, res) {
    try {
        var user = res.locals.user;
        const data = JSON.parse(JSON.stringify(req.body));
        const password = data.password;
        const password_new = data.password_new;
        if (user) {
            user = await User.findById(user._id);
            const hashedPassword = user.hashedPassword;
            const checkPassword = await bcrypt.compareSync(password, hashedPassword);
            if (checkPassword) {
                const checkPasswordNew = await bcrypt.compareSync(password_new, hashedPassword);
                if (checkPasswordNew) {
                    return res.status(200).json({ error: true, message: 'Mật khẩu trùng với mật khẩu hiện tại!!!' })
                }
                var update = await User.findByIdAndUpdate(user._id, { $set: { hashedPassword: await hashPassword(password_new) } })
                if (update) {
                    return res.status(200).json({ success: true, message: 'Đổi mật khẩu mới thành công' })
                } else {
                    return res.status(400).json({ error: true, message: 'Đổi mật khẩu thất bại' })
                }
            } else {
                return res.status(400).send({ error: true, message: 'Sai mật khẩu cũ !!!' });
            }
        } else {
            return res.status(400).send({ error: true, message: 'Tài khoản chưa tồn tại !!!' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi trong quá trình đổi mật khẩu !!!' });
    }
}