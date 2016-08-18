var mongoose = require('mongoose');

var AccessTokenSchema = new mongoose.Schema({
    // todo: should be hashed
    value: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('AccessToken', AccessTokenSchema);