var express = require('express');
var router = express.Router();
var database = require('../db');

router.put('/', function(req, res) {

    console.log(req.body)

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('/etc/fortideploy.db');

    db.run('UPDATE Users SET username = ?, password = ? WHERE id = 1', req.body.newUser, req.body.newPassword, function(err, row) {
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
        result: 'success'
    });

});

module.exports = router;
