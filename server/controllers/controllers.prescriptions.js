const Prescriptions = require('../models/models.prescriptions');

module.exports.all = async function(req, res) {
    try {
        const data = await Prescriptions.find({});
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.getPrescription = async function(req, res) {
    try {
        const prescriptionId = req.params.prescriptionId;
        var data = await Prescriptions.findById(prescriptionId);
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.getPrescriptionsOfPatient = async function(req, res) {
    try {
        const patientId = req.body.patientId;
        var data = await Prescriptions.find({ patient: patientId });
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.create = async function(req, res) {
    try {
        const { patientId, doctorId, medicines, diagnose, advice } = req.body;
        if (!patientId || !doctorId || medicines.length <= 0) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        const Prescription = new Prescriptions({
            patient: patientId,
            doctor: doctorId,
            medicines: medicines,
            diagnose: diagnose,
            advice: advice
        });
        const savedPrescription = await Prescription.save();
        if (savedPrescription._id) {
            return res.status(200).json({ success: true, message: 'Lưu đơn thuốc thành công' });
        } else {
            return res.status(400).json({ error: true, message: 'Lưu thuốc thất bại' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.edit = async function(req, res) {
    try {
        const { prescriptionId, medicines, diagnose, advice } = req.body;
        if (!prescriptionId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var update = await Prescriptions.findByIdAndUpdate(prescriptionId, {
            medicines: medicines,
            diagnose: diagnose,
            advice: advice
        }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại đơn thuốc này' });
        }
        return res.status(200).json({ success: true, message: 'Cập nhật đơn thuốc thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.delete = async function(req, res) {
    try {
        if (!req.body.prescriptionId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var remove = await Prescriptions.findByIdAndDelete(req.body.prescriptionId);
        if (!remove) {
            return res.status(400).json({ error: true, message: 'Không tồn tại đơn thuốc này' });
        }
        return res.status(200).json({ success: true, message: 'Xoá đơn thuốc thành công' });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}