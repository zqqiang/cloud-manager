var express = require('express');
var router = express.Router();
const net = require('net');
const fs = require('fs');

var S = require('string');

router.post('/', function(req, res) {
    let content = S(req.body).between('Content-Type: application/octet-stream', '------WebKitFormBoundary').s

    fs.writeFile('/tmp/rule.restore.conf', content, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');

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

});

module.exports = router;
