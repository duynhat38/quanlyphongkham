const Medicines = require('../models/models.medicines');

module.exports.all = async function(req, res) {
    try {
        const data = await Medicines.find({});
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.getMedicine = async function(req, res) {
    try {
        const medicineId = req.params.medicineId;
        var data = await Medicines.findById(medicineId);
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.create = async function(req, res) {
    try {
        const { name, unit, price, import_price } = req.body;
        if (!name || !unit || !price || !import_price) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var isMedicine = await Medicines.findOne({ name: req.body.name }).exec();
        if (isMedicine) {
            return res.status(400).json({ error: true, message: 'Tên thuốc này đã tồn tại' });
        }
        const medicine = new Medicines({
            name: name,
            unit: unit,
            price: price,
            import_price: import_price
        });
        const savedMedicine = await medicine.save();
        if (savedMedicine._id) {
            return res.status(200).json({ success: true, message: 'Lưu thuốc thành công' });
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
        const { medicineId, unit, price, import_price } = req.body;
        if (!medicineId || !unit || !price || !import_price) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var update = await Medicines.findByIdAndUpdate(medicineId, {
            unit: unit,
            price: price,
            import_price: import_price
        }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại thuốc này' });
        }
        return res.status(200).json({ success: true, message: 'Cập nhật thuốc thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.import = async function(req, res) {
    try {
        const { medicineId, amount } = req.body;
        if (!medicineId || !amount) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var update = await Medicines.findByIdAndUpdate(medicineId, { $inc: { amount: amount } }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại thuốc này' });
        }
        return res.status(200).json({ success: true, message: 'Cập nhật thuốc thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.delete = async function(req, res) {
    try {
        if (!req.body.medicineId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var remove = await Medicines.findByIdAndDelete(req.body.medicineId);
        if (!remove) {
            return res.status(400).json({ error: true, message: 'Không tồn tại thuốc này' });
        }
        return res.status(200).json({ success: true, message: 'Xoá thuốc thành công' });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}