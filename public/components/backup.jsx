import React from 'react'
import AuthInstance from './auth.jsx'

const download = require('downloadjs')

function Header() {
    return (
        <section className="content-header">
            <h1>
                Backup
                <small>Restore</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href="javascript:void(0);"><i className="fa fa-dashboard"></i> Home</a></li>
                <li><a href="javascript:void(0);"> Backup</a></li>
                <li className="active"> Restore</li>
            </ol>
        </section>
    );
}

class Content extends React.Component {
    constructor(props) {
        super(props)
        this.handleBackup = this.handleBackup.bind(this)
    }
    handleBackup() {
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'text/plain',
                'Origin': '',
                'Host': 'localhost',
                'Authorization': 'Bearer ' + AuthInstance.getToken()
            },
        }
        return fetch('/api/Backup', options)
            .then(response => response.blob())
            .then(blob => {
                download(blob, 'backup.conf', 'text/plain')
            })
    }
    handleRestore() {
        var input = document.querySelector('input[type="file"]')
        const file = input.files[0]
        if (!file) {
            alert('Please select your restore file first!');
            return;
        }

        var data = new FormData()
        data.append('file', file)

        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain',
                'Origin': '',
                'Host': 'localhost',
                'Authorization': 'Bearer ' + AuthInstance.getToken()
            },
            body: data
        }

        return fetch('/api/Restore', options)
            .then(response => response.json())
            .then(json => {
                console.log(json)
            })
    }
    render() {
        return (
            <section className="content">
                <div className="row">
                    <div className="col-md-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Configuration Backup</h3>
                            </div>
                            <div className="box-body">
                                <a className="btn btn-app" onClick={this.handleBackup}>
                                    <i className="fa fa-save"></i> Backup
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Configuration Restore</h3>
                            </div>
                            <div className="box-body">
                                <div className="form-group">
                                    <label >File input</label>
                                    <input type="file" />
                                    <p className="help-block">Choose your file here</p>
                                </div>
                                <a className="btn btn-app" onClick={this.handleRestore}>
                                    <i className="fa fa-repeat"></i> Restore
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

class Backup extends React.Component {
    render() {
        return (
            <div className="">
                <Header />
                <Content />
            </div>
        )
    }
}

export default Backup
