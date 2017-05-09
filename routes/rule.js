var express = require('express');
var router = express.Router();
const dgram = require('dgram');

router.get('/', function(req, res, next) {
    let payload = {
        url: '/rule',
        method: req.method,
    }

    const message = Buffer.from(JSON.stringify(payload));

    res.json({
        method: req.method,
        status: 'OK',
        rules: [{
            id: 1,
            fgtIpSn: '1.1.1.1',
            mgmtSN: 'FGTXXX0123456789',
            mgmtIP: '2.2.2.2'
        }, {
            id: 2,
            fgtIpSn: '1.1.1.2',
            mgmtSN: 'FGTXXX0123456788',
            mgmtIP: '2.2.2.3'
        }]
    });

    const client = dgram.createSocket('udp4');
    client.send(message, 8080, 'localhost', (err) => {
        client.close();
    });
})

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
