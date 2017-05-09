#!/usr/bin/env node

'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
const dgram = require('dgram');
const udp4Server = dgram.createSocket('udp4');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/theme/project/img/cloud.png'));

let Login = require('./routes/login');
let Submit = require('./routes/submit');

app.use('/Login', Login);
app.use('/Submit', Submit);

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

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

udp4Server.on('error', (err) => {
    console.log(`udp server error:\n${err.stack}`);
    udp4Server.close();
});

udp4Server.on('message', (msg, rinfo) => {
    console.log(`udp server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

udp4Server.on('listening', () => {
    var address = udp4Server.address();
    console.log(`udp server listening ${address.address}:${address.port}`);
});

udp4Server.bind(8080);
