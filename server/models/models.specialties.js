var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SpecialtiesSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: [true, "Tên chuyên khoa này đã tồn tại"],
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "Users",
    }
}, { timestamps: true, collection: 'Specialties' });

module.exports = mongoose.model('Specialties', SpecialtiesSchema);