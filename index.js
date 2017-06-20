#!/usr/bin/env node

'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
const dgram = require('dgram');
var bodyParser = require('body-parser');
var passport = require('./auth/auth');
var process = require('process');
var fs = require('fs');
fs.writeFile("/var/run/nodeportal.pid", process.pid);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/plain' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/theme/project/img/cloud.png'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

let Login = require('./routes/login');
let Rule = require('./routes/rule');
let SystemInfo = require('./routes/system');
let Backup = require('./routes/backup');
let Restore = require('./routes/restore');
let Admin = require('./routes/admin');
let Expire = require('./routes/expire');
let Log = require('./routes/log');

let API = require('./routes/api');

const Checker = require('./auth/checker');

app.use('/Login', Login);

app.use('/gui', Checker);
app.use('/gui/Rule', Rule);
app.use('/gui/System', SystemInfo);
app.use('/gui/Backup', Backup);
app.use('/gui/Admin', Admin);
app.use('/gui/Expire', Expire);
app.use('/gui/Log', Log);

// Restful API
app.use('/api/v1', API);

app.use('/Restore', Restore);

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
