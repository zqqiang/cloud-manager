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
    MenuItem,
    Modal
} from 'react-bootstrap';
import c3 from 'c3';
import Slider from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

var NotificationSystem = require('react-notification-system');
const download = require('downloadjs')
var _ = require('lodash');
var moment = require('moment');
var S = require('string');

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
        super(props)
        this.handleRefresh = this.handleRefresh.bind(this)
        this.handleBack = this.handleBack.bind(this)
        this.handleDownload = this.handleDownload.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleWheel = this.handleWheel.bind(this)
        this.handleRowClick = this.handleRowClick.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this._notificationSystem = null
        this.state = {
            modalText: [],
            showModal: false,
            max: 0,
            range: [],
            ts: [],
            data: []
        }
    }
    componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem
        this.refresh()
    }
    refresh() {
        let self = this
        const { history } = this.props
        Fetch({
            method: 'GET',
            url: '/api/Log/Timeseries',
            history: history,
            cb: (json) => {
                if (json.code === 0) {
                    this.setState({
                        ts: json.ts,
                        max: json.ts.length,
                        range: [json.ts.length - 1000, json.ts.length - 1]
                    })
                    this.c3Gen()
                } else {
                    console.log(json.message)
                }
            }
        })
    }
    c3Gen(datas) {
        let self = this
        let start = this.state.ts[this.state.range[0] - 1]
        let end = this.state.ts[this.state.range[1] - 1]
        const { history } = this.props
        Fetch({
            method: 'GET',
            url: '/api/Log/Count?start=' + start + '&end=' + end,
            history: history,
            cb: (json) => {
                if (json.code === 0) {
                    c3.generate({
                        bindto: '#chart',
                        data: {
                            x: 'x',
                            columns: [
                                _.concat('x', _.keys(json.counts)),
                                _.concat('count', _.values(json.counts)),
                            ],
                            type: 'bar'
                        },
                        bar: {
                            width: {
                                ratio: 0.9
                            }
                        },
                        axis: {
                            x: {
                                type: 'timeseries',
                                tick: {
                                    format: '%Y-%m-%d'
                                }
                            }
                        }
                    });
                    this.tableRefresh();
                } else {
                    console.log(json.message)
                }
            }
        })
    }
    tableRefresh() {
        let self = this
        let start = this.state.ts[this.state.range[0] - 1]
        let end = this.state.ts[this.state.range[1] - 1]
        const { history } = this.props
        Fetch({
            method: 'GET',
            url: '/api/Log/Tables?start=' + start + '&end=' + end,
            history: history,
            cb: (json) => {
                if (json.code === 0) {
                    this.setState({
                        data: json.logs
                    })
                } else {
                    console.log(json.message)
                }
            }
        })
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
    handleChange(domain) {
        this.setState({
            range: domain
        })
        this.c3Gen()
    }
    handleWheel(e) {
        e.preventDefault();
        if (e.deltaY > 0) {
            this.setState((prevState) => ({
                range: [
                    (prevState.range[0] - 10 > 0) ? (prevState.range[0] - 10) : (prevState.range[0]),
                    (prevState.range[1] + 10 > this.state.ts.length) ? (prevState.range[1]) : (prevState.range[1] + 10)
                ]
            }))
        } else {
            this.setState((prevState) => ({
                range: [
                    (prevState.range[0] + 10 > prevState.range[1]) ? (prevState.range[0]) : (prevState.range[0] + 10),
                    (prevState.range[1] - 10 > prevState.range[0]) ? (prevState.range[1] - 10) : (prevState.range[1])
                ]
            }))
        }
        this.c3Gen()
    }
    handleRowClick(row) {
        this.setState({ showModal: true, modalText: S(row.rawRule).parseCSV('\n') });
    }
    handleModalClose() {
        this.setState({ showModal: false });
    }
    render() {
        const options = {
            onRowClick: this.handleRowClick
        };
        return (
            <section className="content">
                <NotificationSystem ref="notificationSystem" />
                <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Config Rule</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <pre className="prettyprint">
                            <code className="html">
                                {this.state.modalText.map((line, index) => 
                                    <p key={index}>{line}</p>
                                )}
                            </code>
                        </pre>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
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
                            <div className="box-body" onWheel={this.handleWheel}>
                                <div id="chart"></div>
                                <div>
                                    <Range 
                                        max={this.state.max} 
                                        value={this.state.range} 
                                        pushable={true} 
                                        tipFormatter={value => `${moment.unix(this.state.ts[value]).format('YYYY-MM-D')}`} 
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="box-body">
                                <BootstrapTable 
                                    data={ this.state.data } 
                                    options={ options }
                                    pagination
                                >
                                    <TableHeaderColumn 
                                        dataField='timestring' 
                                        dataSort
                                    >
                                        Date
                                    </TableHeaderColumn>
                                    <TableHeaderColumn 
                                        dataField='name' 
                                        isKey
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
