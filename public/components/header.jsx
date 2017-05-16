import React from 'react';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import AuthInstance from '../modules/auth'

var S = require('string');

function MainHeaderLogo() {
    return (
        <Link to="/Home" className="logo">
            <span className="logo-lg">
                <i className="fa fa-cloud" aria-hidden="true"></i> Cloud Manager
            </span>
        </Link>
    );
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
