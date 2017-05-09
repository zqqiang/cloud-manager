var express = require('express');
var router = express.Router();
const dgram = require('dgram');

router.use('/', function(req, res, next) {
    let payload = {
        url: '/rule',
        method: req.method,
        params: [req.body]
    }

    const message = Buffer.from(JSON.stringify(payload));

    res.json({
        method: req.method,
        status: 'OK'
    });

    const client = dgram.createSocket('udp4');
    client.send(message, 6000, 'localhost', (err) => {
        client.close();
    });
})

module.exports = router
