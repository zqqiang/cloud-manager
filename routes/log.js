var express = require('express');
var router = express.Router();
const net = require('net');
var moment = require('moment');
var _ = require('lodash');

router.get('/', function(req, res) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('/opt/fortinet/forticloud/db/log.db');
    var records = [];
    db.all("SELECT ts, name, fmgsn, fmgip, rule FROM log", function(err, rows) {
        if (err) console.log(err);
        rows.forEach(function(row) {
            records.push({
                timestamp: row.ts,
                timestring: moment.unix(row.ts).format("MM-D-YYYY, h:mm:ss a"),
                timeYearMonth: moment.unix(row.ts).format("YYYY-MM"),
                timeYearMonthDay: moment.unix(row.ts).format("YYYY-MM-D"),
                name: row.name,
                fmgIp: row.fmgip,
                fmgSn: row.fmgsn,
                rawRule: row.rule
            })
        })
        db.close();
        res.json({
            code: 0,
            message: 'OK',
            logs: records
        });
    });
});

router.delete('/', function(req, res) {
    var range = req.query.range;
    var start = '';
    var end = '';
    switch (range) {
        case '24h':
            end = moment().unix();
            start = moment().unix() - 24 * 60 * 60;
            break;
        case '7d':
            end = moment().unix();
            start = moment().unix() - 7 * 24 * 60 * 60;
            break;
        case '30d':
            end = moment().unix();
            start = moment().unix() - 30 * 24 * 60 * 60;
            break;
        case '3m':
            end = moment().unix();
            start = moment().unix() - 3 * 31 * 24 * 60 * 60;
            break;
    }
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('/opt/fortinet/forticloud/db/log.db');
    db.run("DELETE FROM log WHERE ts > " + start + " AND ts < " + end, function(err) {
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
