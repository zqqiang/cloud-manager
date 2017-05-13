import React from 'react';
import {
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

var Header = require('./header.react');
var SystemSettings = require('./system.react');
import { Rule, RuleForm } from './rule.react'
import Sidebar from './sidebar.react'
var Footer = require('./footer.react');
import Admin from './admin.react'
import Backup from './backup.jsx'
import Auth from '../auth'

function Dashboard() {
    return (
        <section className="content-header">
            <h1>
                Dashboard
                <small>Control panel</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href="javascript:void(0);"><i className="fa fa-dashboard"></i> Home</a></li>
                <li className="active">Dashboard</li>
            </ol>
        </section>
    )
}

const routes = [{
    path: '/Home',
    exact: true,
    main: () => <Dashboard />
}, {
    path: '/Home/System',
    exact: true,
    main: () => <SystemSettings />
}, {
    path: '/Home/Rule',
    exact: true,
    main: () => <Rule />
}, {
    path: '/Home/Rule/:id',
    exact: true,
    main: () => <RuleForm />
}, {
    path: '/Home/New',
    exact: true,
    main: () => <RuleForm />
}, {
    path: '/Home/Admin',
    exact: true,
    main: () => <Admin />
}, {
    path: '/Home/Backup',
    exact: true,
    main: () => <Backup />
}]

function Content() {
    return (
        <div className="content-wrapper" style={{minHeight: '946px'}}>
            {routes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.main}
                />
            ))}
        </div>
    )
}

class Home extends React.Component {
    render() {
        if (Auth.isAuthenticated) {
            return (
                <div>
                    <Header />
                    <Sidebar />
                    <Content />
                    <Footer />
                </div>
            )
        } else {
            return (
                <Redirect to="/" />
            )
        }
    }
}

export default Home
