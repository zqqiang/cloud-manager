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
import { Input, Checkbox, Select } from './editor.jsx'

var S = require('string');
var _ = require('lodash');

let ruleStore = observable({
    rules: [],
    new: {
        haDev: '',
        haGroupId: '',
        haGroupName: '',
        haGroupPasswd: '',
        haMgmtIntf: '',
        haMgmtIntfGw: '',
        haMgmtIntfGw6: '',
        haMgmtStatus: '',
        haMode: '',
        haPrimary: '',
        haPriority: '',
        intfIpMask: '',
        intfName: '',
        purgeVirtualSwitch: '',
        routeDst: '',
        routeGw: '',
        routeId: '',
        routeIntf: ''
    },
    pageSize: 20,
    total: 0
});

ruleStore.updateRules = action(function update({ history, page, search }) {
    let url = '/api/Rule'
    if (page) {
        url += ('?page=' + page)
        if (search) {
            url += ('&&search=' + search)
        }
    } else if (search) {
        url += ('?filter=' + search)
    }
    return Fetch({
        method: 'GET',
        url: url,
        history: history,
        cb: (json) => {
            if (json.code === 0) {
                ruleStore.rules = _.map(json.result, function(rule) {
                    return _.assign(rule, {
                        inftChecked: rule.interfaces && (rule.interfaces.length != 0),
                        routeChecked: rule.routeGw,
                        haChecked: rule.haGroupName
                    })
                })
                ruleStore.total = json.totalRecords
            } else {
                alert(json.message)
            }
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

class BoxHeader extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.state = {
            search: ''
        }
    }
    handleChange(e) {
        const target = e.target
        const name = target.name
        const value = target.value
        this.setState({
            [name]: value
        })
    }
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.handleSearch(event)
        }
    }
    handleSearch(e) {
        const { history } = this.props
        ruleStore.updateRules({ history: history, search: this.state.search })
    }
    render() {
        const { history } = this.props

        return (
            <div className="box-header with-border">
                <h3 className="box-title">Rule Table</h3>
                <div className="box-tools">
                    <div className="input-group input-group-sm" style={{width: '450px'}} >
                        <input 
                            type="text" 
                            name="search" 
                            value={this.state.search}
                            onChange={this.handleChange}
                            onKeyPress={this.handleKeyPress}
                            className="form-control pull-right" 
                            placeholder="Search (fgtIpSn=xxx,fgtIpSn=xxx,fgtIpSn=xxx,...)" 
                        />
                        <div className="input-group-btn">
                            <button type="submit" className="btn btn-default" onClick={this.handleSearch} ><i className="fa fa-search"></i></button>
                        </div>
                        <div className="input-group-btn">
                            <button type="button" className="btn btn-block btn-primary" onClick={(e) => {
                                history.push("/Home/New")
                            }}>
                                <i className="fa fa-plus" aria-hidden="true"></i> Create New
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const BoxHeaderWithRouter = withRouter(BoxHeader)

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
                if (json.code === 0) {
                    history.push('/Home/Rule')
                } else {
                    alert(json.message)
                }
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
        ruleStore.updateRules({ history: history })
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

@observer
class BoxFooter extends React.Component {
    constructor(props) {
        super(props)
        this.left = this.left.bind(this)
        this.doubleLeft = this.doubleLeft.bind(this)
        this.page = this.page.bind(this)
        this.right = this.right.bind(this)
        this.doubleRight = this.doubleRight.bind(this)
        this.state = {
            current: 1
        }
    }
    left(e) {
        this.setState((prevState) => ({ current: prevState.current - 1 }))
    }
    doubleLeft(e) {
        this.setState((prevState) => ({ current: 1 }))
    }
    page(e) {
        const page = e.target.name
        this.setState({
            current: parseInt(page)
        })
        const { history } = this.props
        ruleStore.updateRules({ history: history, page: page })
    }
    right(e) {
        this.setState((prevState) => ({ current: prevState.current + 1 }))
    }
    doubleRight(e) {
        const total = ruleStore.total
        const pageSize = ruleStore.pageSize
        const pageTotal = Math.round(parseInt((total + (pageSize - 1)) / pageSize, 10))
        this.setState((prevState) => ({ current: pageTotal }))
    }
    render() {
        const total = ruleStore.total
        const pageSize = ruleStore.pageSize
        const pageTotal = Math.round(parseInt((total + (pageSize - 1)) / pageSize, 10))
        let list = []
        let range = []

        let start = (this.state.current - 2 > 0) ? this.state.current - 2 : 1
        let end = (start + 5 < pageTotal) ? start + 5 : pageTotal

        if (start > 1) {
            list.push(<li key="doubleLeft" onClick={this.doubleLeft}><a href="javascript:void(0);" name="doubleLeft"><i className="fa fa-angle-double-left" aria-hidden="true"></i></a></li>)
        }
        if (this.state.current > 1) {
            list.push(<li key="left" onClick={this.left}><a href="javascript:void(0);" name="left"><i className="fa fa-angle-left" aria-hidden="true"></i></a></li>)
        }

        range = _.range(start, end < pageTotal ? end + 1 : pageTotal + 1)
        list.push(range.map((page, index) => {
            return (
                <li key={index + 1} onClick={this.page} >
                    <a href="javascript:void(0);" name={page}>{page}</a>
                </li>
            )
        }))

        if (end < pageTotal) {
            list.push(<li key="right" onClick={this.right}><a href="javascript:void(0);" name="right"><i className="fa fa-angle-right" aria-hidden="true"></i></a></li>)
        }
        if (pageTotal - this.state.current > 2) {
            list.push(<li key="doubleRight" onClick={this.doubleRight}><a href="javascript:void(0);" name="doubleRight"><i className="fa fa-angle-double-right" aria-hidden="true"></i></a></li>)
        }

        return (
            <div className="box-footer clearfix">
                <ul className="pagination pagination-sm no-margin pull-right">
                    {list}
                </ul>
            </div>
        )
    }
}

const BoxFooterWithRouter = withRouter(BoxFooter)

function TableContent() {
    return (
        <section className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="box">
                        <BoxHeaderWithRouter />
                        <BoxBodyWithRouter />
                        <BoxFooterWithRouter />
                    </div>
                </div>
            </div>
        </section>
    )
}

function Rule() {
    return (
        <div>
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
        if (!this.props.appState.interfaces) {
            this.props.appState.interfaces = []
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
            return _.indexOf(rowKeys, o.intfName) < 0
        })
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
                <TableHeaderColumn dataField='intfName' isKey>Device</TableHeaderColumn>
                <TableHeaderColumn dataField='intfIpMask'>IP & Mask</TableHeaderColumn>
            </BootstrapTable>
        )
    }
}

const CancelButtonWithRouter = withRouter(CancelButton)

class FoldForm extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(e) {
        this.props.onChange(e)
    }
    render() {
        return (
            <div className="">
                <p 
                    className="lead" 
                >
                    <input 
                        name={this.props.name}
                        type="checkbox" 
                        checked={this.props.checked}
                        onChange={this.handleChange}
                    /> {this.props.header}
                </p>
                {
                    this.props.checked ? this.props.children : ''
                }
                <hr />
            </div>
        )
    }
}

@observer
class FormBody extends React.Component {
    constructor(props) {
        super(props)
        this.selfState = {}
        this.handleChange = this.handleChange.bind(this)

        // #/Home/Rule/xxxx
        const key = S(window.location.hash).strip('#/Home/Rule/').s;

        if (key) {
            let index = _.findIndex(ruleStore.rules, function(o) {
                return o.id == key;
            })
            if (index >= 0) {
                this.selfState = ruleStore.rules[index]
                this.state = {
                    inftChecked: this.selfState.interfaces && (this.selfState.interfaces.length != 0),
                    routeChecked: this.selfState.routeGw,
                    haChecked: this.selfState.haGroupName
                }
            } else {
                this.selfState = ruleStore.new
                this.state = {
                    inftChecked: false,
                    routeChecked: false,
                    haChecked: false
                }
            }
        }
    }
    onHandleSubmit(event) {
        const key = S(window.location.hash).strip('#/Home/Rule/').s;

        let url = '';
        let method = '';

        if (S(this.selfState.fgtIpSn).isEmpty()) {
            return alert('Please enter fortigate IP or SN!')
        }
        if (S(this.selfState.fmgSn).isEmpty()) {
            return alert('Please enter fortimanager SN!')
        }
        if (S(this.selfState.fmgIp).isEmpty()) {
            return alert('Please enter fortimanager IP!')
        }
        if (this.state.routeChecked && S(this.selfState.routeGw).isEmpty()) {
            return alert('Please enter route gateway!')
        }
        if (this.state.haChecked & S(this.selfState.haGroupName).isEmpty()) {
            return alert('Please enter ha group name!')
        }

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
                if (json.code === 0) {
                    history.push('/Home/Rule')
                } else {
                    alert(json.message)
                }
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
            if (name === 'inftChecked') {
                this.setState({
                    inftChecked: checked
                })
                if (!checked) {
                    this.selfState['interfaces'] = []
                }
            } else if (name === 'routeChecked') {
                this.setState({
                    routeChecked: checked
                })
                if (!checked) {
                    this.selfState['routeGw'] = ''
                }
            } else if (name === 'haChecked') {
                this.setState({
                    haChecked: checked
                })
                if (!checked) {
                    this.selfState['haGroupName'] = ''
                }
            } else {
                this.selfState[name] = checked
            }
        } else {
            this.selfState[name] = value
        }
    }
    render() {
        return (
            <div className="form-horizontal">
                <div className="box-body">
                    <Input 
                            name="fgtIpSn"
                            label="FortiGateSN/IP"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.fgtIpSn}
                            onChange={this.handleChange}
                            placeholder="Enter FortiGate SN or IP"
                    />
                    <FoldForm 
                        name="inftChecked"
                        header="Interface" 
                        checked={this.state.inftChecked} 
                        onChange={this.handleChange}
                    >
                        <InterfaceTable appState={this.selfState} />
                    </FoldForm>
                    <FoldForm 
                        name="routeChecked"
                        header="Routing" 
                        checked={this.state.routeChecked}
                        onChange={this.handleChange}
                    >
                        <Input 
                            name="routeId"
                            label="RoutingID"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.routeId}
                            onChange={this.handleChange}
                            placeholder="Enter Routing ID"
                        />
                        <Input 
                            name="routeIntf"
                            label="Device"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.routeIntf}
                            onChange={this.handleChange}
                            placeholder="Enter Routing Device"
                        />
                        <Input 
                            name="routeDst"
                            label="Dest"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.routeDst}
                            onChange={this.handleChange}
                            placeholder="Enter Routing Dest"
                            validator="ipv4mask"
                        />
                        <Input 
                            name="routeGw"
                            label="Gateway"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.routeGw}
                            onChange={this.handleChange}
                            placeholder="Enter Routing Gateway"
                            validator="ipv4"
                        />
                    </FoldForm>
                    <FoldForm 
                        name="haChecked"
                        header="HA" 
                        checked={this.state.haChecked}
                        onChange={this.handleChange}
                    >
                        <Input 
                            name="haGroupName"
                            label="GroupName"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.haGroupName}
                            onChange={this.handleChange}
                            placeholder="Enter Group Name"
                        />
                        <Input 
                            name="haGroupPasswd"
                            type="password"
                            label="Password"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.haGroupPasswd}
                            onChange={this.handleChange}
                            placeholder="Enter Group Password"
                        />
                        <Input 
                            name="haGroupId"
                            label="GroupID"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.haGroupId}
                            onChange={this.handleChange}
                            placeholder="Enter Group ID"
                        />
                        <Select 
                            name="haMode"
                            label="HaMode"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.haMode}
                            onChange={this.handleChange}
                            options={['a-p', 'a-a']}
                        />
                        <Input 
                            name="haPrimary"
                            label="HaDevice"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.haPrimary}
                            onChange={this.handleChange}
                            placeholder="Enter HA Device"
                        />
                        <Input 
                            name="haPriority"
                            label="HaPriority"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.haPriority}
                            onChange={this.handleChange}
                            placeholder="Enter HA Priority"
                        />
                        <Input 
                            name="haMgmtIntf"
                            label="HaMgmtInterface"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.haMgmtIntf}
                            onChange={this.handleChange}
                            placeholder="Enter HA Mgmt Interface"
                        />
                        <Input 
                            name="haMgmtIntfGw"
                            label="HaMgmtGateway"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.haMgmtIntfGw}
                            onChange={this.handleChange}
                            placeholder="Enter HA Mgmt Gateway"
                            validator="ipv4"
                        />
                        <Input 
                            name="haMgmtIntfGw6"
                            label="HaMgmtGateway6"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.haMgmtIntfGw6}
                            onChange={this.handleChange}
                            placeholder="Enter HA Mgmt Gateway6"
                            validator="ipv6"
                        />
                    </FoldForm>
                    <FoldForm 
                        name="purgeVirtualSwitch"
                        header="Purge Virtual Switch" 
                        checked={this.selfState.purgeVirtualSwitch}
                        onChange={this.handleChange}
                    >
                    </FoldForm>
                    <div>
                        <p className="lead">FortiManager</p>
                        <Input 
                            name="fmgSn"
                            label="FortiManagerSN"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.fmgSn}
                            onChange={this.handleChange}
                            placeholder="Enter FortiManager SN"
                        />
                        <Input 
                            name="fmgIp"
                            label="FortiManagerIP"
                            labelClass="col-md-2"
                            editorClass="col-md-10"
                            value={this.selfState.fmgIp}
                            onChange={this.handleChange}
                            placeholder="Enter FortiManager IP"
                            validator="ipv4"
                        />
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
                <div className="col-md-12">
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
            <FormContent />
        </div>
    )
}

export { Rule, RuleForm }
