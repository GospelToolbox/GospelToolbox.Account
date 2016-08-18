var oauth2orize = require('oauth2orize');
var Account = require('../models/account');
var Client = require('../models/client');
var AccessToken = require('../models/accessToken');
var AuthCode = require('../models/authCode');

var server = oauth2orize.createServer();

server.serializeClient(function(client, callback) {
    return callback(null, client._id);
});

server.deserializeClient(function(id, callback) {
    Client.findOne({ _id: id }, function(err, client) {
        if(err) {
            return callback(err);
        }

        return callback(null, client);
    });
});

server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
    // Create new auth code
    var code = new AuthCode({
        value: uid(16),
        clientId: client._id,
        redirectUri: redirectUri,
        userId: user._id
    });

    code.save(function(err) {
        if(err) {
            return callback(err);
        }

        callback(null, code.value);
    });
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
    AuthCode.findOne({value: code}, function(err, authCode) {
        if(err) { 
            return callback(err);
        }

        // Invalid auth code
        if(!authCode) {
            return callback(null, false);
        }

        // This is not an auth code for the current client
        if(client._id.toString() !== authCode.clientId) {
            return callback(null, false);
        }

        // Requested redirect doesn't match
        if(redirectUri !== authCode.redirectUri) {
            return callback(null, false);
        }

        // Delete the auth code after user
        authCode.remove(function(err) {
            if(err) { 
                return callback(err);
            }

            // Create the access token
            var token = new AccessToken({
                value: uid(256),
                clientId: authCode.clientId,
                userId: authCode.userId
            });

            token.save(function(err) {
                if(err) {
                    return callback(err);
                }

                callback(null, token);
            });
        });
    });
}));

// Authorization endpoint
exports.authorization = [
    server.authorization(function(clientId, redirectUri, callback) {
        console.log('test1');
        Client.findOne({id: clientId}, function(err, client) {
            if(err) {
                return callback(err);
            }

            return callback(null, client, redirectUri);
        });
    }),
    function(req, res) {
        console.log('test2');
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

function uid (len) {
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