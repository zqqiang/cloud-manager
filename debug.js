const net = require('net');

const server = net.createServer((c) => {
    c.on('end', () => {

    });

    c.on('data', (data) => {
        let payload = {};
        let json = JSON.parse(data)

        console.log('receive: ' + JSON.stringify(json))

        if (json.url === '/system' && json.method === 'get') {
            payload = {
                code: 0,
                message: "ok",
                result: {
                    ip: "192.168.0.10",
                    netmask: "255.255.255.0",
                    gateway: "192.168.0.1",
                    defaultFortiManageIp: "192.168.0.200"
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
                    "fgtIpSn": "FGT60D4613053384",
                    "fmgIp": "172.16.95.58",
                    "fmgSn": "FMG-VM0A11000137\n",
                    "haDev": "wan1",
                    "haGroupId": 1,
                    "haGroupName": "Group00001",
                    "haGroupPasswd": "Password00001",
                    "haMgmtIntf": "wan2",
                    "haMgmtIntfGw": "192.168.0.1",
                    "haMgmtIntfGw6": "2a06:b501:c675:1::1",
                    "haMgmtStatus": "enable",
                    "haMode": "a-p",
                    "haPrimary": 1,
                    "haPriority": 128,
                    "intfIpMask": "192.168.0.24/24",
                    "intfName": "wan1",
                    "purgeVirtualSwitch": 1,
                    "routeDst": "0.0.0.0/0",
                    "routeGw": "192.168.0.1",
                    "routeId": 1,
                    "routeIntf": "wan1"
                }, {
                    "fgtIpSn": "FGT60D4613053385",
                    "fmgIp": "172.16.95.58",
                    "fmgSn": "FMG-VM0A11000137\n",
                    "haDev": "wan1",
                    "haGroupId": 1,
                    "haGroupName": "Group00001",
                    "haGroupPasswd": "Password00001",
                    "haMgmtIntf": "wan2",
                    "haMgmtIntfGw": "192.168.0.1",
                    "haMgmtIntfGw6": "2a06:b501:c675:1::1",
                    "haMgmtStatus": "enable",
                    "haMode": "a-p",
                    "haPrimary": 1,
                    "haPriority": 128,
                    "intfIpMask": "192.168.0.24/24",
                    "intfName": "wan1",
                    "purgeVirtualSwitch": 1,
                    "routeDst": "0.0.0.0/0",
                    "routeGw": "192.168.0.1",
                    "routeId": 1,
                    "routeIntf": "wan1"
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

        c.write(JSON.stringify(payload))

        console.log('send: ' + JSON.stringify(payload))
    })
});



server.on('error', (err) => {
    throw err;
});

server.listen(8080, () => {
    console.log('tcp server bound 8080');
});
