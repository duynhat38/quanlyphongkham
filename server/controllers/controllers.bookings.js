const Bookings = require('../models/models.bookings');
const Clinics = require('../models/models.clinics');
const Patients = require('../models/models.patients');
const Users = require('../models/models.users');
const Token = require("../models/models.tokens");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const config = require('./../config');
const mongoose = require("mongoose");
const moment = require('moment')

module.exports.all = async function(req, res) {
    try {
        const { clinicId } = req.body;
        const today = moment().startOf('day')
        var data = await Bookings.find({
            date: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            },
            clinic: clinicId
        }).select('-token').populate(['clinic', 'patient', 'services', 'specialty']);
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.getAllBookingsBySpecialty = async function(req, res) {
    try {
        const { specialtyId } = req.body;
        const today = moment().startOf('day')
        var data = await Bookings.find({
            date: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            },
            specialty: specialtyId,
            status: 'Wait'
        }).select('-token').populate(['clinic', 'patient', 'services', 'specialty']);
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.getBooking = async function(req, res) {
    try {
        const bookingId = req.params.bookingId;
        var data = await Bookings.findById(bookingId).select('-token').populate(['clinic', 'patient', 'services', 'specialty']);
        return res.status(200).json({ success: true, data: data })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.create = async function(req, res) {
    try {
        const { fullname, phone, email, gender, date, reason, clinicId, status } = req.body;
        if (!fullname || !phone || !email || !gender || !date || !clinicId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var clinic = await Clinics.findById(clinicId);
        if (!clinic) {
            return res.status(400).json({ error: true, message: 'Không tồn tại phòng khám' });
        }
        var checkBooking = await Bookings.findOne({ email: email, date: date });
        var link = '';
        if (!checkBooking) {
            const token = crypto.randomBytes(32).toString("hex");
            const booking = new Bookings({
                fullname: fullname,
                phone: phone,
                email: email,
                gender: gender,
                date: date,
                reason: reason,
                clinic: clinicId,
                token: token,
                status: status
            });
            const savedBooking = await booking.save();
            link = `${config.BASE_URL_CLIENT}/very-booking/${savedBooking._id}/${token}`;
        } else {
            if (checkBooking.status != 'NEW') {
                return res.status(200).json({ success: true, message: 'Bạn đã đặt lịch khám trước đó và đã được xác nhận !!!' });
            }
            link = `${config.BASE_URL_CLIENT}/very-booking/${checkBooking._id}/${checkBooking.token}`;
        }
        console.log(link);
        if (status == 'Confirmed') {
            return res.status(200).json({ success: true, message: 'Đặt lịch khám thành công !!!' });
        }
        await sendEmail.very_booking(email, link, fullname, date, clinic.name, clinic.address);
        return res.status(200).json({ success: true, message: 'Vui lòng xác nhận thông tin lịch khám trong email của bạn !!!' });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.very = async function(req, res) {
    try {
        const { bookingId, token } = req.body;
        if (!bookingId || !token) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var update = await Bookings.findOneAndUpdate({ _id: bookingId, token: token }, { status: 'Confirmed' }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại lịch khám' });
        }
        return res.status(200).json({ success: true, message: 'Xác nhận thành công lịch khám' });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.edit = async function(req, res) {
    try {
        const { bookingId, status, date, reason, clinicId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var update = await Bookings.findByIdAndUpdate(bookingId, { status: status, date: date, reason: reason, clinic: clinicId }, { new: true });
        if (!update) {
            return res.status(400).json({ error: true, message: 'Không tồn tại lịch khám' });
        }
        return res.status(200).json({ success: true, message: 'Cập nhật lịch khám thành công', data: update });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.delete = async function(req, res) {
    try {
        if (!req.body.bookingId) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var remove = await Bookings.findByIdAndDelete(req.body.bookingId);
        if (!remove) {
            return res.status(400).json({ error: true, message: 'Không tồn tại lịch khám' });
        }
        return res.status(200).json({ success: true, message: 'Xoá lịch khám thành công' });
    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}

module.exports.healthcare = async function(req, res) {
    try {
        const { bookingId, fullname, phone, email, gender, identity_card, address, clinicId, specialtyId, services, payment_price } = req.body;
        if (!bookingId || !fullname || !phone || !email || !gender || !identity_card || !clinicId || !address || !specialtyId || !services || !payment_price) {
            return res.status(400).json({ error: true, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var patient = await Patients.findOne({ identity_card: identity_card }).exec();
        if (!patient) {
            const patientSaved = new Patients({
                identity_card: identity_card,
                fullname: fullname,
                phone: phone,
                gender: gender,
                address: address,
                email: email
            });
            patient = await patientSaved.save();
        }
        if (!patient) {
            return res.status(400).json({ error: true, message: 'Không tạo được dữ liệu bệnh nhân!' });
        }
        var booking = await Bookings.findByIdAndUpdate(bookingId, {
            patient: patient,
            clinic: clinicId,
            specialty: specialtyId,
            services: services,
            payment_price: payment_price,
            payment: true,
            status: 'Wait'
        }, { new: true });
        return res.status(200).json({ success: true, message: 'Tạo phiếu khám thành công!!!' });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}