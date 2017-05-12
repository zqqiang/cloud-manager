var express = require('express');
var router = express.Router();
const dgram = require('dgram');

router.get('/', function(req, res) {
    let payload = {
        url: '/system',
        method: 'get',
    }

    const message = Buffer.from(JSON.stringify(payload));

    const client = dgram.createSocket('udp4');

    client.bind(9090);

    client.send(message, 8080, 'localhost', (err) => {

    });

    client.on('message', (msg, rinfo) => {
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

        res.json(JSON.parse(msg));

        client.close();
    });

});

router.put('/', function(req, res) {
    let payload = {
        method: "put",
        url: "/system",
        setting: req.body
    }

    const message = Buffer.from(JSON.stringify(payload));

    const client = dgram.createSocket('udp4');

    client.bind(9090);

    client.send(message, 8080, 'localhost', (err) => {

    });

    client.on('message', (msg, rinfo) => {
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

        res.json(JSON.parse(msg));

        client.close();
    });
})

module.exports = router;
