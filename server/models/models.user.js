var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        unique: [true, "Username này đã tồn tại"],
        required: [true, "Không tồn tại username"],
        trim: true,
        lowercase: true,
        min: [6, 'Username phải có ít nhất 6 ký tự'],
        max: [25, 'Username vượt quá giới hạn 25 ký tự'],
        match: [/^[a-z0-9]+$/, "is invalid"],
        index: true
    },
    email: {
        type: String,
        unique: [true, "Email này đã tồn tại"],
        required: [true, "Không tồn tại email"],
        min: [6, 'Email phải có ít nhất 6 ký tự'],
        max: [55, 'Email vượt quá giới hạn 55 ký tự'],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "is invalid"],
        index: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    hashedPassword: {
        type: String,
        required: [true, "Không tồn tại mật khẩu"]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: [true, "Không tồn tại role"],
        default: 'user'
    },
}, { timestamps: true, collection: 'user' });

module.exports = mongoose.model('User', UserSchema);