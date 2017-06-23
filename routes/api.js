var express = require('express');
var passport = require('../auth/auth');
var moment = require('moment');
var router = express.Router();
const net = require('net');
const fs = require('fs');
const jwt = require('jsonwebtoken');
var db = require('../db');

var session = {};

function checker(req, res, next) {
    if (!req.headers.authorization) {
        console.log('missing authorization header')
        return res.json({
            code: -1,
            message: 'unauthorized'
        });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token || !session[token]) {
        return res.json({
            code: -1,
            message: 'unauthorized'
        })
    }
    return jwt.verify(token, 'secret', { maxAge: '5m' }, (err, decode) => {
        if (err) {
            console.log('jwt verify error', err.message)
            return res.json({
                code: -1,
                message: 'unauthorized'
            });
        }
        const userId = decode.sub;
        return db.users.findById(userId, function(err, user) {
            if (err || !user) {
                console.log('findById', err, user)
                return res.json({
                    code: -1,
                    message: 'unauthorized'
                });
            }
            console.log('verify success')
            return next();
        });
    })
}

router.post('/auth', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                code: -1,
                message: 'username or password error.'
            });
        }
        return next();
    })(req, res, next);
})

router.post('/auth', function(req, res) {
    var token = passport.auth[req.body.username];
    session[token] = true;
    setTimeout((token) => {
        if (session[token]) {
            delete session[token];
            console.log('timeout: delete token', token)
            console.log(session)
        }
    }, 10 * 60 * 1000, token)
    console.log(session);
    res.json({
        code: 0,
        message: 'OK',
        accessToken: token,
        expiresIn: moment().unix() + (5 * 60)
    });
});

router.get('/backup', checker);
router.get('/backup', function(req, res) {
    let payload = {
        method: 'get',
        url: '/system/backup',
    }

    const client = net.connect({ port: 8080, host: '127.0.0.1' }, () => {
        client.write(JSON.stringify(payload));
    });

    client.on('data', (data) => {
        console.log(data.toString());
        let filename = JSON.parse(data).filename;
        fs.readFile(filename, (err, data) => {
            if (err) {
                console.log(err);
                res.json({
                    code: -1,
                    message: 'read backup file error'
                })
            }
            res.json({
                code: 0,
                message: 'OK',
                content: Buffer(data).toString('base64')
            })
        });
    });
});

router.post('/restore', checker);
router.post('/restore', function(req, res) {
    fs.writeFile('/tmp/rule.restore.conf', Buffer.from(req.body.content, 'base64'), (err) => {
        if (err) {
            console.log(err);
            res.json({
                code: -1,
                message: 'write backup file error'
            })
        }
        let payload = {
            method: "put",
            url: "/system/restore",
            append: req.body.appendMode,
            filename: "/tmp/rule.restore.conf"
        }

        const client = net.connect({ port: 8080, host: '127.0.0.1' }, () => {
            client.write(JSON.stringify(payload));
        });

        client.on('data', (data) => {
            console.log(data.toString());
            res.json(JSON.parse(data));
            client.end();
        });
    });
});

router.post('/logout', checker);
router.post('/logout', function(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        delete session[token];
    }
    console.log(session);
    console.log('logout')
    res.json({
        code: 0,
        message: 'OK'
    })
})

module.exports = router;
