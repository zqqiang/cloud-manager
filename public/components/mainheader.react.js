var React = require('react');

function MainHeaderLogo() {
    return (
        <a href="javascript:void(0);" className="logo">
            <span className="logo-lg">
                <i className="fa fa-cloud" aria-hidden="true"></i> Cloud Manager
            </span>
        </a>
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
