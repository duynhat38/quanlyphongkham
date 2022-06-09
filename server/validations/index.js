var validator = require('validator');

module.exports = {
    password: function(password) {
        var regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regExp.test(password)) {
            return { error: true, message: 'Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt!!!' };
        }
        return { success: true };
    },
    email: function(email) {
        if (!validator.isEmail(email)) {
            return { error: true, message: 'Email không đúng định dạng !!!' };
        }
        return { success: true };
    },
    phone: function(phone) {
        if (!validator.isMobilePhone(phone, ['vi-VN'])) {
            return { error: true, message: 'Số điện thoại không đúng định dạng !!!' };
        }
        return { success: true };
    },
    fullname: function(fullname) {
        if (!validator.isLength(fullname, { min: 3, max: 55 })) {
            return { error: true, message: 'Fullname phải có từ 3 - 55 ký tự !!!' };
        }
        return { success: true };
    },
    gender: function(gender) {
        const genders = ['Nam', 'Nu'];
        if (genders.includes(gender)) {
            return { success: true };
        }
        return { error: true, message: 'Giới tính không đúng định dạng !!!' };
    }
}