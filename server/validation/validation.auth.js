var validator = require('validator');

module.exports.register = async function(req, res, next) {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const username = data.username;
        const password = data.password;
        const email = data.email;
        const phone = data.phone;
        var regExp = /^[a-z0-9]+$/;
        if (!regExp.test(username)) {
            return res.status(400).json({ error: true, message: 'Username không hợp lệ!!!' });
        }
        if (!validator.isLength(username, { min: 6, max: 25 })) {
            return res.status(400).json({ error: true, message: 'Username chỉ có từ 6 - 25 ký tự !!!' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: true, message: 'Email không đúng định dạng !!!' });
        }
        var regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regExp.test(password)) {
            return res.status(400).json({ error: true, message: 'Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt!!!' });
        }
        if (phone != null && phone != "") {
            if (!validator.isMobilePhone(phone, ['vi-VN'])) {
                return res.status(400).json({ error: true, message: 'Số điện thoại không đúng định dạng !!!' });
            }
        }
        next();
    } catch (err) {
        return res.status(400).json({ error: true, message: 'Lỗi xác thực !!!' });
    }
}

module.exports.login = async function(req, res, next) {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const password = data.password;
        const username = data.username;
        var regExp = /^[a-z0-9]+$/;
        if (!regExp.test(username)) {
            return res.status(400).json({ error: true, message: 'Username không hợp lệ!!!' });
        }
        if (!validator.isLength(username, { min: 6, max: 25 })) {
            return res.status(400).json({ error: true, message: 'Username chỉ có từ 6 - 25 ký tự !!!' });
        }
        var regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regExp.test(password)) {
            return res.status(400).json({ error: true, message: 'Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt!!!' });
        }
        next();
    } catch (err) {
        return res.status(400).json({ error: true, message: 'Lỗi xác thực !!!' });
    }
}

module.exports.forgot_password = async function(req, res, next) {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const email = data.email;
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: true, message: 'Email không đúng định dạng !!!' });
        }
        next();
    } catch (err) {
        return res.status(400).json({ error: true, message: 'Lỗi xác thực !!!' });
    }
}

module.exports.reset_password = async function(req, res, next) {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const password = data.password;
        var regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regExp.test(password)) {
            return res.status(400).json({ error: true, message: 'Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt!!!' });
        }
        next();
    } catch (err) {
        return res.status(400).json({ error: true, message: 'Lỗi xác thực !!!' });
    }
}