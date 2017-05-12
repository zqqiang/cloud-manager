var express = require('express');
var router = express.Router();
const net = require('net');

router.get('/', function(req, res) {
    let payload = {
        url: '/system',
        method: 'get',
    }

    const client = net.connect({ port: 8080 }, () => {
        client.write(JSON.stringify(payload));
    });

    client.on('data', (data) => {
        console.log(data.toString());
        res.json(JSON.parse(data));
        client.end();
    });

});

router.put('/', function(req, res) {
    let payload = {
        method: "put",
        url: "/system",
        setting: req.body
    }

    const client = net.connect({ port: 8080 }, () => {
        client.write(JSON.stringify(payload));
    });

    client.on('data', (data) => {
        console.log(data.toString());
        res.json(JSON.parse(data));
        client.end();
    });
})

module.exports = router;
