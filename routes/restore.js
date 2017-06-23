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

    var appendStatus = 1;
    form.on('field', function(name, value) {
        if (name === 'append') {
            if (value == 'true') {
                appendStatus = 1;
            } else {
                appendStatus = 0;
            }
        }
    });

    form.on('end', function() {
        let payload = {
            method: "put",
            url: "/system/restore",
            append: appendStatus,
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

        client.on('error', (err) => {
            console('error', err);
        });

        client.on('close', (err) => {
            console('close', err);
        });
    });

    form.parse(req);
});

module.exports = router;
