var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MedicinesSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: [true, "Tên thuốc này đã tồn tại"]
    },
    unit: {
        type: String,
        required: true,
        enum: ['Viên', 'Gói', 'Hộp']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    import_price: {
        type: Number,
        required: true,
        min: 0
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true, collection: 'Medicines' });

module.exports = mongoose.model('Medicines', MedicinesSchema);