var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
var db = require('../db');
var crypto = require('crypto');

passport.auth = {};

passport.use(new Strategy(
    function(username, password, cb) {
        db.users.findByUsername(username, function(err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            console.log(user.password, password);
            if (user.password != db.users.getPasswdHash(password)) {
                return cb(null, false);
            }

            const payload = {
                sub: user.id
            }
            const token = jwt.sign(payload, 'secret', { expiresIn: '5m' });
            passport.auth[user.username] = token;
            return cb(null, user);
        });
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function(err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

module.exports = passport;
