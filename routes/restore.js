var express = require('express');
var router = express.Router();
const net = require('net');
const fs = require('fs');
var formidable = require('formidable');

var S = require('string');

router.post('/', function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = '/tmp/';

    form.on('file', function(field, file) {
        fs.rename(file.path, '/tmp/rule.restore.conf');
    });

    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    form.on('end', function() {
        let payload = {
            method: "put",
            url: "/system/restore",
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

    form.parse(req);
});

router.post('/Append', function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = '/tmp/';

    form.on('file', function(field, file) {
        fs.rename(file.path, '/tmp/rule.append.conf');
    });

    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    form.on('end', function() {
        let payload = {
            method: "put",
            url: "/system/append",
            filename: "/tmp/rule.append.conf"
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

    form.parse(req);
});

module.exports = router;
