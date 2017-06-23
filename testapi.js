const { exec } = require('child_process');
var moment = require('moment');

let token = '';
let auth = `curl -H "Content-Type: application/json" -X POST -d ' { "username": "admin", "password": "pass" } ' http://172.16.95.48/api/v1/auth -k`;

function run(cmd) {
    console.log(moment().format(), 'req:', cmd)
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(moment().format(), `rsp: ${stdout}`);
        let json = JSON.parse(stdout);
        if (json.accessToken) {
            token = json.accessToken
        }
    });
}

run(auth);

let timer = setInterval(() => {
    let backup = `curl -X GET -H "Authorization: Bearer ${token}" -k  http://172.16.95.48/api/v1/backup`;
    run(backup)
}, 1000);

setTimeout((timer) => {
    clearInterval(timer)
}, 5 * 60 * 1000, timer);
