import React, { PropTypes } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            password: ''
        }
    }
    onHandleClick(e) {
        e.preventDefault()

        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': '',
                'Host': 'localhost'
            },
            body: JSON.stringify({
                'client_id': this.state.user.value,
                'client_secret': this.state.password.value,
                'grant_type': 'client_credentials'
            })
        }

        const { match, location, history } = this.props

        return fetch('/Login', options)
            .then(response => response.json())
            .then(json => {
                history.push('/Home')
            })

    }
    onHandleChange(event) {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({
            [name]: value
        })
    }
    render() {
        return (
            <div className="">
                <div className="form-group has-feedback">
                    <input type="text" 
                           name="user" 
                           className="form-control" 
                           placeholder="User" 
                           value={this.state.user} 
                           onChange={this.onHandleChange.bind(this)}
                    />
                    <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                </div>
                <div className="form-group has-feedback">
                    <input type="password" 
                           name="password" 
                           className="form-control" 
                           placeholder="Password" 
                           value={this.state.password} 
                           onChange={this.onHandleChange.bind(this)}
                    />
                    <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                </div>
                <div className="row">
                    <div className="col-xs-8">
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" /> Remember Me
                            </label>
                        </div>
                    </div>
                    <div className="col-xs-4">
                        <a href="javascript:void(0);" 
                           className="btn btn-primary btn-block btn-flat" 
                           onClick={this.onHandleClick.bind(this)} >Sign In</a>
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
        <a href="javascript:void(0);">I forgot my password</a><br />
        <a href="javascript:void(0);" className="text-center">Register a new membership</a>
    </div>
)

const LoginBody = ({ onClick }) => (
    <div className="login-box">
        <div className="login-logo">
            <a href="javascript:void(0);"><b>Cloud</b> Manager</a>
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
