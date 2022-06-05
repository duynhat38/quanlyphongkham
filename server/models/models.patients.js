var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PatientsSchema = new Schema({
    identity_card: {
        type: Number,
        required: [true, "Không tồn tại CMND"],
        index: true,
        unique: [true, "CMND này đã tồn tại"],
    },
    fullname: {
        type: String,
        required: [true, "Không tồn tại fullname"]
    },
    phone: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Nam', 'Nu']
    },
    address: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    }
}, { timestamps: true, collection: 'Patients' });

module.exports = mongoose.model('Patients', PatientsSchema);