var passport = require('passport');

// Import Passport strategies
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var LocalStrategy = require('passport-local').Strategy;

// Import models
var Account = require('../models/account');
var Client = require('../models/client');
var AccessToken = require('../models/accessToken');

/**
 * Authentication strategy for app UI
 */
passport.use(new LocalStrategy(
    function (username, password, callback) {
        Account.findOne({ email: username }, function (err, account) {
            if (err) {
                return callback(err);
            }

            if (!account) {
                return callback(null, false);
            }

            account.verifyPassword(password, function (err, isMatch) {
                if (err) {
                    return callback(err);
                }

                if (!isMatch) {
                    return callback(null, false);
                }

                return callback(null, account);
            });
        });
    }
));

exports.isAppAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/login?redirectTo=' + encodeURIComponent(req.originalUrl));
    }
}

/**
 * Authentication strategy for Account username and passwords
 */
passport.use(new BasicStrategy(
    function (username, password, callback) {
        Account.findOne({ email: username }, function (err, account) {
            if (err) {
                return callback(err);
            }

            if (!account) {
                return callback(null, false);
            }

            account.verifyPassword(password, function (err, isMatch) {
                if (err) {
                    return callback(err);
                }

                if (!isMatch) {
                    return callback(null, false);
                }

                return callback(null, account);
            });
        });
    }
));

exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return passport.authenticate(['basic', 'bearer'], { session: false })(req, res, next);
    }
}

/**
 * Authentication strategy for OAuth client user/password
 */
passport.use('client-basic', new BasicStrategy(
    function (username, password, callback) {
        Client.findOne({ id: username }, function (err, client) {
            if (err) {
                return callback(err);
            }

            // todo: implement hashing
            if (!client || client.secret !== password) {
                return callback(null, false);
            }

            return callback(null, client);
        });
    }
));
exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });

/**
 * Authentication strategy for OAuth access token
 */
passport.use(new BearerStrategy(
    function (accessToken, callback) {
        Token.findOne({ value: accessToken }, function (err, token) {
            if (err) {
                return callback(err);
            }

            if (!token) {
                return callback(null, false);
            }

            User.findOne({ _id: token.userId }, function (err, user) {
                if (err) {
                    return callback(err);
                }

                if (!user) {
                    return callback(null, false);
                }

                // Simple example with no scope
                callback(null, user, { scope: '*' });
            })
        })
    }
));
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });

//====================================================================================

passport.serializeUser(function (user, callback) {
    return callback(null, user._id);
});

passport.deserializeUser(function (id, callback) {

    Account.findById(id, function (err, account) {
        if (err) {
            console.error('deserialize', err);
            return callback(err);
        }

        if (!account) {
            console.error('deserialize', 'No account');
            return callback(null, false);
        }

        return callback(null, account);
    });
});