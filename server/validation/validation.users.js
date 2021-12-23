var validator = require('validator');

module.exports.change_password = async function(req, res, next) {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const password = data.password;
        const password_new = data.password_new;
        var regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regExp.test(password)) {
            return res.status(400).json({ error: true, message: 'Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt!!!' });
        }
        if (!regExp.test(password_new)) {
            return res.status(400).json({ error: true, message: 'Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt!!!' });
        }
        next();
    } catch (err) {
        return res.status(400).json({ error: true, message: 'Lỗi xác thực !!!' });
    }
}