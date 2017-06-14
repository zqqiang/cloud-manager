var express = require('express');
var router = express.Router();
var database = require('../db');

router.put('/', function(req, res) {

    console.log(req.body)

    if (database.users.getPasswdHash(req.body.oldPassword) != database.users.getUser().password) {
        return res.json({
            code: -1,
            message: 'Old password is wrong!'
        });
    }

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('/opt/fortinet/forticloud/db/fortideploy.db');

    const saltRounds = 10;
    const hash = database.users.getPasswdHash(req.body.newPassword);

    db.run('UPDATE Users SET password = ? WHERE id = 1', hash, function(err, row) {
        if (err) console.log(err);
    });

    db.each("SELECT id, username, password FROM Users", function(err, row) {
        database.users.updateUser({
            username: row.username,
            password: row.password
        })
    });

    db.close();

    res.json({
        code: 0,
        message: 'success'
    });

});

module.exports = router;
