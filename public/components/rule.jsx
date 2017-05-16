import React from 'react'
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import { observable, action, autorun } from 'mobx'
import { observer } from 'mobx-react'
import AuthInstance from '../modules/auth'

var S = require('string');
var _ = require('lodash');

let ruleStore = observable({
    rules: [],
});

ruleStore.updateRules = action(function update() {
    let options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Origin': '',
            'Host': 'localhost',
            'Authorization': 'Bearer ' + AuthInstance.getToken()
        },
    }
    return fetch('/api/Rule', options)
        .then(response => response.json())
        .then(json => {
            ruleStore.rules = json.result
        })
});

autorun(function() {

});

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

class RuleTableTr extends React.Component {
    constructor(props) {
        super(props)
    }
    onHandleClick(event) {
        let options = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': '',
                'Host': 'localhost',
                'Authorization': 'Bearer ' + AuthInstance.getToken()
            },
        }
        let url = '/api/Rule?key=' + this.props.row.fgtIpSn
        return fetch(url, options)
            .then(response => response.json())
            .then(json => {
                console.log(json)
            })
    }
    render() {
        let location = {
            pathname: '/Home/Rule/' + this.props.row.fgtIpSn
        }
        return (
            <tr>
                <td></td>
                <td>{this.props.row.fgtIpSn}</td>
                <td>{this.props.row.fmgSn}</td>
                <td>{this.props.row.fmgIp}</td>
                <td>
                    <Link to={location}><i className="fa fa-pencil fa-lg" aria-hidden="true"></i></Link>
                </td>
                <td>
                    <a><i className="fa fa-trash fa-lg" aria-hidden="true" onClick={this.onHandleClick.bind(this)}></i></a>
                </td>
            </tr>
        )
    }
}

