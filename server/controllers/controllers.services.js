const Services = require('../models/models.services');

module.exports.all = async function(req, res) {
    try {
        const data = await Services.find({});
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.getService = async function(req, res) {
    try {
        const serviceId = req.params.serviceId;
        var data = await Services.findById(serviceId);
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
        var isService = await Services.findOne({ name: req.body.name }).exec();
        if (isService) {
            return res.status(400).json({ error: true, message: 'Dịch vụ này đã tồn tại' });
        }
        const service = new Services({
            name: req.body.name,
            price: req.body.price
        });
        const savedService = await service.save();
        if (savedService._id) {
            return res.status(200).json({ success: true, message: 'Tạo dịch vụ thành công' });
        } else {
            return res.status(400).json({ error: true, message: 'Tạo dịch vụ thất bại' });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.edit = async function(req, res) {
    try {
        if (!req.body.name || !req.body.serviceId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var update = await Services.findByIdAndUpdate(req.body.serviceId, { name: req.body.name, price: req.body.price }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại dịch vụ này' });
        }
        return res.status(200).json({ success: true, message: 'Cập nhật dịch vụ thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.delete = async function(req, res) {
    try {
        if (!req.body.serviceId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var remove = await Services.findByIdAndDelete(req.body.serviceId);
        if (!remove) {
            return res.status(400).json({ error: true, message: 'Không tồn tại dịch vụ này' });
        }
        return res.status(200).json({ success: true, message: 'Xoá dịch vụ thành công' });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}