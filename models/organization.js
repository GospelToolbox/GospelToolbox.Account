var mongoose = require('mongoose');

var Account = require('./account.js');

var OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    members: [{
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        },
        roles:[{type: String}]        
    }]
});

module.exports = mongoose.model('Organization', OrganizationSchema);