function RuleTable({ data }) {
    let rows = [];
    data.forEach((row) => {
        rows.push(<RuleTableTr row={row} key={row.fgtIpSn}/>)
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

@observer
class BoxBody extends React.Component {
    constructor(props) {
        super(props)
        ruleStore.updateRules()
    }
    render() {
        return (
            <div className="box-body">
                <RuleTable data={ruleStore.rules}/>
            </div>
        )
    }
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

function InputText({ options, onChange, name, value }) {
    return (
        <div className="form-group">
            <label className="col-sm-3 control-label">{options.label}</label>
            <div className="col-sm-9">
                <input type="text" 
                    className="form-control" 
                    placeholder={options.placeholder} 
                    name={name}
                    value={value} 
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

@observer
class Condition extends React.Component {
    constructor(props) {
        super(props);
    }
    onChange(event) {
        this.props.appState.fgtIpSn = event.target.value;
    }
    render() {
        let options = { label: 'FortiGate SN or IP', placeholder: 'Enter FortiGate SN or IP' };
        return (
            <InputText options={options} onChange={this.onChange.bind(this)} value={this.props.appState.fgtIpSn} />
        )
    }
}

@observer
class InterfaceDevice extends React.Component {
    constructor(props) {
        super(props);
    }
    onChange(event) {
        this.props.appState.intfName = event.target.value;
    }
    render() {
        let options = { label: 'Device', placeholder: 'Enter Interface Device' };
        return (
            <InputText options={options} onChange={this.onChange.bind(this)} value={this.props.appState.intfName}/>
        )
    }
}

@observer
class InterfaceIpMask extends React.Component {
    constructor(props) {
        super(props)
    }
    onChange(event) {
        this.props.appState.intfIpMask = event.target.value
    }
    render() {
        let options = { label: 'IP&Mask', placeholder: 'Enter Interface IP&Mask' }
        return (
            <InputText options={options} onChange={this.onChange.bind(this)} value={this.props.appState.intfIpMask} />
        )
    }
}

// <id> <device> <dst> <gateway>
@observer
class RoutingId extends React.Component {
    constructor(props) {
        super(props)
    }
    onChange(event) {
        this.props.appState.routeId = event.target.value
    }
    render() {
        let options = { label: 'ID', placeholder: 'Enter Routing ID' }
        return (
            <InputText options={options} onChange={this.onChange.bind(this)} value={this.props.appState.routeId} />
        )
    }
}
@observer
class RoutingDevice extends React.Component {
    constructor(props) {
        super(props)
    }
    onChange(event) {
        this.props.appState.routeIntf = event.target.value
    }
    render() {
        let options = { label: 'Device', placeholder: 'Enter Routing Device' }
        return (
            <InputText options={options} onChange={this.onChange.bind(this)} value={this.props.appState.routeIntf} />
        )
    }
}
@observer
class RoutingDest extends React.Component {
    constructor(props) {
        super(props)
    }
    onChange(event) {
        this.props.appState.routeDst = event.target.value
    }
    render() {
        let options = { label: 'Dest', placeholder: 'Enter Routing Dest' }
        return (
            <InputText options={options} onChange={this.onChange.bind(this)} value={this.props.appState.routeDst} />
        )
    }
}
@observer
class RoutingGateway extends React.Component {
    constructor(props) {
        super(props)
    }
    onChange(event) {
        this.props.appState.routeGw = event.target.value
    }
    render() {
        let options = { label: 'Gateway', placeholder: 'Enter Routing Gateway' }
        return (
            <InputText options={options} onChange={this.onChange.bind(this)} value={this.props.appState.routeGw} />
        )
    }
}

@observer
class Switch extends React.Component {
    constructor(props) {
        super(props)
    }
    onChange(event) {
        this.props.appState.purgeVirtualSwitch = event.target.value
    }
    render() {
        return (
            <div className="form-group">
                <div className="col-sm-offset-3 col-sm-9">
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" checked={this.props.appState.purgeVirtualSwitch} onChange={this.onChange.bind(this)} /> Purge
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}

// HA := HA: <group-name> <password> <group-id> <ha-mode> <ha-dev> <priority> 

@observer
class HA extends React.Component {
    constructor(props) {
        super(props)
    }
    onChange(event) {
        const name = event.target.name
        const value = event.target.value
        this.props.appState[name] = value
    }
    render() {
        return (
            <div>
                <InputText 
                    options={{label:'Group Name', placeholder: 'Enter Name'}}
                    onChange={this.onChange.bind(this)}
                    name="haGroupName"
                    value={this.props.appState.haGroupName}
                />
                <div className="form-group">
                    <label className="col-sm-3 control-label">Password</label>
                    <div className="col-sm-9" >
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Password"
                            name="haGroupPasswd"
                            value={this.props.appState.haGroupPasswd}
                            onChange={this.onChange.bind(this)}
                        />
                    </div>
                </div>
                <InputText 
                    options={{label: 'Group ID', placeholder: 'Enter ID'}}
                    onChange={this.onChange.bind(this)}
                    name="haGroupId"
                    value={this.props.appState.haGroupId}
                />
                <InputText 
                    options={{label: 'HA Mode', placeholder: 'Enter Mode'}}
                    onChange={this.onChange.bind(this)}
                    name="haMode"
                    value={this.props.appState.haMode}
                />
                <InputText 
                    options={{label: 'HA Device', placeholder: 'Enter Device'}}
                    onChange={this.onChange.bind(this)}
                    name="haPrimary"
                    value={this.props.appState.haPrimary}
                />
                <InputText 
                    options={{label: 'HA Priority', placeholder: 'Enter Priority'}}
                    onChange={this.onChange.bind(this)}
                    name="haPriority"
                    value={this.props.appState.haPriority}
                />
            </div>
        )
    }
}

// [ <ha-mgmt-interface> <ha-mgmt-interface-gateway> [ha-mgmt-interface-gateway6] ];

@observer
class HAMgmt extends React.Component {
    constructor(props) {
        super(props)
    }
    onChange(event) {
        const name = event.target.name
        const value = event.target.value
        this.props.appState[name] = value
    }
    render() {
        return (
            <div>
                <InputText 
                    options={{label:'HA Mgmt Interface', placeholder: 'Enter Interface'}}
                    name="haMgmtIntf"
                    value={this.props.appState.haMgmtIntf}
                    onChange={this.onChange.bind(this)}
                />
                <InputText 
                    options={{label:'HA Mgmt Gateway', placeholder: 'Enter Gateway'}}
                    name="haMgmtIntfGw"
                    value={this.props.appState.haMgmtIntfGw}
                    onChange={this.onChange.bind(this)}
                />
                <InputText 
                    options={{label: 'HA Mgmt Gateway6', placeholder: 'Enter Gateway6'}}
                    name="haMgmtIntfGw6"
                    value={this.props.appState.haMgmtIntfGw6}
                    onChange={this.onChange.bind(this)}
                />
            </div>
        )
    }
}

// FMG := FMG: <fmg-ip> <fmg-sn>;
@observer
class FortiManager extends React.Component {
    constructor(props) {
        super(props)
    }
    onChange(event) {
        const name = event.target.name
        const value = event.target.value
        this.props.appState[name] = value
    }
    render() {
        return (
            <div>
                <InputText 
                    options={{label:'FortiManager SN', placeholder: 'Enter SN'}}
                    name="fmgSn"
                    value={this.props.appState.fmgSn}
                    onChange={this.onChange.bind(this)}
                />
                <InputText 
                    options={{label:'FortiManager IP', placeholder: 'Enter IP'}}
                    name="fmgIp"
                    value={this.props.appState.fmgIp}
                    onChange={this.onChange.bind(this)}
                />
            </div>
        )
    }
}

const CancelButton = withRouter(({ history }) => {
    return ( 
        <button 
            type = "submit"
            className = "btn btn-default"
            onClick = {
                () => {
                    history.push('/Home/Rule')
                }
            } 
        >
            Cancel 
        </button>
    )
})

class FormBody extends React.Component {
    constructor(props) {
        super(props)
        this.selfState = {}
    }
    onHandleSubmit(event) {
        const key = S(window.location.hash).strip('#/Home/Rule/').s;

        let url = '';
        let method = '';
        
        if (key) {
            url = '/api/Rule?key=' + key;
            method = 'PUT';
        } else {
            url = '/api/Rule';
            method = 'POST';
        }

        let options = {
            method: method,
            headers: {
                'Accept': 'application\/json',
                'Content-Type': 'application\/json',
                'Origin': '',
                'Host': 'localhost',
                'Authorization': 'Bearer ' + AuthInstance.getToken()
            },
            body: JSON.stringify(this.selfState)
        }

        fetch(url, options)
            .then(response => response.json())
            .then(json => {
                console.log(json)
            })

        const { match, location, history } = this.props
        history.push('/Home/Rule')
    }
    render() {
        // #/Home/Rule/xxxx
        const key = S(window.location.hash).strip('#/Home/Rule/').s;

        if (key) {
            let index = _.findIndex(ruleStore.rules, function(o) {
                return o.fgtIpSn === key;
            })
            if (index >= 0) {
                this.selfState = ruleStore.rules[index];
            }
        }

        return (
            <div className="form-horizontal">
                <div className="box-body">
                    <Condition appState={this.selfState} />
                    <div className="hr-line-dashed"></div>
                    <InterfaceDevice appState={this.selfState} />
                    <InterfaceIpMask appState={this.selfState} />
                    <div className="hr-line-dashed"></div>
                    <RoutingId appState={this.selfState} />
                    <RoutingDevice appState={this.selfState} />
                    <RoutingDest appState={this.selfState} />
                    <RoutingGateway appState={this.selfState} />
                    <div className="hr-line-dashed"></div>
                    <Switch appState={this.selfState} />
                    <div className="hr-line-dashed"></div>
                    <HA appState={this.selfState} />
                    <div className="hr-line-dashed"></div>
                    <HAMgmt appState={this.selfState} />
                    <div className="hr-line-dashed"></div>
                    <FortiManager appState={this.selfState} />
                </div>
                <div className="box-footer">
                    <CancelButton />
                    <button 
                        type="submit" 
                        className="btn btn-primary pull-right" 
                        onClick={this.onHandleSubmit.bind(this)} 
                    >
                        Submit
                    </button>
                </div>
            </div>
        )
    }
}

const FormBodyWithRouter = withRouter(FormBody)

function FormContent() {
    return (
        <section className="content">
            <div className="row">
                <div className="col-md-6">
                    <div className="box box-primary">
                        <FormTitle />
                        <FormBodyWithRouter />
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