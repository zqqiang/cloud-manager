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
import { Input, Checkbox } from './editor.jsx'

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
class FormBody extends React.Component {
    constructor(props) {
        super(props)
        this.selfState = {}
        this.handleChange = this.handleChange.bind(this)
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
    handleChange(e) {
        const target = e.target
        const name = target.name
        const value = target.value

        const type = target.type
        if (type === 'checkbox') {
            const checked = target.checked
            this.selfState[name] = checked
        } else {
            this.selfState[name] = value
        }
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
                    <Input 
                            name="fgtIpSn"
                            label="FortiGate SN or IP"
                            labelClass="col-sm-3"
                            editorClass="col-sm-9"
                            value={this.selfState.fgtIpSn}
                            onChange={this.handleChange}
                            placeholder="Enter FortiGate SN or IP"
                    />
                    <div>
                        <p className="lead">Interface</p>
                        <InterfaceTable appState={this.selfState} />
                    </div>
                    <div>
                        <p className="lead">Routing</p>
                        <Input 
                            name="routeId"
                            label="Routing ID"
                            labelClass="col-sm-3"
                            editorClass="col-sm-9"
                            value={this.selfState.routeId}
                            onChange={this.handleChange}
                            placeholder="Enter Routing ID"
                        />
                        <Input 
                            name="routeIntf"
                            label="Device"
                            labelClass="col-sm-3"
                            editorClass="col-sm-9"
                            value={this.selfState.routeIntf}
                            onChange={this.handleChange}
                            placeholder="Enter Routing Device"
                        />
                        <Input 
                            name="routeDst"
                            label="Dest"
                            labelClass="col-sm-3"
                            editorClass="col-sm-9"
                            value={this.selfState.routeDst}
                            onChange={this.handleChange}
                            placeholder="Enter Routing Dest"
                        />
                        <Input 
                            name="routeGw"
                            label="Gateway"
                            labelClass="col-sm-3"
                            editorClass="col-sm-9"
                            value={this.selfState.routeGw}
                            onChange={this.handleChange}
                            placeholder="Enter Routing Gateway"
                        />
                    </div>
                    <div>
                        <p className="lead">Virtual Switch</p>
                        <Checkbox 
                            name="purgeVirtualSwitch"
                            label="Virtual Switch"
                            labelOffset="col-sm-offset-3"
                            editorClass="col-sm-9"
                            checked={this.selfState.purgeVirtualSwitch}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        <p className="lead">HA</p>
                        <div>
                            <Input 
                                name="haGroupName"
                                label="Group Name"
                                labelClass="col-sm-3"
                                editorClass="col-sm-9"
                                value={this.selfState.haGroupName}
                                onChange={this.handleChange}
                                placeholder="Enter Group Name"
                            />
                            <Input 
                                name="haGroupPasswd"
                                label="Password"
                                labelClass="col-sm-3"
                                editorClass="col-sm-9"
                                value={this.selfState.haGroupPasswd}
                                onChange={this.handleChange}
                                placeholder="Enter Group Password"
                            />
                            <Input 
                                name="haGroupId"
                                label="Group ID"
                                labelClass="col-sm-3"
                                editorClass="col-sm-9"
                                value={this.selfState.haGroupId}
                                onChange={this.handleChange}
                                placeholder="Enter Group ID"
                            />
                            <Input 
                                name="haPrimary"
                                label="HA Mode"
                                labelClass="col-sm-3"
                                editorClass="col-sm-9"
                                value={this.selfState.haMode}
                                onChange={this.handleChange}
                                placeholder="Enter HA Mode"
                            />
                            <Input 
                                name="haPrimary"
                                label="HA Device"
                                labelClass="col-sm-3"
                                editorClass="col-sm-9"
                                value={this.selfState.haPrimary}
                                onChange={this.handleChange}
                                placeholder="Enter HA Device"
                            />
                            <Input 
                                name="haPriority"
                                label="HA Priority"
                                labelClass="col-sm-3"
                                editorClass="col-sm-9"
                                value={this.selfState.haPriority}
                                onChange={this.handleChange}
                                placeholder="Enter HA Priority"
                            />
                        </div>
                        <div>
                            <Input 
                                name="haMgmtIntf"
                                label="HA Mgmt Interface"
                                labelClass="col-sm-3"
                                editorClass="col-sm-9"
                                value={this.selfState.haMgmtIntf}
                                onChange={this.handleChange}
                                placeholder="Enter HA Mgmt Interface"
                            />
                            <Input 
                                name="haMgmtIntfGw"
                                label="HA Mgmt Gateway"
                                labelClass="col-sm-3"
                                editorClass="col-sm-9"
                                value={this.selfState.haMgmtIntfGw}
                                onChange={this.handleChange}
                                placeholder="Enter HA Mgmt Gateway"
                            />
                            <Input 
                                name="haMgmtIntfGw6"
                                label="HA Mgmt Gateway6"
                                labelClass="col-sm-3"
                                editorClass="col-sm-9"
                                value={this.selfState.haMgmtIntfGw6}
                                onChange={this.handleChange}
                                placeholder="Enter HA Mgmt Gateway6"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="lead">FortiManager</p>
                        <div>
                            <Input 
                                name="fmgSn"
                                label="FortiManager SN"
                                labelClass="col-sm-3"
                                editorClass="col-sm-9"
                                value={this.selfState.fmgSn}
                                onChange={this.handleChange}
                                placeholder="Enter FortiManager SN"
                            />
                            <Input 
                                name="fmgIp"
                                label="FortiManager IP"
                                labelClass="col-sm-3"
                                editorClass="col-sm-9"
                                value={this.selfState.fmgIp}
                                onChange={this.handleChange}
                                placeholder="Enter FortiManager IP"
                            />
                        </div>
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
