var express = require('express');
var router = express.Router();
const net = require('net');

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
                console.err(err);
            } else {
                console.log('download finished')
            }
            client.end();
        });

    });

});

module.exports = router;
