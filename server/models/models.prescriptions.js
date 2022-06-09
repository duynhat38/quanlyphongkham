var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PrescriptionsSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patients",
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    medicines: [{
        medicineId: {
            type: Schema.Types.ObjectId,
            ref: "Medicines",
        },
        guide: {
            type: String,
            trim: true
        },
        amount: {
            type: Number
        }
    }],
    diagnose: {
        type: String,
        trim: true
    },
    advice: {
        type: String,
        trim: true
    }
}, { timestamps: true, collection: 'Prescriptions' });

module.exports = mongoose.model('Prescriptions', PrescriptionsSchema);