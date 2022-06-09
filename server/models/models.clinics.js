var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClinicsSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    specialties: [{
        type: Schema.Types.ObjectId,
        ref: "Specialties",
    }],
    doctors: [{
        type: Schema.Types.ObjectId,
        ref: "Users",
    }],
    receptionists: [{
        type: Schema.Types.ObjectId,
        ref: "Users",
    }],
    pharmacists: [{
        type: Schema.Types.ObjectId,
        ref: "Users",
    }],
}, { timestamps: true, collection: 'Clinics' });

module.exports = mongoose.model('Clinics', ClinicsSchema);