import React from 'react';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import Fetch from '../modules/net'
import { Input } from './editor.jsx'


class SystemInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expire: '',
            serialNumber: '',
            licenseValid: false
        }
    }
    componentDidMount() {
        Fetch({
            method: 'GET',
            url: 'gui/System/Status',
            cb: (json) => {
                if (json.code === 0) {
                    console.log(json)
                    this.setState({
                        serialNumber: json.serialNumber,
                        expire: json.expireDate,
                        licenseValid: json.licenseValid
                    })
                } else {
                    console.log(json.message)
                }
            }
        })
    }
    render() {
        return (
            <div className="box box-primary">
                <div className="box-header with-border">
                    <h3 className="box-title">System Information</h3>
                </div>
                <div className="form-horizontal">
                    <div className="box-body">
                        <div className="form-group">
                            <label className="col-sm-3 strong">Serial Number</label>
                            <div className="col-sm-9">
                                <span className="">{this.state.serialNumber}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-3 strong">Expiry Date</label>
                            <div className="col-sm-9">
                                <span className="">{this.state.expire}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function Header() {
    return (
        <section className="content-header">
            <h1>
                Server
                <small>Config</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href="javascript:void(0);"><i className="fa fa-dashboard"></i> Home</a></li>
                <li><a href="javascript:void(0);"> System Settings</a></li>
                <li className="active"> Config</li>
            </ol>
        </section>
    );
}

class Content extends React.Component {
    constructor(props) {
        super(props)
        this.onHandleChange = this.onHandleChange.bind(this)
        this.state = {
            ip: '',
            netmask: '',
            gateway: ''
        }
    }
    onHandleChange(event) {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({
            [name]: value
        })
    }
    onHandleSubmit(event) {
        const { history } = this.props
        return Fetch({
            method: 'PUT',
            url: '/gui/System',
            body: this.state,
            history: history
        })
    }
    componentDidMount() {
        const { history } = this.props
        return Fetch({
            method: 'GET',
            url: '/gui/System',
            history: history,
            cb: (json) => {
                if (json.code === 0) {
                    this.setState(json.result)
                } else {
                    console.log(json.message)
                }
            }
        })
    }
    render() {
        return (
            <section className="content">
                <div className="row">
                    <div className="col-lg-6">
                        <SystemInfo />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Config System Settings</h3>
                            </div>
                            <div className="form-horizontal">
                                <div className="box-body">
                                    <Input 
                                        label="IP Address"
                                        name="ip"
                                        value={this.state.ip}
                                        placeholder="Enter IP"
                                        validator="ipv4"
                                        labelClass="col-sm-3"
                                        editorClass="col-sm-9"
                                        onChange={this.onHandleChange}
                                    />
                                    <Input 
                                        label="IP Netmask"
                                        name="netmask"
                                        value={this.state.netmask}
                                        placeholder="Enter Netmask"
                                        validator="ipv4"
                                        labelClass="col-sm-3"
                                        editorClass="col-sm-9"
                                        onChange={this.onHandleChange}
                                    />
                                    <Input 
                                        label="Gateway"
                                        name="gateway" 
                                        value={this.state.gateway}
                                        placeholder="Enter Gateway" 
                                        validator="ipv4"
                                        labelClass="col-sm-3"
                                        editorClass="col-sm-9"
                                        onChange={this.onHandleChange}
                                    />
                                </div>
                            </div>
                            <div className="box-footer">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary" 
                                    onClick={this.onHandleSubmit.bind(this)}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const ContentWithRouter = withRouter(Content)

function Form() {
    return (
        <div className="">
            <ContentWithRouter />
        </div>
    );
}

module.exports = Form;
