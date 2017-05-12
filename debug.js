const dgram = require('dgram');
const debugServer = dgram.createSocket('udp4');

debugServer.on('error', (err) => {
    console.log(`debugServer error:\n${err.stack}`);
    debugServer.close();
});


debugServer.on('message', (msg, rinfo) => {
    console.log(`debugServer got: ${msg} from ${rinfo.address}:${rinfo.port}`);

    let payload = {};
    let json = JSON.parse(msg)

    if (json.url === '/system' && json.method === 'get') {
        payload = {
            code: 0,
            message: "ok",
            result: {
                ip: "192.168.0.10",
                netmask: "255.255.255.0",
                gateway: "192.168.0.1",
                defaultFortimanageIp: "192.168.0.200"
            }
        }
    } else if (json.url === '/system' && json.method === 'put') {
        payload = {
            code: 0,
            message: "ok"
        }
    } else if (json.url === '/rules' && json.method === 'get') {
        payload = {
            code: 0,
            message: "ok",
            result: [{
                fgtIpSn: "1.1.1.1",
                mgmtSN: "FGTXXX0123456789",
                mgmtIP: "2.2.2.2"
            }, {
                fgtIpSn: "1.1.1.2",
                mgmtSN: "FGTXXX0123456788",
                mgmtIP: "2.2.2.3"
            }]
        }
    } else if (json.url === '/rules' && json.method === 'post') {
        payload = {
            code: 0,
            message: "ok",
        }
    } else if (json.url === '/rules' && json.method === 'put') {
        payload = {
            code: 0,
            message: "ok",
        }
    } else if (json.url === '/rules' && json.method === 'delete') {
        payload = {
            code: 0,
            message: "ok",
        }
    }

    const message = Buffer.from(JSON.stringify(payload));

    debugServer.send(message, 9090, 'localhost', (err) => {

    });
});

debugServer.on('listening', () => {
    var address = debugServer.address();
    console.log(`debugServer listening ${address.address}:${address.port}`);
});

debugServer.bind(8080);
