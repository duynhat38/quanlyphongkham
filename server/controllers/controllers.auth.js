const User = require('../models/models.user');
const jwt = require('../functions/jwt.js');
const bcrypt = require('bcrypt');
const hashPassword = require('../functions/hashPassword');
const Token = require("../models/models.token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const config = require('./../config');
const { token } = require('morgan');

module.exports.register = async function(req, res) {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const searchUser = await User.findOne({ username: data.username }).exec();
        if (searchUser) {
            return res.status(400).json({ error: true, message: 'Tài khoản này đã tồn tại !!!' });
        }
        const searchEmail = await User.findOne({ email: data.email }).exec();
        if (searchEmail) {
            return res.status(400).json({ error: true, message: 'Email này đã tồn tại !!!' });
        }
        const user = new User({
            username: data.username,
            email: data.email,
            hashedPassword: await hashPassword(data.password),
            phone: data.phone,
            address: data.address
        });
        const savedUser = await user.save();
        if (savedUser._id) {
            return res.status(200).json({ success: true, message: 'Đăng ký thành công' });
        } else {
            return res.status(400).json({ error: true, message: 'Đăng ký thất bại' });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi trong quá trình đăng ký !!!' });
    }
}

module.exports.login = async function(req, res) {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const user = await User.findOne({ username: data.username }).exec();
        if (user) {
            const hashedPassword = user.hashedPassword;
            const passwordsuccess = await bcrypt.compareSync(data.password, hashedPassword);
            if (passwordsuccess) {
                const json_user = JSON.parse(JSON.stringify(user));
                delete json_user["hashedPassword"]
                var token = jwt.encode(json_user);
                if (!token) {
                    return res.status(400).json({ error: true, message: 'Lỗi xác thực !!!' });
                }
                return res.status(200).json({ success: true, message: 'Đăng nhập thành công', token: token, user: json_user })
            } else {
                return res.status(400).send({ error: true, message: 'Sai mật khẩu !!!' });
            }
        } else {
            return res.status(400).send({ error: true, message: 'Tài khoản chưa tồn tại !!!' });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi trong quá trình đăng nhập !!!' });
    }
}

module.exports.forgot_password = async function(req, res) {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const email = data.email;
        const user = await User.findOne({ email: email }).exec();
        if (user) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
            }
            const link = `${config.BASE_URL_CLIENT}/reset-password/${user._id}/${token.token}`;
            console.log(link);
            await sendEmail(user.email, "Password reset", link);
            return res.status(200).json({ success: true, message: 'Liên kết đặt lại mật khẩu được gửi đến tài khoản email của bạn' });
        } else {
            return res.status(400).send({ error: true, message: 'Tài khoản chưa tồn tại !!!' });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi trong quá trình reset mật khẩu !!!' });
    }
}

module.exports.reset_password = async function(req, res) {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const password = data.password;
        const userId = data.userId;
        const token = data.token;
        const user = await User.findById(userId).exec();
        if (user) {
            let check = await Token.findOne({ userId: user._id, token: token });
            if (!check) {
                return res.status(400).send({ error: true, message: 'Liên kết không hợp lệ hoặc đã hết hạn!!!' });
            }
            await User.findByIdAndUpdate(userId, { $set: { hashedPassword: await hashPassword(password) } })
            await check.delete();
            return res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công' });
        } else {
            return res.status(400).send({ error: true, message: 'Liên kết không hợp lệ hoặc đã hết hạn!!!' });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi trong quá trình reset mật khẩu!!!' });
    }
}