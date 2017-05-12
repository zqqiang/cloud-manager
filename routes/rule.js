var express = require('express');
var router = express.Router();
const dgram = require('dgram');

router.get('/', function(req, res, next) {
    let payload = {
        method: "get",
        url: "/rules",
        filter: "",
        page: {
            "offset": 0,
            "limit": 10
        }
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

router.post('/', function(req, res, next) {
    let payload = {
        method: "post",
        url: "/rules",
        rule: req.body
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

router.put('/', function(req, res, next) {
    let payload = {
        method: "put",
        url: "/rules",
        rule: req.body
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

router.delete('/', function(req, res, next) {
    let payload = {
        method: "delete",
        url: "/rules",
        rule: {
            "id": req.query.key
        }
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

module.exports = router
