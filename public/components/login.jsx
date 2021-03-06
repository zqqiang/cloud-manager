import React, { PropTypes } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import AuthInstance from '../modules/auth'
import Fetch from '../modules/net'

var NotificationSystem = require('react-notification-system');

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this._notificationSystem = null
        this.state = {
            username: '',
            password: ''
        }
    }
    componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem;
    }
    onHandleClick(e) {
        const { history } = this.props
        if (this.state.username) {
            return Fetch({
                method: 'POST',
                url: '/Login',
                body: {
                    'username': this.state.username,
                    'password': this.state.password,
                },
                history: history,
                cb: (json) => {
                    AuthInstance.authenticate({
                        username: this.state.username,
                        password: this.state.password,
                        token: json.token
                    })
                    history.push('/Home/System')
                },
                notification: this._notificationSystem
            })
        } else {
            this._notificationSystem.addNotification({
                message: 'Must Input Username with Password!',
                level: 'warning'
            })
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
    onHandleKeyPress(event) {
        if (event.key === 'Enter') {
            this.onHandleClick()
        }
    }
    render() {
        return (
            <div className="">
                <NotificationSystem ref="notificationSystem" />
                <div className="form-group has-feedback">
                    <input type="text" 
                           name="username" 
                           className="form-control" 
                           placeholder="User" 
                           value={this.state.username} 
                           onChange={this.onHandleChange.bind(this)}
                           onKeyPress={this.onHandleKeyPress.bind(this)}
                    />
                    <span className="glyphicon glyphicon-user form-control-feedback"></span>
                </div>
                <div className="form-group has-feedback">
                    <input type="password" 
                           name="password" 
                           className="form-control" 
                           placeholder="Password" 
                           value={this.state.password} 
                           onChange={this.onHandleChange.bind(this)}
                           onKeyPress={this.onHandleKeyPress.bind(this)}
                    />
                    <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <a href="javascript:void(0);" 
                            className="btn btn-primary btn-block btn-flat" 
                            onClick={this.onHandleClick.bind(this)} 
                        >
                            Sign In
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

const LoginFormWithRouter = withRouter(LoginForm)

const LoginBoxBody = ({ onClick }) => (
    <div className="login-box-body">
        <p className="login-box-msg">Sign in to start your session</p>
        <LoginFormWithRouter />
    </div>
)

const LoginBody = ({ onClick }) => (
    <div className="login-box">
        <div className="login-logo">
            <span><b>Forti</b>Deploy</span>
        </div>
        <LoginBoxBody />
    </div>
)

class Login extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="login-page">
                <LoginBody />
            </div>
        )
    }
}

export default Login
