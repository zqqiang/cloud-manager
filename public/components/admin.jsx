import React from 'react';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import { Input, Button } from './editor.jsx'
import Fetch from '../modules/net'

function Header() {
    return (
        <section className="content-header">
            <h1>
                Admin
                <small>Settings</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href="javascript:void(0);"><i className="fa fa-dashboard"></i> Home</a></li>
                <li><a href="javascript:void(0);"> Admin Settings</a></li>
                <li className="active"> Config</li>
            </ol>
        </section>
    );
}

class AdminForm extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const oldPassword = this.props.options.oldPassword
        const newPassword = this.props.options.newPassword
        const confirmPassword = this.props.options.confirmPassword
        const handleChange = this.props.onChange
        return (
            <form className="form-horizontal">
                <div className="box-body">
                    <Input 
                        labelClass="col-sm-3" label="Old password" editorClass="col-sm-9" placeholder="Old password"
                        name="oldPassword" type="password" value={oldPassword} onChange={handleChange}
                    />
                    <Input 
                        labelClass="col-sm-3" label="New password" editorClass="col-sm-9" placeholder="New password" 
                        name="newPassword" type="password" value={newPassword} onChange={handleChange}
                    />
                    <Input 
                        labelClass="col-sm-3" label="Re-enter password" editorClass="col-sm-9" placeholder="Re-enter password" 
                        name="confirmPassword" type="password" value={confirmPassword} onChange={handleChange}
                    />
                </div>
            </form>
        )
    }
}

class Content extends React.Component {
    constructor(props) {
        super(props)
        this.onCancel = this.onCancel.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        }
    }
    onCancel() {
        const { history } = this.props
        history.push('/Home')
    }
    onSubmit() {
        if (this.state.newPassword !== this.state.confirmPassword) {
            return alert('New password and Re-enter password are different!')
        }
        const { history } = this.props
        return Fetch({
            method: 'PUT',
            url: '/api/Admin',
            body: this.state,
            history: history,
            cb: (json) => {
                if (0 === json.code) {
                    alert('Password Change Success!')
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
        this.setState({
            [name]: value
        })
    }
    render() {
        const options = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword
        }
        return (
            <section className="content">
                <div className="row">
                    <div className="col-md-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Change Password</h3>
                            </div>
                            <AdminForm options={options} onChange={this.handleChange} />
                            <div className="box-footer">
                                <Button buttonClass="btn-default" label="Cancel" action={this.onCancel} />
                                <Button buttonClass="btn-info pull-right" label="Submit" action={this.onSubmit} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const ContentWithRouter = withRouter(Content)

function Admin() {
    return (
        <div className="">
            <ContentWithRouter />
        </div>
    );
}

export default Admin
