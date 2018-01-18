var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var AccountSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String
});

AccountSchema.pre('save', function(callback) {
    var account = this;

    if(!account.isModified('password')) {
        return callback();
    }

    // TODO: need to deal with verifying previous password

    // Password has changed and needs to be hashed
    bcrypt.genSalt(5, function(err, salt) {
        if(err) {
            return callback(err);
        }

        bcrypt.hash(account.password, salt, null, function(err, hash) {
            if(err) {
                return callback(err);
            }

            account.password = hash;
            callback();
        });
    });
});

AccountSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if(err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Account', AccountSchema);