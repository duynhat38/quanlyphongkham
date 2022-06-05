const Users = require('../models/models.users');
const jwt = require('../functions/jwt.js');
const validations = require('../validations/index.js');
const Token = require("../models/models.tokens");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const config = require('./../config');

module.exports.register = async function(req, res) {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var valEmail = await validations.email(req.body.email);
        if (valEmail.error) {
            return res.status(400).json({ error: true, message: valEmail.message });
        }
        var valPassword = await validations.password(req.body.password);
        if (valPassword.error) {
            return res.status(400).json({ error: true, message: valPassword.message });
        }
        const searchEmail = await Users.findOne({ email: req.body.email }).exec();
        if (searchEmail) {
            return res.status(400).json({ error: true, message: 'Email này đã tồn tại !!!' });
        }
        const user = new Users({
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            fullname: req.body.fullname,
            role: 'benhnhan'
        });
        const savedUser = await user.save();
        if (savedUser._id) {
            return res.status(200).json({ success: true, message: 'Đăng ký thành công' });
        } else {
            return res.status(400).json({ error: true, message: 'Đăng ký thất bại' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi trong quá trình đăng ký !!!' });
    }
}

module.exports.login = async function(req, res) {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var valEmail = await validations.email(req.body.email);
        if (valEmail.error) {
            return res.status(400).json({ error: true, message: valEmail.message });
        }
        var valPassword = await validations.password(req.body.password);
        if (valPassword.error) {
            return res.status(400).json({ error: true, message: valPassword.message });
        }
        const user = await Users.findOne({ email: req.body.email }).exec();
        if (user) {
            if (!user.password || user.password == undefined || user.password == null) {
                return res.status(400).send({ error: true, message: 'Mật khẩu chưa được tạo !!!' });
            }
            const passwordsuccess = await user.validatePassword(req.body.password);
            if (passwordsuccess) {
                const json_user = JSON.parse(JSON.stringify(user));
                delete json_user["password"]
                var token = await jwt.encode(json_user);
                if (!token) {
                    return res.status(400).json({ error: true, message: 'Token không tồn tại !!!' });
                }
                return res.status(200).json({ success: true, message: 'Đăng nhập thành công', token: token, user: json_user })
            } else {
                return res.status(400).send({ error: true, message: 'Sai mật khẩu !!!' });
            }
        } else {
            return res.status(400).send({ error: true, message: 'Tài khoản chưa tồn tại !!!' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi trong quá trình đăng nhập !!!' });
    }
}

module.exports.forgot_password = async function(req, res) {
    try {
        if (!req.body.email) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var valEmail = await validations.email(req.body.email);
        if (valEmail.error) {
            return res.status(400).json({ error: true, message: valEmail.message });
        }
        const user = await Users.findOne({ email: req.body.email }).exec();
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
            await sendEmail.forgot_password(user.email, link);
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
        var valPassword = await validations.password(req.body.password);
        if (valPassword.error) {
            return res.status(400).json({ error: true, message: valPassword.message });
        }
        const user = await Users.findById(req.body.userId).exec();
        if (user) {
            let check = await Token.findOne({ userId: user._id, token: req.body.token });
            if (!check) {
                return res.status(400).send({ error: true, message: 'Liên kết không hợp lệ hoặc đã hết hạn!!!' });
            }
            await Users.findByIdAndUpdate(req.body.userId, { password: req.body.password })
            await check.delete();
            return res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công' });
        } else {
            return res.status(400).send({ error: true, message: 'Liên kết không hợp lệ hoặc đã hết hạn!!!' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi trong quá trình reset mật khẩu!!!' });
    }
}