const Patients = require('../models/models.patients');

module.exports.all = async function(req, res) {
    try {
        const data = await Patients.find({});
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.getPatient = async function(req, res) {
    try {
        const patientId = req.params.patientId;
        var data = await Patients.findById(patientId);
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.create = async function(req, res) {
    try {
        const { identity_card, fullname, phone, gender, address } = req.body;
        if (!fullname || !phone || !gender || !identity_card || !address) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var isPatient = await Patients.findOne({ identity_card: identity_card }).exec();
        if (isPatient) {
            return res.status(400).json({ error: true, message: 'Bệnh nhân này đã tồn tại' });
        }
        const patient = new Patients({
            identity_card: identity_card,
            fullname: fullname,
            phone: phone,
            gender: gender,
            address: address
        });
        const savedPatient = await patient.save();
        if (savedPatient._id) {
            return res.status(200).json({ success: true, message: 'Tạo bệnh nhân thành công' });
        } else {
            return res.status(400).json({ error: true, message: 'Tạo bệnh nhân thất bại' });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.edit = async function(req, res) {
    try {
        const { identity_card, fullname, phone, gender, address } = req.body;
        if (!fullname || !phone || !gender || !identity_card || !address) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var update = await Patients.findOneAndUpdate(req.body.identity_card, { fullname: fullname, phone: phone, gender: gender, address: address }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại bệnh nhân này' });
        }
        return res.status(200).json({ success: true, message: 'Cập nhật bệnh nhân thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.delete = async function(req, res) {
    try {
        if (!req.body.patientId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var remove = await Patients.findByIdAndDelete(req.body.patientId);
        if (!remove) {
            return res.status(400).json({ error: true, message: 'Không tồn tại bệnh nhân này' });
        }
        return res.status(200).json({ success: true, message: 'Xoá bệnh nhân thành công' });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}