var Account = require('../models/account');

/**
 * Saves a new account to the database
 */
exports.postAccounts = function (req, res) {
    var account = new Account();

    // Set the model data from the POST data
    account.firstName = req.body.firstName;
    account.lastName = req.body.lastName;
    account.username = req.body.username;
    account.password = req.body.password;


    account.save(function (err) {
        if (err) {
            res.send(err);
        }

        res.json({ message: 'Account added!', data: account });
    })
};

/**
 *  Retrieves all available accounts from the database
 */
exports.getAccounts = function (req, res) {
    Account.find(function (err, accounts) {
        if (err) {
            return res.send(err);
        }

        res.json(accounts);
    });
}

/**
 * Retrieves an individual account from the database by id
 */
exports.getAccount = function (req, res) {

    var accountId = req.params.account_id;

    // If the API call is for the current user, get that ID off
    // of the authentication
    if (accountId.toLowerCase().trim() === 'current') {
        accountId = req.user._id;
    }

    // Fetch the account information
    Account.findById(accountId, function (err, account) {
        if (err) {
            return res.send(err);
        }

        res.json(account);
    });
};

/**
 * Saves an individual account to the database
 */
exports.putAccount = function (req, res) {
    Account.findById(req.params.account_id, function (err, account) {
        if (err) {
            res.send(err);
        }

        if (req.body.firstName) {
            account.firstName = req.body.firstName;
        }

        if (req.body.lastName) {
            account.lastName = req.body.lastName;
        }

        if (req.body.password) {
            account.password = password;
        }

        account.save(function (err) {
            if (err) {
                res.send(err);
            }

            res.json(account);
        })

    });
};

/**
 * Deletes an individual account from the database by ID
 */
exports.deleteAccount = function (req, res) {
    Account.findByIdAndRemove(req.params.account_id, function (err) {
        if (err) {
            res.send(err);
        }

        res.json({ message: 'Account deleted.' });
    });
};