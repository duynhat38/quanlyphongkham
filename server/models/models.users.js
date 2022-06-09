var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

var UsersSchema = new Schema({
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
    fullname: {
        type: String,
        required: [true, "Không tồn tại fullname"]
    },
    password: {
        type: String,
        required: [true, "Không tồn tại password"],
    },
    role: {
        type: String,
        enum: ['admin', 'bacsi', 'duocsi', 'tieptan'],
        required: [true, "Không tồn tại role"]
    }
}, { timestamps: true, collection: 'Users' });

UsersSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});
UsersSchema.pre('findOneAndUpdate', async function(next) {
    try {
        if (!this._update.password) return next();
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        this._update.password = await bcrypt.hash(this._update.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});

UsersSchema.methods.validatePassword = async function validatePassword(data) {
    return bcrypt.compare(data, this.password);
};

module.exports = mongoose.model('Users', UsersSchema);