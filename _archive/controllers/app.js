exports.index = function (req, res) {
    res.render('index');
};

exports.login = function(req, res) {
    res.render('login', { errors: req.flash('error') });
}