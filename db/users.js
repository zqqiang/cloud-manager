var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/opt/fortinet/forticloud/db/fortideploy.db');
var crypto = require('crypto');
var records = [];

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY NOT NULL, username TEXT NOT NULL, password TEXT)");
    db.each("SELECT id, username, password FROM Users", function(err, row) {
        records.push({
            id: row.id,
            username: row.username,
            password: row.password
        })
        console.log(records);
    });
});

db.close();

exports.findById = function(id, cb) {
    process.nextTick(function() {
        var idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
}

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
}

exports.updateUser = function(user) {
    records = [{
        id: 1,
        username: user.username,
        password: user.password
    }]
    console.log(records)
};

exports.getUser = function() {
    return records[0]
};