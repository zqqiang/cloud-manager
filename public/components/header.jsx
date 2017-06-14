import React from 'react';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import AuthInstance from '../modules/auth'
import Fetch from '../modules/net'

var S = require('string');

function MainHeaderLogo() {
    return (
        <Link to="/Home" className="logo">
            <span className="logo-lg">
                <i className="fa fa-cloud" aria-hidden="true"></i> FortiDeploy
            </span>
        </Link>
    );
}

class Notification extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            open: false,
            alert: 0,
            message: ''
        }
    }
    handleClick(event) {
        this.setState((prevState) => ({ open: !prevState.open }))
    }
    componentDidMount() {
        Fetch({
            method: 'GET',
            url: 'api/Expire',
            cb: (json) => {
                if (json.code === 0) {
                    console.log(json)
                    this.setState({
                        alert: json.showAlert,
                        message: json.message
                    })
                } else {
                    console.log(json.message)
                }
            }
        })
    }
    render() {
        return (
            <li className={"dropdown notifications-menu" + (this.state.open ? " open" : "")}>
                <a 
                    href="javascript:void(0);" 
                    className="dropdown-toggle" 
                    data-toggle="dropdown" 
                    aria-expanded={this.state.open ? "true" : "false"}
                    onClick={this.handleClick}
                >
                    <i className="fa fa-bell-o"></i>
                    <span className="label label-danger">{this.state.alert ? 1 : ''}</span>
                </a>
                <ul className="dropdown-menu">
                    <li className="header">You have {this.state.alert} notifications</li>
                    <li>
                        <ul className="menu">
                            <li>
                                <a href="javascript:void(0);">
                                    <i className="fa fa-warning text-red"></i> {this.state.message}
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        )
    }
}

class MainHeaderNavbar extends React.Component {
    constructor(props) {
        super(props)
    }
    onHandleClick(event) {
        AuthInstance.signOut()
    }
    render() {
        return (
            <nav className="navbar navbar-static-top" role="navigation">
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <Notification />
                        <li className="dropdown user user-menu">
                            <Link to="/Home/Admin" className="dropdown-toggle" data-toggle="dropdown">
                                <i className="fa fa-user fa-2" aria-hidden="true"></i>
                                <span className="hidden-xs">Admin</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" data-toggle="control-sidebar">
                                <i 
                                    className="fa fa-sign-out fa-2" aria-hidden="true" 
                                    onClick={this.onHandleClick.bind(this)}
                                >
                                </i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

function MainHeader() {
    return (
        <header className="main-header">
            <MainHeaderLogo />
            <MainHeaderNavbar />
        </header>
    );
}

module.exports = MainHeader;
