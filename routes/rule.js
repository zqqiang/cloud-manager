var express = require('express');
var router = express.Router();
const net = require('net');

router.get('/', function(req, res, next) {
    let offset = 0;
    let recordPerPage = 20;
    if (req.query.page) {
        offset = (req.query.page - 1) * recordPerPage;
    }
    let filter = ''
    if (req.query.filter) {
        filter = req.query.filter
    }
    let payload = {
        method: "get",
        url: "/rules",
        filter: filter,
        page: {
            "offset": offset,
            "limit": recordPerPage
        }
    }

    const client = net.connect({ port: 8080, host: '127.0.0.1' }, () => {
        client.write(JSON.stringify(payload));
    });

    client.on('data', (data) => {
        console.log(data.toString());
        res.json(JSON.parse(data));
        client.end();
    });
})

router.post('/', function(req, res, next) {
    let payload = {
        method: "post",
        url: "/rules",
        rule: req.body
    }

    const client = net.connect({ port: 8080, host: '127.0.0.1' }, () => {
        client.write(JSON.stringify(payload));
    });

    client.on('data', (data) => {
        console.log(data.toString());
        res.json(JSON.parse(data));
        client.end();
    });
})

router.put('/', function(req, res, next) {
    let payload = {
        method: "put",
        url: "/rules",
        rule: req.body
    }

    const client = net.connect({ port: 8080, host: '127.0.0.1' }, () => {
        client.write(JSON.stringify(payload));
    });

    client.on('data', (data) => {
        console.log(data.toString());
        res.json(JSON.parse(data));
        client.end();
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

    const client = net.connect({ port: 8080, host: '127.0.0.1' }, () => {
        client.write(JSON.stringify(payload));
    });

    client.on('data', (data) => {
        console.log(data.toString());
        res.json(JSON.parse(data));
        client.end();
    });
})

module.exports = router
