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
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('/opt/fortinet/forticloud/db/log.db');
        let json = JSON.parse(data);
        db.all("SELECT COUNT(*) AS count FROM log", function(err, rows) {
            if (err) return console.log(err);
            json['count'] = rows[0].count;
        });
        db.close(function(err) {
            if (err) return console.log(err);
            res.json(json);
            client.end();
        });
    });
});

module.exports = router;
