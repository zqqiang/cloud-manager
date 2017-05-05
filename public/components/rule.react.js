import React from 'react'
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

function TableHeader() {
    return (
        <section className="content-header">
            <h1>
                Rule Tables
                <small>preview of rule tables</small>
            </h1>
            <ol className="breadcrumb">
                <li><Link to="/Home"><i className="fa fa-dashboard"></i> Home</Link></li>
                <li><Link to="/Home/Rule"> Rules</Link></li>
                <li className="active"> Config</li>
            </ol>
        </section>
    )
}

const BoxHeader = withRouter(({ history }) => {
    return (
        <div className="box-header with-border">
            <h3 className="box-title">Rule Table</h3>
            <div className="box-tools">
                <button type="button" className="btn btn-block btn-primary" onClick={(e) => {
                    history.push("/Home/New")
                }}>
                    <i className="fa fa-plus" aria-hidden="true"></i> Create New
                </button>
            </div>
        </div>
    )
})

function RuleTableHeader() {
    return (
        <tr>
            <th style={{width: '10px'}}>#</th>
            <th>FortiGate SN/IP</th>
            <th>FortiManager SN</th>
            <th>FortiManager IP</th>
            <th style={{width: '40px'}}></th>
            <th style={{width: '40px'}}></th>
        </tr>
    )
}

function RuleTableTr({ row }) {
    return (
        <tr>
            <td>{row.id}</td>
            <td>{row.fgt}</td>
            <td>{row.fmgsn}</td>
            <td>{row.fmgip}</td>
            <td>
                <i className="fa fa-pencil fa-lg" aria-hidden="true"></i>
            </td>
            <td>
                <i className="fa fa-trash fa-lg" aria-hidden="true"></i>
            </td>
        </tr>
    )
}

function RuleTable({ data }) {
    let rows = [];
    data.forEach((row) => {
        rows.push(<RuleTableTr row={row} key={row.id}/>)
    })
    return (
        <table className="table table-bordered">
            <tbody>
                <RuleTableHeader />
                {rows}
            </tbody>
        </table>
    )
}

let data = [{
    id: 1,
    fgt: '192.168.0.2',
    fmgsn: 'FMG-VM0A11000137',
    fmgip: '172.16.95.58',
}, {
    id: 2,
    fgt: 'FGT60D4615007833',
    fmgsn: 'FMG-VM0A11000138',
    fmgip: '172.16.95.59',
}]

function BoxBody() {
    return (
        <div className="box-body">
            <RuleTable data={data}/>
        </div>
    )
}

function BoxFooter() {
    return (
        <div className="box-footer clearfix">
            <ul className="pagination pagination-sm no-margin pull-right">
                <li><a href="#">«</a></li>
                <li><a href="#">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">»</a></li>
            </ul>
        </div>
    )
}

function TableContent() {
    return (
        <section className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="box">
                        <BoxHeader />
                        <BoxBody />
                        <BoxFooter />
                    </div>
                </div>
            </div>
        </section>
    )
}

function Rule() {
    return (
        <div>
            <TableHeader />
            <TableContent />
        </div>
    )
}

function FormHeader() {
    return (
        <section className="content-header">
            <h1>
                Rule Form
                <small>preview of rule form</small>
            </h1>
            <ol className="breadcrumb">
                <li><Link to="/Home"><i className="fa fa-dashboard"></i> Home</Link></li>
                <li><Link to="/Home/Rule"> Rules</Link></li>
                <li className="active"> New</li>
            </ol>
        </section>
    )
}

function FormTitle() {
    return (
        <div className="box-header with-border">
            <h3 className="box-title">Create New Rule</h3>
        </div>
    )
}

/*
Update deployment rule definition:

  RULE := <CONDITION> [INTERFACE] [ROUTING] [VIRTUAL-SWITCH] [HA] <FMG>
  CONDITION := <fgt-sn> | <fgt-ip>
  INTERFACE := Interface: <device> <ip&mask>;
  ROUTING := Router-Static: <id> <device> <dst> <gateway>;
  VIRTUAL-SWITCH := Virtual-Switch: purge;
  HA := HA: <group-name> <password> <group-id> <ha-mode> <ha-dev> <priority> [ <ha-mgmt-interface> <ha-mgmt-interface-gateway> [ha-mgmt-interface-gateway6] ];
  FMG := FMG: <fmg-ip> <fmg-sn>;

Example:
  192.168.0.2 Interface: wan1 192.168.0.2/24; Router-Static: 1 wan1 0.0.0.0/0 192.168.0.1; Virtual-Switch: purge; HA: Group00001 Password00001 1 a-p internal7 128; FMG: 172.16.95.58 FMG-VM0A11000137
  
  # enable HA MGMT INTF with IPv6 GW
  192.168.0.3 Interface: wan1 192.168.0.3/24; Router-Static: 1 wan1 0.0.0.0/0 192.168.0.1; Virtual-Switch: purge; HA: Group00002 Password00002 1 a-p internal7 64 enable wan2 192.168.0.1 2a06:b501:c675:1::1; FMG: 172.16.95.58 FMG-VM0A11000137
  
  # eanble HA MGMT INTF without IPv6 GW
  192.168.0.4 Interface: wan1 192.168.0.4/24; Router-Static: 1 wan1 0.0.0.0/0 192.168.0.1; Virtual-Switch: purge; HA: Group00002 Password00002 1 a-p internal7 64 enable wan2 192.168.0.1; FMG: 172.16.95.58 FMG-VM0A11000137
  
  # disable HA MGMT INTF
  192.168.0.5 Interface: wan1 192.168.0.5/24; Router-Static: 1 wan1 0.0.0.0/0 192.168.0.1; Virtual-Switch: purge; HA: Group00003 Password00003 1 a-p internal7 128 disable; FMG: 172.16.95.58 FMG-VM0A11000137
*/

