var Organization = require('../models/Organization');

/**
 * Saves a new organization to the database
 */
exports.postOrganization = function (req, res) {
    var org = new Organization();

    // Set the model data from the POST data
    org.name = req.body.name;
    org.members.push({
        account: req.user,
        roles: ['owner']
    });

    org.save(function (err) {
        if (err) {
            return res.send(err);
        }

        res.json({ message: 'Organization added!', data: org });
    })
};

/**
 *  Retrieves all available organizations from the database
 */
exports.getOrganizations = function (req, res) {
    Organization.find(function (err, organizations) {
        if (err) {
            return res.send(err);
        }

        res.json(organizations);
    });
}

/**
 * Retrieves an individual organization from the database by id
 */
exports.getOrganization = function (req, res) {
    var organizationId = req.params.organization_id;

    // Fetch the organization information
    Organization.findById(organizationId, function (err, organization) {
        if (err) {
            return res.send(err);
        }

        res.json(organization);
    });
};

/**
 * Saves an individual organization to the database
 */
exports.putOrganization = function (req, res) {
    Organization.findById(req.params.organization_id, function (err, organization) {
        if (err) {
            res.send(err);
        }

        if (req.body.name) {
            organization.name = req.body.name;
        }

        organization.save(function (err) {
            if (err) {
                res.send(err);
            }

            res.json(organization);
        })

    });
};

/**
 * Deletes an individual organization from the database by ID
 */
exports.deleteOrganization = function (req, res) {
    Organization.findByIdAndRemove(req.params.organization_id, function (err) {
        if (err) {
            res.send(err);
        }

        res.json({ message: 'Organization deleted.' });
    });
};