const Users = require('../models/models.users');
const jwt = require('../functions/jwt.js');
const validations = require('../validations/index.js');

module.exports.auth = async function(req, res) {
    try {
        var token = req.headers['x-access-token'];
        var decodePayload = await jwt.decode(token);
        if (decodePayload.success) {
            const payload = decodePayload.decodePayload;
            const user = await Users.findById(payload._id, ['-password'])
            if (!user) {
                return res.status(400).json({ error: true, message: 'Không tồn tại người dùng !!!' })
            }
            return res.status(200).json({ success: true, user: user })
        } else {
            return res.status(400).json({ error: true, message: 'Phiên đăng nhập hết hạn !!!' })
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi khi lấy dữ liệu người dùng !!!' })
    }
}

module.exports.get_all_users = async function(req, res) {
    try {
        const data = await Users.find({}, ['-password']);
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi khi lấy dữ liệu người dùng !!!' })
    }
}

module.exports.change_password = async function(req, res) {
    try {
        if (!req.body.password || !req.body.password_new) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var valPassword = await validations.password(req.body.password_new);
        if (valPassword.error) {
            return res.status(400).json({ error: true, message: valPassword.message });
        }
        var token = req.headers['x-access-token'];
        var decodePayload = await jwt.decode(token);
        if (decodePayload.success) {
            const payload = decodePayload.decodePayload;
            var { password, password_new } = req.body;
            if (user) {
                user = await Users.findById(payload._id);
                const checkPassword = await user.validatePassword(password);
                if (checkPassword) {
                    const checkPasswordNew = await user.validatePassword(password_new);
                    if (checkPasswordNew) {
                        return res.status(200).json({ error: true, message: 'Mật khẩu trùng với mật khẩu hiện tại!!!' })
                    }
                    var update = await Users.findByIdAndUpdate(user._id, { password: password_new })
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
        } else {
            return res.status(400).json({ error: true, message: 'Failed to valid token !!!' })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi trong quá trình đổi mật khẩu !!!' });
    }
}

module.exports.getUser = async function(req, res) {
    try {
        const userId = req.params.userId;
        var user = await Users.findById(userId, ['-password']);;
        return res.status(200).json({ success: true, data: user })
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi khi lấy dữ liệu người dùng !!!' })
    }
}

module.exports.create = async function(req, res) {
    try {
        if (!req.body.email || !req.body.password || !req.body.fullname || !req.body.role) {
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
        var valFullname = await validations.fullname(req.body.fullname);
        if (valFullname.error) {
            return res.status(400).json({ error: true, message: valFullname.message });
        }
        var getUser = await Users.findOne({ email: req.body.email }).exec();
        if (!getUser) {
            const user = new Users({
                email: req.body.email,
                password: req.body.password,
                fullname: req.body.fullname,
                role: req.body.role
            });
            getUser = await user.save();
            if (!getUser) {
                return res.status(400).json({ error: true, message: 'Tạo account thất bại' });
            }
            return res.status(200).json({ success: true, message: 'Tạo account thành công' });
        } else {
            return res.status(400).json({ error: true, message: 'Email đã tồn tại' });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' });
    }
}

module.exports.edit = async function(req, res) {
    try {
        if (!req.body.userId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        if (req.body.password) {
            var valPassword = await validations.password(req.body.password);
            if (valPassword.error) {
                return res.status(400).json({ error: true, message: valPassword.message });
            }
        }
        if (req.body.fullname) {
            var valFullname = await validations.fullname(req.body.fullname);
            if (valFullname.error) {
                return res.status(400).json({ error: true, message: valFullname.message });
            }
        }
        var update = await Users.findByIdAndUpdate(req.body.userId, { fullname: req.body.fullname, role: req.body.role, password: req.body.password }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại người dùng này' });
        }
        return res.status(200).json({ success: true, message: 'Cập nhật thành công', data: update });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.delete = async function(req, res) {
    try {
        if (!req.body.userId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var remove_account = await Users.findByIdAndDelete(req.body.userId);
        if (!remove_account) {
            return res.status(400).json({ error: true, message: 'Không tồn tại account' });
        }
        return res.status(200).json({ success: true, message: 'Xoá account thành công' });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.getDoctors = async function(req, res) {
    try {
        const data = await Users.find({ role: 'bacsi' }, ['-password']);
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi khi lấy dữ liệu người dùng !!!' })
    }
}

module.exports.getReceptionists = async function(req, res) {
    try {
        const data = await Users.find({ role: 'tieptan' }, ['-password']);
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi khi lấy dữ liệu người dùng !!!' })
    }
}

module.exports.getPharmacists = async function(req, res) {
    try {
        const data = await Users.find({ role: 'duocsi' }, ['-password']);
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Xảy ra lỗi khi lấy dữ liệu người dùng !!!' })
    }
}