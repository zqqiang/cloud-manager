const net = require('net');
var _ = require('lodash');

function factory() {
    let datas = [];

    for (let i = 0; i < 10000; ++i) {
        datas.push({
            "id": i + 1,
            "fgtIpSn": "FGT60D46130533" + i,
            "fmgIp": "172.16.95." + i,
            "fmgSn": "FMG-VM0A110001" + i,
            "interfaces": [{
                "intfName": "wan1",
                "intfIpMask": "172.16.95.101/255.255.255.0",
            }, {
                "intfName": "wan2",
                "intfIpMask": "172.16.95.102/255.255.255.0",
            }],
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
        })
    }

    return datas;
}

const datas = factory();

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
            const offset = json.page.offset
            const limit = json.page.limit

            payload = {
                code: 0,
                message: "ok",
                totalRecords: 10000,
                result: _.slice(datas, offset * limit, (offset + 1) * limit)
            }
        } else if (json.url === '/rules' && json.method === 'post') {
            json.rule['id'] = datas.length + 1
            datas.push(json.rule)
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
            datas = _.filter(datas, function(o) {
                return (o.id != json.rule['id'])
            })
            payload = {
                code: 0,
                message: "ok",
            }
        } else if (json.url === '/system/backup' && json.method === 'get') {
            payload = {
                code: 0,
                message: "ok",
                filename: "/var/log/auth.log",
            }
        } else if (json.url === '/system/restore' && json.method === 'put') {
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
