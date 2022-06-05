var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookingsSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'Không tồn tại Email'
    },
    fullname: {
        type: String
    },
    phone: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Nam', 'Nu']
    },
    status: {
        type: String,
        enum: ['New', 'Confirmed', 'Wait', 'Done', 'Cancel'],
        required: [true, "Không tồn tại status"],
        default: 'New'
    },
    date: {
        type: Date,
        required: [true, "Không tồn tại date"],
    },
    reason: {
        type: String
    },
    clinic: {
        type: Schema.Types.ObjectId,
        ref: 'Clinics',
        required: [true, "Không tồn tại clinicId"],
    },
    token: {
        type: String
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patients",
    },
    specialty: {
        type: Schema.Types.ObjectId,
        ref: "Specialties"
    },
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'Services'
    }],
    payment_price: {
        type: Number,
        default: 0
    },
    payment: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, collection: 'Bookings' });

module.exports = mongoose.model('Bookings', BookingsSchema);