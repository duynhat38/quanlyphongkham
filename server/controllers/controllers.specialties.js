const Specialties = require('../models/models.specialties');
const Clinics = require('../models/models.clinics');
const Users = require('../models/models.users');

module.exports.all = async function(req, res) {
    try {
        const data = await Specialties.find({});
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.getSpecialty = async function(req, res) {
    try {
        const specialtyId = req.params.specialtyId;
        var data = await Specialties.findById(specialtyId).populate('doctor');
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.create = async function(req, res) {
    try {
        if (!req.body.name) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        const specialty = new Specialties({
            name: req.body.name
        });
        const savedSpecialty = await specialty.save();
        var add_specialty = await Clinics.findByIdAndUpdate(req.body.clinicId, { $push: { specialties: savedSpecialty } })
        if (add_specialty) {
            return res.status(200).json({ success: true, message: 'Tạo chuyên khoa thành công' });
        } else {
            return res.status(400).json({ error: true, message: 'Tạo chuyên khoa thất bại' });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.edit = async function(req, res) {
    try {
        if (!req.body.name || !req.body.specialtyId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var doctor = await Users.findById(req.body.doctorId);
        if (!doctor) {
            return res.status(400).json({ error: true, message: 'Không tồn tại bác sĩ này' });
        }
        if (doctor.role != 'bacsi') {
            return res.status(400).json({ error: true, message: 'Người dùng này không phải bác sĩ' });
        }
        var isCheck = await Specialties.findOne({ doctor: req.body.doctorId });
        if (isCheck) {
            return res.status(400).json({ error: true, message: 'Bác Sĩ này đang làm việc ở chuyên khoa ' + isCheck.name });
        }
        var update = await Specialties.findByIdAndUpdate(req.body.specialtyId, { name: req.body.name, doctor: req.body.doctorId }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại chuyên khoa này' });
        }
        return res.status(200).json({ success: true, message: 'Cập nhật chuyên khoa thành công', data: update });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.delete = async function(req, res) {
    try {
        if (!req.body.specialtyId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var del_in_array = await Clinics.findByIdAndUpdate(req.body.clinicId, { $pull: { specialties: req.body.specialtyId } }, { new: true });
        if (!del_in_array) {
            return res.status(400).json({ error: true, message: 'Không tồn tại chuyên khoa này trong phòng khám' });
        }
        var remove = await Specialties.findByIdAndDelete(req.body.specialtyId);
        if (!remove) {
            return res.status(400).json({ error: true, message: 'Không tồn tại chuyên khoa này' });
        }
        return res.status(200).json({ success: true, message: 'Xoá chuyên khoa thành công' });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.findSpecialtyByDoctor = async function(req, res) {
    try {
        const doctorId = req.body.doctorId;
        if (!doctorId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin !!!' })
        }
        var data = await Specialties.findOne({ doctor: doctorId });
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}