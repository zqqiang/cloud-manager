#!/usr/bin/env node

'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
const dgram = require('dgram');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/theme/project/img/cloud.png'));

let Login = require('./routes/login');
let Rule = require('./routes/rule');
let SystemSetting = require('./routes/system');
let Backup = require('./routes/backup');

app.use('/Login', Login);
app.use('/Rule', Rule);
app.use('/System', SystemSetting);
app.use('/Backup', Backup);

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
