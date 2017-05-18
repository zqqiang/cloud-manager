var records = [
    { id: 1, username: 'admin', password: 'pass', displayName: 'Admin', emails: [{ value: '' }] }
];

// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('/etc/fortideploy.db');

// var records = [];

// db.serialize(function() {
//     db.run("CREATE TABLE IF NOT EXISTS Users (username TEXT PRIMARY KEY NOT NULL, password TEXT)");

//     db.get("SELECT COUNT(*) AS count FROM Users", function(err, row) {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         if (0 === row.count) {
//             var stmt = db.prepare("INSERT INTO Users VALUES (?,?)");
//             stmt.run("admin", "pass");
//             stmt.finalize();
//         }
//     })

//     db.each("SELECT rowid AS id, username, password FROM Users", function(err, row) {
//         records.push({
//             id: row.id,
//             username: row.username,
//             password: row.password
//         })
//         console.log(records);
//     });

// });

// db.close();

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
