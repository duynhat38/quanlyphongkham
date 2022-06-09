const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokensSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
}, { timestamps: true, collection: 'Tokens' });

module.exports = mongoose.model("Tokens", TokensSchema);