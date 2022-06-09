var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AllCodesSchema = new Schema({
    type: {
        type: String
    },
    key: {
        type: String
    },
    value: {
        type: String
    }
}, { collection: 'AllCodes' });

module.exports = mongoose.model('AllCodes', AllCodesSchema);