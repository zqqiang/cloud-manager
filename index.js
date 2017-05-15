#!/usr/bin/env node

'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
const dgram = require('dgram');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/plain' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/theme/project/img/cloud.png'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

let Login = require('./routes/login');
let Rule = require('./routes/rule');
let SystemSetting = require('./routes/system');
let Backup = require('./routes/backup');
let Restore = require('./routes/restore');
let Admin = require('./routes/admin');

app.use('/Login', Login);
app.use('/Rule', Rule);
app.use('/System', SystemSetting);
app.use('/Backup', Backup);
app.use('/Restore', Restore);
app.use('/Admin', Admin);

passport.use(new Strategy(
    function(username, password, cb) {
        db.users.findByUsername(username, function(err, user) {
            if (err) {
                return cb(err); }
            if (!user) {
                return cb(null, false); }
            if (user.password != password) {
                return cb(null, false); }
            return cb(null, user);
        });
    }));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function(err, user) {
        if (err) {
            return cb(err); }
        cb(null, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 80);

console.log('argv', process.argv[2]);
let host = process.argv[2] === 'develop' ? undefined : '127.0.0.1';

var server = app.listen(app.get('port'), host, function() {
    console.log('Express server listening on ' + (host ? host : 'localhost') + ':' + server.address().port);
});
