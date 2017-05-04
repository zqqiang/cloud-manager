import React from 'react';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

function MainHeaderLogo() {
    return (
        <Link to="/Home" className="logo">
            <span className="logo-lg">
                <i className="fa fa-cloud" aria-hidden="true"></i> Cloud Manager
            </span>
        </Link>
    );
}

function MainHeaderNavbar() {
    return (
        <nav className="navbar navbar-static-top" role="navigation">
        </nav>
    );
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
