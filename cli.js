const net = require('net');
const readline = require('readline');
var bcrypt = require('bcrypt');
var S = require('string');

process.on('exit', (code) => {
    // console.log(`About to exit with code: ${code}`);
});

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/opt/fortinet/forticloud/db/fortideploy.db');

var records = [];

db.serialize(function() {
    db.each("SELECT id, username, password FROM Users", function(err, row) {
        records.push({
            id: row.id,
            username: row.username,
            password: row.password
        })
    });
});

db.close();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('SIGTSTP', () => {});

function menu() {
    console.log('1. Set IP Address');
    console.log('2. Change Password For Admin');
    console.log('3. Logout');
}

// {"method":"put","url":"/system","setting":{"ip":"192.168.0.10","netmask":"255.255.255.0","gateway":"192.168.0.1","defaultFortiManagerIp":"192.168.0.200"}}
function changeIP(rl) {
    rl.question('[ip] [netmask] [gateway] [defaultFortiManagerIp]? ', (answer) => {
        let config = S(answer).parseCSV(' ');

        let payload = {
            method: "put",
            url: "/system",
            setting: {
                ip: config[0],
                netmask: config[1],
                gateway: config[2],
                defaultFortiManagerIp: config[3]
            }
        }

        const client = net.connect({ port: 8080, host: '127.0.0.1' }, () => {
            client.write(JSON.stringify(payload));
        });

        client.on('data', (data) => {
            console.log(data.toString());
            client.end();
            rl.resume();
            rl.prompt();
        });

        rl.pause();
    });
}

function changePassword(rl) {
    rl.question('[oldPassword] [newPassword] [confirmPassword]? ', (answer) => {
        let config = S(answer).parseCSV(' ');

        if (!config[0] || !config[1] || !config[2]) {
            console.log('invalide input!')
            return rl.prompt();
        }

        if (!bcrypt.compareSync(config[0], records[0].password)) {
            console.log('old password is wrong!');
            return rl.prompt();
        }

        if (config[1] !== config[2]) {
            console.log('new and confirm password is different!');
            return rl.prompt();
        }

        const saltRounds = 10;
        const hash = bcrypt.hashSync(config[1], saltRounds);

        db = new sqlite3.Database('/opt/fortinet/forticloud/db/fortideploy.db');
        db.run('UPDATE Users SET password = ? WHERE id = 1', hash, function(err, row) {
            if (err) console.log(err);
        });

        db.each("SELECT id, username, password FROM Users", function(err, row) {
            records = [{
                id: 1,
                username: 'admin',
                password: row.password
            }]
        });

        db.close();

        console.log('password change success!');

        rl.prompt();
    });
}

let start = false;

function hide(char) {
    char = char + "";
    switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
            break;
        default:
            if (start) {
                process.stdout.write("\033[2K\033[200D" + 'Password: ' + Array(rl.line.length + 1).join("*"));
            }
            break;
    }
}

process.stdin.on("data", hide);

function main() {
    rl.setPrompt('FortiDeploy Login: ');
    rl.prompt();

    let login = false;
    let authed = false;

    rl.on('line', (line) => {
        let input = line.trim();

        if (login && authed) {
            switch (input) {
                case '1':
                    changeIP(rl)
                    break;
                case '2':
                    changePassword(rl)
                    break;
                case '3':
                    login = false;
                    authed = false;
                    rl.setPrompt('FortiDeploy Login: ');
                    rl.prompt();
                    break;
                default:
                    console.log(`Invalide option: '${line.trim()}'`);
                    rl.setPrompt('#');
                    rl.prompt();
                    break;
            }
        } else {
            if (login) {
                start = false;
                if (bcrypt.compareSync(input, records[0].password)) {
                    authed = true;
                    menu();
                    rl.setPrompt('# ');
                    rl.prompt();
                } else {
                    console.log('incorrect password!')
                    rl.setPrompt('Password: ');
                    rl.prompt();
                }
            } else {
                if (input !== 'admin') {
                    console.log('incorrect username!')
                    rl.setPrompt('FortiDeploy Login: ');
                    rl.prompt();
                } else {
                    login = true;
                    rl.setPrompt('Password: ');
                    rl.prompt();
                    start = true;
                }
            }
        }
    }).on('close', () => {
        process.exit(0);
    });
}

main();
