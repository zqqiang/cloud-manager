var express = require('express');
var router = express.Router();
const net = require('net');

router.get('/', function(req, res) {
    let payload = {
        method: 'get',
        url: '/system/expireCheck',
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

module.exports = router;
