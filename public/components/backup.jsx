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

var NotificationSystem = require('react-notification-system');
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
        this.handleAppendChange = this.handleAppendChange.bind(this)
        this._notificationSystem = null
        this.state = {
            append: false
        }
    }
    handleBackup() {
        const { history } = this.props
        return Fetch({
            method: 'GET',
            url: '/gui/Backup',
            type: 'text',
            history: history,
            cb: (blob) => {
                download(blob, 'backup.conf', 'text/plain')
            }
        })
    }
    handleRestore() {
        if (this.restore) {
            this.restore.formData = {
                'append': this.state.append,
                'Authorization': 'Bearer ' + AuthInstance.getToken()
            };
            this.restore.submit()
        } else {
            this._notificationSystem.addNotification({
                message: 'Select Restore Configuration First!',
                level: 'warning'
            })
        }
    }
    handleAppendChange(e) {
        this.setState((prevState) => ({ append: !prevState.append }))
    }
    componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem
        let notify = this._notificationSystem
        $('#restoreUpload').fileupload({
            dataType: 'json',
            url: '/Restore',
            replaceFileInput: false,
            add: (e, data) => {
                this.restore = data
            },
            done: function(e, data) {
                notify.addNotification({
                    message: 'File Upload Success!',
                    level: 'success'
                })
            }
        })
    }
    render() {
        return (
            <section className="content">
                <NotificationSystem ref="notificationSystem" />
                <div className="row">
                    <div className="col-md-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Deploy Rule Backup</h3>
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
                                <h3 className="box-title">Deploy Rule Restore</h3>
                            </div>
                            <div className="box-body">
                                <div className="form-group">
                                    <label >File input</label>
                                    <input 
                                        id="restoreUpload"
                                        type="file"
                                        name="files[]"
                                        multiple
                                    />
                                    <p className="help-block" id="context" >Choose your file here</p>
                                </div>
                                <div className="checkbox">
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            checked={this.state.append} 
                                            onChange={this.handleAppendChange}
                                        /> Append restore
                                    </label>
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
                <ContentWithRouter />
            </div>
        )
    }
}

export default Backup
