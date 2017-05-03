import React, { PropTypes } from 'react'

const LoginForm = ({ onHandleClick }) => {
    let user
    let password

    return (
        <div className="">
            <div className="form-group has-feedback">
                <input type="email" className="form-control" placeholder="Email" ref={node => {user = node}} />
                <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
            </div>
            <div className="form-group has-feedback">
                <input type="password" className="form-control" placeholder="Password" ref={node => {password = node}} />
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
                    <a href="javascript:void(0);" className="btn btn-primary btn-block btn-flat" onClick={ e => {
                        e.preventDefault()
                        if (!user.value.trim()) return
                        if (!password.value.trim()) return
                        onHandleClick(user.value, password.value);
                        user.value = ''
                        password.value = ''
                    }} >Sign In</a>
                </div>
            </div>
        </div>
    )
}

const LoginBoxBody = ({ onHandleClick }) => (
    <div className="login-box-body">
        <p className="login-box-msg">Sign in to start your session</p>
        <LoginForm onHandleClick={onHandleClick} />
        <a href="javascript:void(0);">I forgot my password</a><br />
        <a href="javascript:void(0);" className="text-center">Register a new membership</a>

    </div>
)

const LoginBody = ({ onHandleClick }) => (
    <div className="login-box">
        <div className="login-logo">
            <a href="javascript:void(0);"><b>Cloud</b> Manager</a>
        </div>
        <LoginBoxBody onHandleClick={onHandleClick} />
    </div>
)

class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className="login-page">
                <LoginBody onHandleClick={this.props.onHandleClick} />
            </div>
        )
    }
}

export default Login
