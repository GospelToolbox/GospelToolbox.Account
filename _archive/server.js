var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var ejs = require('ejs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan'); // express-logger
var errorHandler = require('errorhandler');
var flash = require('connect-flash');
var cors = require('cors');

// Import controllers
var accountController = require('./controllers/account');
var organizationController = require('./controllers/organization');
var authController = require('./controllers/auth');
var clientController = require('./controllers/client');
var oauth2Controller = require('./controllers/oauth2');
var appController = require('./controllers/app');

var app = express();

app.set('view engine', 'ejs');

var whitelist = ['http://people.gospeltoolbox.net:3001'];
var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        console.log(`!!!${origin}`, whitelist);
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        console.log('originisWhitelisted:', originIsWhitelisted);
        callback(null, originIsWhitelisted);
    }
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser('Super secret session key'));
app.use(morgan('combined'));

// todo: make session secret configurable
app.use(session({
    secret: 'Super secret session key',
    saveUninitialized: true,
    resave: true
}));

app.use(express.static('app'));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var apiRouter = express.Router();

mongoose.connect('mongodb://localhost:27017/gtbox-account')

apiRouter.get('/', function (req, res) {
    res.json({ message: 'You have no account on the server.' });
});

apiRouter.route('/accounts')
    .post(accountController.postAccounts)
    .get(authController.isAuthenticated, accountController.getAccounts);

apiRouter.route('/accounts/:account_id')
    .get(authController.isAuthenticated, accountController.getAccount)
    .put(authController.isAuthenticated, accountController.putAccount)
    .delete(authController.isAuthenticated, accountController.deleteAccount);

apiRouter.route('/organizations')
    .post(authController.isAuthenticated, organizationController.postOrganization)
    .get(authController.isAuthenticated, organizationController.getOrganizations);

apiRouter.route('/organizations/:organization_id')
    .get(authController.isAuthenticated, organizationController.getOrganization)
    .put(authController.isAuthenticated, organizationController.putOrganization)
    .delete(authController.isAuthenticated, organizationController.deleteOrganization);

apiRouter.route('/clients')
    .post(authController.isAuthenticated, clientController.postClients)
    .get(authController.isAuthenticated, clientController.getClients);

app.use('/api', apiRouter);

var authRouter = express.Router();

authRouter.route('/authorize')
    .get(authController.isAppAuthenticated, oauth2Controller.authorization)
    .post(authController.isAppAuthenticated, oauth2Controller.decision);

authRouter.route('/token')
    .post(authController.isClientAuthenticated, oauth2Controller.token);

authRouter.route('/userinfo')
    .get(authController.isAuthenticated, function (req, res) {
        return res.json({
            sub: req.user._id,
            email: req.user.username,
            name: req.user.firstName + ' ' + req.user.lastName,
            given_name: req.user.firstName,
            family_name: req.user.lastName
        });
    });

app.use('/auth', authRouter);

app.get('/login', appController.login);
app.post('/login', function (req, res, next) {
    return passport.authenticate('local', {
        successRedirect: req.query['redirectTo'] ? req.query['redirectTo'] : '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);

});

app.get('/logout', function(req, res, next)  {
    req.logout();
    var redirectUrl = req.query['redirectTo'] || '/';
    res.redirect(redirectUrl);
});


//  ));

app.use(errorHandler());

app.get('*', authController.isAppAuthenticated, appController.index);

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});