var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/opt/fortinet/forticloud/db/log.db');
var _ = require('lodash');

db.run('create table log (ts INTEGER, name varchar(20), fmgsn varchar(20), fmgip varchar(20), rule varchar(1024));', function(err, row) {
    if (err) console.log(err);
});

let start = 'INSERT INTO log (ts, name, fmgsn, fmgip, rule) VALUES ';
let sql = start;

let i = 0;
for (i = 0; i < 10000; ++i) {
    let ts = 1497052637 + _.random(0, 10000) * 60 * 60;
    let name = "FGT60D46130533" + i;
    let fmgIp = "172.16.95." + i;
    let fmgSn = "FMG-VM0A110001" + i;
    let rule = 'config system central-management\nset type fortimanager\nset fmg 172.16.95.58\nset mode normal\nend\nconfig log fortiguard setting\nset status disable\nend\nconfig system fortiguard\nunset service-account-id\nend\nconfig system central-management\nunset serial-number\nset serial-number FMG-VM0A11000137\nend\n' + i;
    let part = '("' + ts + '","' + name + '","' + fmgIp + '","' + fmgSn + '","' + rule + '")';
    sql = sql + part + ',';
}
sql = sql + '(1497052637, "FGT60D46130533", "172.16.95.0", "FMG-VM0A110001", "123")';

db.run(sql, function(err, row) {
    if (err) console.log(err);
});

db.close();
