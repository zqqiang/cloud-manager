var express = require('express');
var router = express.Router();

router.put('/', function(req, res) {

    console.log(req.body)

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('/etc/fortideploy.db');

    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO Users VALUES (?,?)");
        stmt.run(req.body.newUser, req.body.newPassword);
        stmt.finalize();
        db.each("SELECT rowid AS id, username, password FROM Users", function(err, row) {
            console.log(row.id, row.username, row.password)
        });
    });

    db.close();

    res.json({
        result: 'success'
    });

});

module.exports = router;
