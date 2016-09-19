var oauth2orize = require('oauth2orize');
var oauth2orize_ext = require('oauth2orize-openid');
var Account = require('../models/account');
var Client = require('../models/client');
var AccessToken = require('../models/accessToken');
var AuthCode = require('../models/authCode');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

// TODO: Read more here:
// https://github.com/nicokaiser/oauth-provider-example/blob/master/lib/default-config.js


var server = oauth2orize.createServer();

server.serializeClient(function (client, callback) {
    return callback(null, client._id);
});

server.deserializeClient(function (id, callback) {
    Client.findOne({ _id: id }, function (err, client) {
        if (err) {
            return callback(err);
        }

        return callback(null, client);
    });
});

///

// Implicit Flow
// ------------------------------

// id_token grant type
server.grant(oauth2orize_ext.grant.idToken(function (client, user, callback) {
    var id_token;

    console.log('!!!! IMPLICIT id_token');
    // TODO: ???
    // Do your lookup/token generation.
    // ... id_token =

    callback(null, id_token);
}));

// id_token token grant type
server.grant(oauth2orize_ext.grant.idTokenToken(
    function (client, user, callback) {
        var token;

        console.log('!!!! IMPLICIT id_token token 1');

        // TODO: ???
        // Do your lookup/token generation.
        // ... token =

        done(null, token);
    },
    function (client, user, callback) {
        var id_token;

        console.log('!!!! IMPLICIT id_token token 2');

        // TODO: ???
        // Do your lookup/token generation.
        // ... id_token =

        callback(null, id_token);
    }
));

// Hybrid Flow
// ------------------------------

server.grant(oauth2orize_ext.grant.codeIdToken(
    function (client, redirect_uri, user, callback) {
        var code;

        console.log('!!!! HYBRID code id_token 1');

        // TODO: ???
        // Do your lookup/token generation.
        // ... code =
        callback(null, code);
    },
    function (client, user, callback) {
        var id_token;

        console.log('!!!! HYBRID code id_token 2');

        // TODO: ???
        // Do your lookup/token generation.
        // ... id_token =

        callback(null, id_token);
    }
));

// 'code token' grant type.
server.grant(oauth2orize_ext.grant.codeToken(
    function (client, user, callback) {
        var token;
        console.log('!!!! HYBRID code token 1');
        // Do your lookup/token generation.
        // ... id_token =
        callback(null, token);
    },
    function (client, redirect_uri, user, callback) {
        var code;

        console.log('!!!! HYBRID code token 2');
        // Do your lookup/token generation.
        // ... code =

        callback(null, code);
    }
));

// 'code id_token token' grant type.
server.grant(oauth2orize_ext.grant.codeIdTokenToken(
    function (client, user, callback) {
        var token;
        console.log('!!!! HYBRID code id_token token 1');
        // Do your lookup/token generation.
        // ... id_token =
        callback(null, token);
    },
    function (client, redirect_uri, user, callback) {
        var code;
        console.log('!!!! HYBRID code id_token 2');
        // Do your lookup/token generation.
        // ... code =

        callback(null, code);
    },
    function (client, user, callback) {
        var id_token;
        // Do your lookup/token generation.
        // ... id_token =
        callback(null, id_token);
    }
));

///

server.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, callback) {
    // Create new auth code
    var code = new AuthCode({
        value: uid(16),
        clientId: client._id,
        redirectUri: redirectUri,
        userId: user._id
    });

    code.save(function (err) {
        if (err) {
            return callback(err);
        }

        callback(null, code.value);
    });
}));

server.grant(oauth2orize.grant.token(function (client, user, ares, callback) {
    // Create the access token
    var token = new AccessToken({
        value: uid(256),
        clientId: client._id,
        userId: user._id
    });

    token.save(function (err) {
        if (err) {
            return callback(err);
        }

        callback(null, token);
    });
}));

server.exchange(oauth2orize.exchange.code(function (client, code, redirectUri, callback) {
    AuthCode.findOne({ value: code }, function (err, authCode) {
        if (err) {
            return callback(err);
        }

        // Invalid auth code
        if (!authCode) {
            return callback(null, false);
        }

        // This is not an auth code for the current client
        if (client._id.toString() !== authCode.clientId) {
            return callback(null, false);
        }

        // Requested redirect doesn't match
        if (redirectUri !== authCode.redirectUri) {
            return callback(null, false);
        }

        // Delete the auth code after user
        authCode.remove(function (err) {
            if (err) {
                return callback(err);
            }

            // Create the access token
            var token = new AccessToken({
                value: uid(256),
                clientId: authCode.clientId,
                userId: authCode.userId
            });

            var baseUrl = 'http://account.gospeltoolbox.net:3000';

            var idTokenAlg = 'RS256';
            var idTokenTTL = 3600;
            var idTokenSecret = fs.readFileSync(path.resolve(__dirname, '../key.pem'));

            var id_token = jwt.sign({
                    iss: baseUrl,
                    sub: authCode.userId,
                    aud: authCode.clientId,
                    //nonce: req.nonce
                }, 
                idTokenSecret,
                {
                    algorithm: idTokenAlg,
                    //expiresInSeconds: idTokenTTL
                });

            token.save(function (err) {
                if (err) {
                    return callback(err);
                }

                callback(null, token.value, '', {id_token: id_token});
            });
        });
    });
}));

// Authorization endpoint
exports.authorization = [
    server.authorization(function (clientId, redirectUri, callback) {
        Client.findOne({ id: clientId }, function (err, client) {
            if (err) {
                return callback(err);
            }

            return callback(null, client, redirectUri);
        });
    }),
    function (req, res) {
        res.render('dialog', {
            transactionID: req.oauth2.transactionID,
            user: req.user,
            client: req.oauth2.client
        });
    }
];

// User grant decision endpoint
exports.decision = [
    server.decision()
];

// Token exchange (Auth -> Access) endpoint
exports.token = [
    server.token(),
    server.errorHandler()
];

//-----------------------------------------------------------------------------

function uid(len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}