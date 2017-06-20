var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
var db = require('../db');
var crypto = require('crypto');
const net = require('net');

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
            let payload = {
                method: 'put',
                url: '/system/admin',
                action: 'login',
                password: password
            }
            const client = net.connect({ port: 8080, host: '127.0.0.1' }, () => {
                client.write(JSON.stringify(payload));
            });
            client.on('data', (data) => {
                let json = JSON.parse(data);
                if (0 === json.code) {
                    const payload = {
                        sub: user.id
                    }
                    const token = jwt.sign(payload, 'secret', { expiresIn: '5m' });
                    passport.auth[user.username] = token;
                    client.end();
                    return cb(null, user);
                } else {
                    client.end();
                    return cb(null, false);
                }
            });
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