function InputText({ options, onChange, value }) {
    return (
        <div className="form-group">
            <label >{options.label}</label>
            <input type="text" 
                className="form-control" 
                placeholder={options.placeholder} 
                value={value} 
                onChange={onChange}
            />
        </div>
    )
}

var appState = observable({
    fgtIpSn: ' FGT60D4615007833',
});

@observer
class Condition extends React.Component {
    constructor(props) {
        super(props);
    }
    onChange(event) {
        console.log(event.target.value)
        this.props.appState.fgtIpSn = event.target.value;
    }
    render() {
        let options = { label: 'FortiGate SN or IP', placeholder: 'Enter FortiGate SN or IP' };
        return (
            <InputText options={options} onChange={this.onChange.bind(this)} value={this.props.appState.fgtIpSn} />
        )
    }
}

function InterfaceDevice() {
    return (
        <InputText options={{label: 'Device', placeholder: 'Enter Interface Device'}} />
    )
}

function InterfaceIpMask() {
    return (
        <InputText options={{label: 'IP&Mask', placeholder: 'Enter Interface IP&Mask'}} />
    )
}

function Interface() {
    return (
        <div className="row">
            <div className="col-md-6">
                <InterfaceDevice />
            </div>
            <div className="col-md-6">
                <InterfaceIpMask />
            </div>
        </div>
    )
}

// <id> <device> <dst> <gateway>

function RoutingId() {
    return (
        <InputText options={{label: 'ID', placeholder: 'Enter Routing ID'}} />
    )
}

function RoutingDevice() {
    return (
        <InputText options={{label: 'Device', placeholder: 'Enter Routing Device'}} />
    )
}

function RoutingDest() {
    return (
        <InputText options={{label: 'Dest', placeholder: 'Enter Routing Dest'}} />
    )
}

function RoutingGateway() {
    return (
        <InputText options={{label: 'Gateway', placeholder: 'Enter Routing Gateway'}} />
    )
}

function Routing() {
    return (
        <div className="row">
            <div className="col-md-3">
                <RoutingId />
            </div>
            <div className="col-md-3">
                <RoutingDevice />
            </div>
            <div className="col-md-3">
                <RoutingDest />
            </div>
            <div className="col-md-3">
                <RoutingGateway />
            </div>
        </div>
    )
}

function Switch() {
    return (
        <div className="form-group">
            <label >Virtual Switch</label>
            <div className="checkbox">
                <label>
                    <input type="checkbox" /> Purge
                </label>
            </div>
        </div>
    )
}

// HA := HA: <group-name> <password> <group-id> <ha-mode> <ha-dev> <priority> 

function InputPassword() {
    return (
        <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" />
        </div>
    )
}

function HA() {
    return (
        <div className="row">
            <div className="col-md-2">
                <InputText options={{label:'Group Name', placeholder: 'Enter Name'}}/>
            </div>
            <div className="col-md-2">
                <InputPassword />
            </div>
            <div className="col-md-2">
                <InputText options={{label: 'Group ID', placeholder: 'Enter ID'}}/>
            </div>
            <div className="col-md-2">
                <InputText options={{label: 'HA Mode', placeholder: 'Enter Mode'}}/>
            </div>
            <div className="col-md-2">
                <InputText options={{label: 'HA Device', placeholder: 'Enter Device'}}/>
            </div>
            <div className="col-md-2">
                <InputText options={{label: 'HA Priority', placeholder: 'Enter Priority'}}/>
            </div>
        </div>
    )
}

// [ <ha-mgmt-interface> <ha-mgmt-interface-gateway> [ha-mgmt-interface-gateway6] ];

function HAMgmt() {
    return (
        <div className="row">
            <div className="col-md-4">
                <InputText options={{label:'HA Mgmt Interface', placeholder: 'Enter Interface'}}/>
            </div>
            <div className="col-md-4">
                <InputText options={{label:'HA Mgmt Gateway', placeholder: 'Enter Gateway'}}/>
            </div>
            <div className="col-md-4">
                <InputText options={{label: 'HA Mgmt Gateway6', placeholder: 'Enter Gateway6'}}/>
            </div>
        </div>
    )
}

// FMG := FMG: <fmg-ip> <fmg-sn>;
function FortiManager() {
    return (
        <div className="row">
            <div className="col-md-6">
                <InputText options={{label:'FortiManager SN', placeholder: 'Enter SN'}}/>
            </div>
            <div className="col-md-6">
                <InputText options={{label:'FortiManager IP', placeholder: 'Enter IP'}}/>
            </div>
        </div>
    )
}

class FormBody extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div role="form">
            <div className="box-body">
                <Condition appState={appState}/>
                <Interface />
                <Routing />
                <Switch />
                <HA />
                <HAMgmt />
                <FortiManager />
            </div>
            <div className="box-footer">
                <button type="submit" className="btn btn-default">Cancel</button>
                <button type="submit" className="btn btn-primary pull-right">Submit</button>
            </div>
        </div>
        )
    }
}

function FormContent() {
    return (
        <section className="content">
            <div className="row">
                <div className="col-md-6">
                    <div className="box box-primary">
                        <FormTitle />
                        <FormBody />
                    </div>
                </div>
            </div>
        </section>
    )
}

function RuleForm() {
    return (
        <div>
            <FormHeader />
            <FormContent />
        </div>
    )
}

export { Rule, RuleForm }
