const Clinics = require('../models/models.clinics');
const Users = require('../models/models.users');

module.exports.all = async function(req, res) {
    try {
        const data = await Clinics.find({});
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.getClinic = async function(req, res) {
    try {
        const clinicId = req.params.clinicId;
        var data = await Clinics.findById(clinicId).populate({
            path: 'specialties',
            populate: {
                path: 'doctor',
                select: '-password'
            }
        }).populate('doctors', '-password').populate('receptionists', '-password').populate('pharmacists', '-password');
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.create = async function(req, res) {
    try {
        if (!req.body.address || !req.body.name) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        const clinic = new Clinics({
            name: req.body.name,
            address: req.body.address
        });
        const savedClinic = await clinic.save();
        if (savedClinic._id) {
            return res.status(200).json({ success: true, message: 'Tạo phòng khám thành công' });
        } else {
            return res.status(400).json({ error: true, message: 'Tạo phòng khám thất bại' });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.edit = async function(req, res) {
    try {
        if (!req.body.address || !req.body.name || !req.body.clinicId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var update = await Clinics.findByIdAndUpdate(req.body.clinicId, { name: req.body.name, address: req.body.address }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại phòng khám này' });
        }
        return res.status(200).json({ success: true, message: 'Cập nhật phòng khám thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.delete = async function(req, res) {
    try {
        if (!req.body.clinicId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var remove = await Clinics.findByIdAndDelete(req.body.clinicId);
        if (!remove) {
            return res.status(400).json({ error: true, message: 'Không tồn tại phòng khám này' });
        }
        return res.status(200).json({ success: true, message: 'Xoá phòng khám thành công' });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.addDoctor = async function(req, res) {
    try {
        const { doctorId, clinicId } = req.body;
        if (!doctorId || !clinicId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var doctor = await Users.findById(doctorId);
        if (!doctor || doctor.role != 'bacsi') {
            return res.status(400).json({ error: true, message: 'Không tồn tại bác sĩ' });
        }
        const clinic = await Clinics.findById(clinicId);
        if (clinic.doctors.includes(doctorId)) {
            return res.status(400).json({ error: true, message: 'Bác sĩ này đã có trong phòng khám' });
        }
        var update = await Clinics.findByIdAndUpdate(req.body.clinicId, { $push: { doctors: doctor } }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại phòng khám này' });
        }
        return res.status(200).json({ success: true, message: 'Thêm bác sĩ thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.deleteDoctor = async function(req, res) {
    try {
        const { doctorId, clinicId } = req.body;
        if (!doctorId || !clinicId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var update = await Clinics.findByIdAndUpdate(req.body.clinicId, { $pull: { doctors: doctorId } }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại phòng khám này' });
        }
        return res.status(200).json({ success: true, message: 'Xoá bác sĩ thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.addReceptionist = async function(req, res) {
    try {
        const { receptionistId, clinicId } = req.body;
        if (!receptionistId || !clinicId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var receptionist = await Users.findById(receptionistId);
        if (!receptionist || receptionist.role != 'tieptan') {
            return res.status(400).json({ error: true, message: 'Không tồn tại tiếp tân' });
        }
        const clinic = await Clinics.findById(clinicId);
        if (clinic.receptionists.includes(receptionistId)) {
            return res.status(400).json({ error: true, message: 'Tiếp tân này đã có trong phòng khám' });
        }
        var update = await Clinics.findByIdAndUpdate(req.body.clinicId, { $push: { receptionists: receptionist } }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại phòng khám này' });
        }
        return res.status(200).json({ success: true, message: 'Thêm tiếp tân thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.deleteReceptionist = async function(req, res) {
    try {
        const { receptionistId, clinicId } = req.body;
        if (!receptionistId || !clinicId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var update = await Clinics.findByIdAndUpdate(req.body.clinicId, { $pull: { receptionists: receptionistId } }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại phòng khám này' });
        }
        return res.status(200).json({ success: true, message: 'Xoá tiếp tân thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.addPharmacist = async function(req, res) {
    try {
        const { pharmacistId, clinicId } = req.body;
        if (!pharmacistId || !clinicId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var pharmacist = await Users.findById(pharmacistId);
        if (!pharmacist || pharmacist.role != 'duocsi') {
            return res.status(400).json({ error: true, message: 'Không tồn tại dược sĩ' });
        }
        const clinic = await Clinics.findById(clinicId);
        if (clinic.doctors.includes(pharmacistId)) {
            return res.status(400).json({ error: true, message: 'Dược sĩ này đã có trong phòng khám' });
        }
        var update = await Clinics.findByIdAndUpdate(req.body.clinicId, { $push: { pharmacists: pharmacist } }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại phòng khám này' });
        }
        return res.status(200).json({ success: true, message: 'Thêm dược sĩ thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.deletePharmacist = async function(req, res) {
    try {
        const { pharmacistId, clinicId } = req.body;
        if (!pharmacistId || !clinicId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var update = await Clinics.findByIdAndUpdate(req.body.clinicId, { $pull: { pharmacists: pharmacistId } }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại phòng khám này' });
        }
        return res.status(200).json({ success: true, message: 'Xoá dược sĩ thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.findClinicByReceptionist = async function(req, res) {
    try {
        const receptionistId = req.body.receptionistId;
        if (!receptionistId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin !!!' })
        }
        var data = await Clinics.findOne({ receptionists: receptionistId });
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}