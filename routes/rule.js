var express = require('express');
var router = express.Router();
const dgram = require('dgram');

router.post('/', function(req, res, next) {
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
    client.send(message, 8080, 'localhost', (err) => {
        client.close();
    });
})

router.put('/', function(req, res, next) {
    let payload = {
        url: '/rule',
        method: req.method,
        key: req.query.key,
        params: [req.body]
    }

    const message = Buffer.from(JSON.stringify(payload));

    res.json({
        method: req.method,
        status: 'OK'
    });

    const client = dgram.createSocket('udp4');
    client.send(message, 8080, 'localhost', (err) => {
        client.close();
    });
})

router.delete('/', function(req, res, next) {
    let payload = {
        url: '/rule',
        method: req.method,
        key: req.query.key,
        params: [req.body]
    }

    const message = Buffer.from(JSON.stringify(payload));

    res.json({
        method: req.method,
        status: 'OK'
    });

    const client = dgram.createSocket('udp4');
    client.send(message, 8080, 'localhost', (err) => {
        client.close();
    });
})

module.exports = router
