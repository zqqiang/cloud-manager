var express = require('express');
var router = express.Router();
var database = require('../db');
const net = require('net');

router.put('/', function(req, res) {
    let payload = {
        method: 'put',
        url: '/system/admin',
        action: 'changePassword',
        oldPassword: req.body.oldPassword,
        password: req.body.newPassword
    };
    const client = net.connect({ port: 8080, host: '127.0.0.1' }, () => {
        client.write(JSON.stringify(payload));
    });
    client.on('data', (data) => {
        let json = JSON.parse(data);
        if (0 === json.code) {
            var sqlite3 = require('sqlite3').verbose();
            var db = new sqlite3.Database('/opt/fortinet/forticloud/db/fortideploy.db');
            db.each("SELECT id, username, password FROM Users", function(err, row) {
                database.users.updateUser({
                    username: row.username,
                    password: row.password
                })
            });
            db.close();
        }
        res.json(json);
        client.end();
    });
});

module.exports = router;
