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
import Fetch from '../modules/net'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var S = require('string');
var _ = require('lodash');

let ruleStore = observable({
    rules: [],
});

ruleStore.updateRules = action(function update(history) {
    return Fetch({
        method: 'GET',
        url: '/api/Rule',
        history: history,
        cb: (json) => {
            ruleStore.rules = json.result
        }
    })
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
        const { history } = this.props
        let url = '/api/Rule?key=' + this.props.row.id
        return Fetch({
            method: 'DELETE',
            url: url,
            history: history,
            cb: (json) => {
                history.push('/Home/Rule')
            }
        })
    }
    render() {
        let location = {
            pathname: '/Home/Rule/' + this.props.row.id
        }
        return (
            <tr>
                <td>{this.props.row.id}</td>
                <td>{this.props.row.fgtIpSn}</td>
                <td>{this.props.row.fmgSn}</td>
                <td>{this.props.row.fmgIp}</td>
                <td>
                    <Link to={location}><i className="fa fa-pencil fa-lg" aria-hidden="true"></i></Link>
                </td>
                <td>
                    <Link to={location}><i className="fa fa-trash fa-lg" aria-hidden="true" onClick={this.onHandleClick.bind(this)}></i></Link>
                </td>
            </tr>
        )
    }
}

const RuleTableTrWithRouter = withRouter(RuleTableTr)

function RuleTable({ data }) {
    let rows = [];
    data.forEach((row) => {
        rows.push(<RuleTableTrWithRouter row={row} key={row.id}/>)
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
        const { history } = this.props
        ruleStore.updateRules(history)
    }
    render() {
        return (
            <div className="box-body">
                <RuleTable data={ruleStore.rules}/>
            </div>
        )
    }
}

const BoxBodyWithRouter = withRouter(BoxBody)

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
                        <BoxBodyWithRouter />
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
    onClick() {
        let state = this.props.appState
        state.purgeVirtualSwitch = !state.purgeVirtualSwitch
    }
    render() {
        return (
            <div className="form-group">
                <div className="col-sm-offset-3 col-sm-9">
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" checked={this.props.appState.purgeVirtualSwitch} onClick={this.onClick.bind(this)} /> Purge
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

class CancelButton extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        const { history } = this.props
        history.push('/Home/Rule')
    }
    render() {
        return (
            <button 
                type = "submit"
                className = "btn btn-default"
                onClick = {this.handleClick}
            >
                Cancel
            </button>
        )
    }
}

const cellEditProp = {
    mode: 'click'
};

const selectRowProp = {
    mode: 'checkbox'
};

class InterfaceTable extends React.Component {
    constructor(props) {
        super(props)
        this.onAfterInsertRow = this.onAfterInsertRow.bind(this)
        this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this)
        this.options = {
            afterInsertRow: this.onAfterInsertRow,
            afterDeleteRow: this.onAfterDeleteRow,
        }
    }
    onAfterInsertRow(row) {
        if (!this.props.appState.interfaces) {
            this.props.appState.interfaces = []
        }
        this.props.appState.interfaces.push(row)
    }
    onAfterDeleteRow(rowKeys) {
        this.props.appState.interfaces = _.filter(this.props.appState.interfaces, function(o) {
            return _.indexOf(rowKeys, o.id) < 0
        })
        console.log(this.props.appState.interfaces)
    }
    render() {
        return (
            <BootstrapTable 
                data={ this.props.appState.interfaces } 
                cellEdit={ cellEditProp } 
                insertRow={ true } 
                options={ this.options } 
                deleteRow={ true } 
                selectRow={ selectRowProp } 
            >
                <TableHeaderColumn dataField='id' isKey>Interface ID</TableHeaderColumn>
                <TableHeaderColumn dataField='intfName'>Device</TableHeaderColumn>
                <TableHeaderColumn dataField='intfIpMask'>IP & Mask</TableHeaderColumn>
            </BootstrapTable>
        )
    }
}

