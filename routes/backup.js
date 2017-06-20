var express = require('express');
var router = express.Router();
const net = require('net');
const fs = require('fs');
const _ = require('lodash');

router.get('/', function(req, res) {
    let payload = {
        method: 'get',
        url: '/system/backup',
    }

    const client = net.connect({ port: 8080, host: '127.0.0.1' }, () => {
        client.write(JSON.stringify(payload));
    });

    client.on('data', (data) => {
        console.log(data.toString());

        let filename = JSON.parse(data).filename;

        res.download(filename, 'backup.conf', function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('download finished')
            }
            client.end();
        });
    });
});

router.get('/Log', function(req, res) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('/opt/fortinet/forticloud/db/log.db');

    db.all("SELECT ts, name, fmgsn, fmgip, rule FROM log", function(err, rows) {
        if (err) console.log(err);
        db.close();
        var file = '';
        rows.forEach(function(row) {
            var line = '';
            _.each(row, function(value, key) {
                line += (key + '=' + encodeURI(value) + ' ');
            })
            file += (line + '\r\n');
        })
        fs.writeFile('/tmp/data.csv', file, (err) => {
            if (err) throw err;
            res.download('/tmp/data.csv', 'backup.log', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('backup.log download finished');
                }
            });
        });
    });
});

module.exports = router;
