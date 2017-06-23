var express = require('express');
var router = express.Router();
const net = require('net');
var moment = require('moment');
var _ = require('lodash');

router.get('/Timeseries', function(req, res) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('/opt/fortinet/forticloud/db/log.db');
    var records = [];
    db.serialize(function() {
        db.all("SELECT DISTINCT(ts) AS timestamp FROM log ORDER BY ts ASC", function(err, rows) {
            if (err) return console.log(err);
            rows.forEach(function(row) {
                records.push(row.timestamp);
            })
        });
    });
    db.close(function(err) {
        if (err) return console.log(err);
        res.json({
            code: 0,
            message: 'OK',
            ts: records
        });
    });
})

router.get('/Count', function(req, res) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('/opt/fortinet/forticloud/db/log.db');
    var count = {};
    console.log(req.query);
    db.serialize(function() {
        db.all("SELECT ts AS timestamp, COUNT(ts) AS count FROM log WHERE ts >= ? AND ts <= ? GROUP BY ts ORDER BY ts ASC",
            req.query.start, req.query.end,
            function(err, rows) {
                if (err) return console.log(err);
                rows.forEach(function(row) {
                    if (count[moment.unix(row.timestamp).format("YYYY-MM-D")]) {
                        count[moment.unix(row.timestamp).format("YYYY-MM-D")] += row.count;
                    } else {
                        count[moment.unix(row.timestamp).format("YYYY-MM-D")] = row.count;
                    }
                })
            });
    });
    db.close(function(err) {
        if (err) return console.log(err);
        res.json({
            code: 0,
            message: 'OK',
            counts: count
        });
    });
})

router.get('/Tables', function(req, res) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('/opt/fortinet/forticloud/db/log.db');
    var records = [];
    db.all("SELECT ts, name, fmgsn, fmgip, rule FROM log WHERE ts >= ? AND ts <= ? ORDER BY ts ASC",
        req.query.start, req.query.end,
        function(err, rows) {
            if (err) return console.log(err);
            rows.forEach(function(row) {
                records.push({
                    timestamp: row.ts,
                    timestring: moment.unix(row.ts).format("YYYY-MM-D, h:mm:ss a"),
                    timeYearMonth: moment.unix(row.ts).format("YYYY-MM"),
                    timeYearMonthDay: moment.unix(row.ts).format("YYYY-MM-D"),
                    name: row.name,
                    fmgIp: row.fmgip,
                    fmgSn: row.fmgsn,
                    rawRule: row.rule
                })
            })
        });
    db.close(function(err) {
        if (err) return console.log(err);
        res.json({
            code: 0,
            message: 'OK',
            logs: records
        });
    });
});

router.delete('/', function(req, res) {
    var sql = "DELETE FROM log ";
    var range = req.query.range;
    var start = '';
    var end = '';
    switch (range) {
        case '1m':
            end = moment().unix() - 31 * 24 * 60 * 60;
            break;
        case '3m':
            end = moment().unix() - 3 * 31 * 24 * 60 * 60;
            break;
        case '6m':
            end = moment().unix() - 6 * 31 * 24 * 60 * 60;
            break;
        case '1y':
            end = moment().unix() - 365 * 24 * 60 * 60;
            break;
    }
    if (end !== '') {
        sql += (' WHERE ts <=' + end);
    }
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('/opt/fortinet/forticloud/db/log.db');
    db.run(sql, function(err) {
        if (err) console.log(err);
        db.close();
        var rsp = {
            code: err ? err : 0,
            message: err ? err : 'OK'
        };
        console.log(rsp)
        res.json(rsp);
    });
})

module.exports = router;