const CancelButtonWithRouter = withRouter(CancelButton)
@observer
class Interface extends React.Component {
    constructor(props) {
        super(props)
        this.handleToggleClick = this.handleToggleClick.bind(this)
        let hasTable = this.props.appState.interfaces && this.props.appState.interfaces.length != 0;
        this.state = {
            showTable: hasTable,
            isEdit: hasTable
        }
    }
    handleToggleClick(e) {
        let hasTable = this.props.appState.interfaces && this.props.appState.interfaces.length != 0;
        this.setState(prevState => ({
            showTable: !prevState.showTable,
            isEdit: hasTable
        }))
    }
    render() {
        if (this.state.showTable) {
            return (
                <div>
                    <p className="lead">Interface <i className="fa fa-expand" aria-hidden="true" onClick={this.handleToggleClick} ></i></p>
                    <InterfaceTable appState={this.props.appState} />
                </div>
            )
        } else {
            return (
                <div>
                    <p className="lead">
                        Interface <i className="fa fa-compress" aria-hidden="true" onClick={this.handleToggleClick} >
                        </i>{ this.state.isEdit && <i className="fa fa-bars" aria-hidden="true"></i> }
                    </p>
                </div>
            )
        }
    }
}
@observer
class Routing extends React.Component {
    constructor(props) {
        super(props)
        this.handleToggleClick = this.handleToggleClick.bind(this)
        const state = this.props.appState
        let hasContent = state.routeId || state.routeGw || state.routeDst || state.routeIntf
        this.state = {
            showContent: hasContent,
            isEdit: hasContent
        }
    }
    handleToggleClick(e) {
        const state = this.props.appState
        let hasContent = state.routeId || state.routeGw || state.routeDst || state.routeIntf
        this.setState(prevState => ({
            showContent: !prevState.showContent,
            isEdit: hasContent
        }))
    }
    render() {
        if (this.state.showContent) {
            return (
                <div>
                    <p className="lead">Routing <i className="fa fa-expand" aria-hidden="true" onClick={this.handleToggleClick} ></i></p>
                    <RoutingId appState={this.props.appState} />
                    <RoutingDevice appState={this.props.appState} />
                    <RoutingDest appState={this.props.appState} />
                    <RoutingGateway appState={this.props.appState} />
                </div>
            )
        } else {
            return (
                <div>
                    <p className="lead">
                        Routing <i className="fa fa-compress" aria-hidden="true" onClick={this.handleToggleClick} >
                        </i>{ this.state.isEdit && <i className="fa fa-bars" aria-hidden="true"></i> }
                    </p>
                </div>
            )
        }
    }
}
@observer
class VirtualSwitch extends React.Component {
    constructor(props) {
        super(props)
        this.handleToggleClick = this.handleToggleClick.bind(this)
        const state = this.props.appState
        let hasContent = state.purgeVirtualSwitch
        this.state = {
            showContent: hasContent,
            isEdit: hasContent
        }
    }
    handleToggleClick(e) {
        const state = this.props.appState
        let hasContent = state.purgeVirtualSwitch
        this.setState(prevState => ({
            showContent: !prevState.showContent,
            isEdit: hasContent
        }))
    }
    render() {
        if (this.state.showContent) {
            return (
                <div>
                    <p className="lead">Virtual Switch <i className="fa fa-expand" aria-hidden="true" onClick={this.handleToggleClick} ></i></p>
                    <Switch appState={this.props.appState} />
                </div>
            )
        } else {
            return (
                <div>
                    <p className="lead">
                        Virtual Switch <i className="fa fa-compress" aria-hidden="true" onClick={this.handleToggleClick} >
                        </i>{ this.state.isEdit && <i className="fa fa-bars" aria-hidden="true"></i> }
                    </p>
                </div>
            )
        }
    }
}

@observer
class HAConfig extends React.Component {
    constructor(props) {
        super(props)
        this.handleToggleClick = this.handleToggleClick.bind(this)
        const state = this.props.appState
        let hasContent = state.haGroupId ||
            state.haMode ||
            state.haPriority ||
            state.haPrimary ||
            state.haGroupName ||
            state.haGroupPasswd ||
            state.haMgmtIntf ||
            state.haMgmtIntfGw ||
            state.haMgmtIntfGw6
        this.state = {
            showContent: hasContent,
            isEdit: hasContent
        }
    }
    handleToggleClick(e) {
        const state = this.props.appState
        let hasContent = state.haGroupId ||
            state.haMode ||
            state.haPriority ||
            state.haPrimary ||
            state.haGroupName ||
            state.haGroupPasswd ||
            state.haMgmtIntf ||
            state.haMgmtIntfGw ||
            state.haMgmtIntfGw6
        this.setState(prevState => ({
            showContent: !prevState.showContent,
            isEdit: hasContent
        }))
    }
    render() {
        if (this.state.showContent) {
            return (
                <div>
                    <p className="lead">HA <i className="fa fa-expand" aria-hidden="true" onClick={this.handleToggleClick} ></i></p>
                    <HA appState={this.props.appState} />
                    <HAMgmt appState={this.props.appState} />
                </div>
            )
        } else {
            return (
                <div>
                    <p className="lead">
                        HA <i className="fa fa-compress" aria-hidden="true" onClick={this.handleToggleClick} >
                        </i>{ this.state.isEdit && <i className="fa fa-bars" aria-hidden="true"></i> }
                    </p>
                </div>
            )
        }
    }
}

class FormBody extends React.Component {
    constructor(props) {
        super(props)
        this.selfState = {}
    }
    onHandleSubmit(event) {
        const key = S(window.location.hash).strip('#/Home/Rule/').s;

        let url = '';
        let method = '';

        if (parseInt(key)) {
            url = '/api/Rule?key=' + key;
            method = 'PUT';
        } else {
            url = '/api/Rule';
            method = 'POST';
        }

        const { history } = this.props
        return Fetch({
            method: method,
            url: url,
            body: this.selfState,
            history: history,
            cb: (json) => {
                history.push('/Home/Rule')
            }
        })
    }
    render() {
        // #/Home/Rule/xxxx
        const key = S(window.location.hash).strip('#/Home/Rule/').s;

        if (key) {
            let index = _.findIndex(ruleStore.rules, function(o) {
                return o.id == key;
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
                    <Interface appState={this.selfState} />
                    <div className="hr-line-dashed"></div>
                    <Routing appState={this.selfState} />
                    <div className="hr-line-dashed"></div>
                    <VirtualSwitch appState={this.selfState} />
                    <div className="hr-line-dashed"></div>
                    <HAConfig appState={this.selfState} />
                    <div className="hr-line-dashed"></div>
                    <div>
                        <p className="lead">FortiManager</p>
                        <FortiManager appState={this.selfState} />
                    </div>
                </div>
                <div className="box-footer">
                    <CancelButtonWithRouter />
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
