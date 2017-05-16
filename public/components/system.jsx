import React from 'react';
import AuthInstance from './auth.jsx'

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
        this.state = {
            ip: '',
            netmask: '',
            gateway: '',
            defaultFortiManageIp: ''
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
        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': '',
                'Host': 'localhost',
                'Authorization': 'Bearer ' + AuthInstance.getToken()
            },
            body: JSON.stringify(this.state)
        }
        return fetch('/api/System', options)
            .then(response => response.json())
            .then(json => {
                console.log(json)
            })
    }
    componentDidMount() {
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
        return fetch('/api/System', options)
            .then(response => response.json())
            .then(json => {
                console.log(json)
                this.setState(json.result)
            })
    }
    render() {
        return (
            <section className="content">
                <div className="row">
                    <div className="col-md-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Config System Settings</h3>
                            </div>
                            <div className="box-body">
                                <div className="form-group">
                                    <label>IP Address</label>
                                    <input 
                                        type="text"
                                        className="form-control" 
                                        name="ip" 
                                        value={this.state.ip}
                                        placeholder="Enter IP" 
                                        onChange={this.onHandleChange.bind(this)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>IP Netmask</label>
                                    <input 
                                        type="text"
                                        className="form-control" 
                                        name="netmask" 
                                        value={this.state.netmask}
                                        placeholder="Enter Netmask" 
                                        onChange={this.onHandleChange.bind(this)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gateway</label>
                                    <input 
                                        type="text"
                                        className="form-control" 
                                        name="gateway" 
                                        value={this.state.gateway}
                                        placeholder="Enter Gateway" 
                                        onChange={this.onHandleChange.bind(this)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>External FortiManager Server IP Address (Default FortiManager)</label>
                                    <input 
                                        type="text"
                                        className="form-control" 
                                        name="defaultFortimanageIp" 
                                        value={this.state.defaultFortiManageIp}
                                        placeholder="Enter IP" 
                                        onChange={this.onHandleChange.bind(this)}
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

function Form() {
    return (
        <div className="">
            <Header />
            <Content />
        </div>
    );
}

module.exports = Form;
