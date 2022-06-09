var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ServicesSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: [true, "Tên dịch vụ này đã tồn tại"],
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price limit min 0'],
        max: [99999999, 'Price limit max 99999999']
    }
}, { timestamps: true, collection: 'Services' });

module.exports = mongoose.model('Services', ServicesSchema);