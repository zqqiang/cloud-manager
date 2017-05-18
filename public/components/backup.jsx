import React from 'react'
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import Fetch from '../modules/net'
import AuthInstance from '../modules/auth'

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
        this.handleRestore = this.handleRestore.bind(this)
    }
    handleBackup() {
        const { history } = this.props
        return Fetch({
            method: 'GET',
            url: '/api/Backup',
            type: 'text',
            history: history,
            cb: (blob) => {
                download(blob, 'backup.conf', 'text/plain')
            }
        })
    }
    handleRestore() {
        if (this.data) {
            this.data.formData = {
                'Authorization': 'Bearer ' + AuthInstance.getToken()
            };
            this.data.submit()
        } else {
            alert('Select Restore Configuration First!')
        }
    }
    componentDidMount() {
        $('#fileupload').fileupload({
            dataType: 'json',
            replaceFileInput: false,
            add: (e, data) => {
                this.data = data
            },
            done: function(e, data) {
                alert('File Upload Success!')
            }
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
                                    <input 
                                        id="fileupload"
                                        type="file"
                                        name="files[]"
                                        data-url="/Restore"
                                        multiple
                                    />
                                    <p className="help-block" id="context" >Choose your file here</p>
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

const ContentWithRouter = withRouter(Content)

class Backup extends React.Component {
    render() {
        return (
            <div className="">
                <Header />
                <ContentWithRouter />
            </div>
        )
    }
}

export default Backup
