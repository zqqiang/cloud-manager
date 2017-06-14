import React from 'react'
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Fetch from '../modules/net'
import {
    Button,
    ButtonGroup,
    DropdownButton,
    MenuItem
} from 'react-bootstrap';
import c3 from 'c3';

var NotificationSystem = require('react-notification-system');
const download = require('downloadjs')
var _ = require('lodash');

function toArray(obj) {
    let array = []
    _.each(obj, function(value, key) {
        let obj = {}
        obj[key] = value
        array.push(obj)
    })
    return array
}

class LogTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleRefresh = this.handleRefresh.bind(this)
        this.handleBack = this.handleBack.bind(this)
        this.handleDownload = this.handleDownload.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleRowClick = this.handleRowClick.bind(this)
        this.handleRowDbclick = this.handleRowDbclick.bind(this)
        this._notificationSystem = null
        this.state = {
            data: [],
            expanding: []
        }
    }
    dayRefresh(logs) {
        let filterLogs = _.filter(logs, function(item) {
            return item.timeYearMonth == event.point.category
        })
        let count = _.countBy(filterLogs, function(item) {
            return item.timeYearMonthDay;
        })
        this.setState({
            data: filterLogs,
        })
    }
    refresh() {
        let self = this
        const { history } = this.props
        Fetch({
            method: 'GET',
            url: '/api/Log',
            history: history,
            cb: (json) => {
                let count = _.countBy(json.logs, function(item) {
                    return item.timeYearMonth;
                });
                if (json.code === 0) {
                    this.setState({
                        data: json.logs,
                    })
                    this.c3Gen(json.logs);
                } else {
                    console.log(json.message)
                }
            }
        })
    }
    c3Gen(datas) {
        let count = _.countBy(datas, function(item) {
            return item.timeYearMonth
        })
        c3.generate({
            bindto: '#chart',
            data: {
                json: toArray(count),
                keys: {
                    value: _.keys(count)
                },
                type: 'bar'
            },
            bar: {
                width: 30
            },
        });
    }
    componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem
        this.refresh()
    }
    handleRefresh(e) {
        this.refresh()
        this._notificationSystem.addNotification({
            message: 'Refresh Suceess!',
            level: 'success'
        })
    }
    handleBack(e) {
        this.refresh()
    }
    handleDownload() {
        const { history } = this.props
        return Fetch({
            method: 'GET',
            url: '/api/Backup/Log',
            type: 'text',
            history: history,
            cb: (blob) => {
                download(blob, 'backup.log', 'text/plain')
            }
        })
    }
    handleDelete(eventKey) {
        console.log(eventKey)
        const { history } = this.props
        return Fetch({
            method: 'DELETE',
            url: '/api/Log?range=' + eventKey,
            type: 'text',
            history: history,
            cb: (json) => {
                console.log(json)
                if (json.code === 0) {
                    this._notificationSystem.addNotification({
                        message: 'Delete Suceess!',
                        level: 'success'
                    })
                } else {
                    this._notificationSystem.addNotification({
                        message: json.message,
                        level: 'error'
                    })
                }
            }
        })
    }
    isExpandableRow(row) {
        return true
    }
    expandComponent(row) {
        return (
            <textarea className="form-control" rows="3" defaultValue={row.rawRule} readOnly></textarea>
        )
    }
    handleRowClick(row) {
        this.setState({
            expanding: [row.timestring]
        })
    }
    handleRowDbclick(row) {
        this.setState({
            expanding: []
        })
    }
    render() {
        const options = {
            expanding: this.state.expanding,
            onRowClick: this.handleRowClick,
            onRowDoubleClick: this.handleRowDbclick
        };
        return (
            <section className="content">
                <NotificationSystem ref="notificationSystem" />
                <div className="row">
                    <div className="col-xs-12">
                        <div className="box">
                            <div className="box-header with-border">
                                <h3 className="box-title">Log Table</h3>
                                <div className="box-tools">
                                    <ButtonGroup className="btn-group-sm">
                                        <DropdownButton title="Delete" id="bg-nested-dropdown" bsSize="small">
                                            <MenuItem eventKey="24h" onSelect={this.handleDelete}>Delete Last 24 Hours</MenuItem>
                                            <MenuItem eventKey="7d" onSelect={this.handleDelete}>Delete Last 7 Days</MenuItem>
                                            <MenuItem eventKey="30d" onSelect={this.handleDelete}>Delete Last 30 Days</MenuItem>
                                            <MenuItem eventKey="3m" onSelect={this.handleDelete}>Delete Last 3 Months</MenuItem>
                                        </DropdownButton>
                                        <Button onClick={this.handleBack}>Back</Button>
                                        <Button onClick={this.handleRefresh}>Refresh</Button>
                                        <Button onClick={this.handleDownload}>Download</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div className="box-body">
                                <div id="chart"></div>
                                <BootstrapTable 
                                    data={ this.state.data } 
                                    options={ options }
                                    expandableRow={ this.isExpandableRow }
                                    expandComponent={ this.expandComponent }
                                    pagination
                                >
                                    <TableHeaderColumn 
                                        dataField='timestring' 
                                        isKey 
                                        dataSort
                                        filter={ { type: 'DateFilter', defaultValue: { date: new Date(), comparator: '>=' } } }
                                    >
                                        Date
                                    </TableHeaderColumn>
                                    <TableHeaderColumn 
                                        dataField='name' 
                                        filter={ { type: 'TextFilter', placeholder: 'Please enter a value' } }
                                    >
                                        FortiGate SN
                                    </TableHeaderColumn>
                                    <TableHeaderColumn 
                                        dataField='fmgSn' 
                                        filter={ { type: 'TextFilter', placeholder: 'Please enter a value' } }
                                    >
                                        FortiManager SN
                                    </TableHeaderColumn>
                                    <TableHeaderColumn 
                                        dataField='fmgIp'
                                        filter={ { type: 'TextFilter', placeholder: 'Please enter a value' } }
                                    >
                                        FortiManager IP
                                    </TableHeaderColumn>
                                    <TableHeaderColumn dataField='rawRule'>Rule</TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const LogTableWithRouter = withRouter(LogTable)

function Log() {
    return (
        <div className="">
            <LogTableWithRouter />
        </div>
    );
}

export default Log
