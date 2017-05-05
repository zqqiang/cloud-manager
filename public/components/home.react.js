import React from 'react';
import {
    HashRouter as Router,
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
        return (
            <Router>
                <div>
                    <Header />
                    <Sidebar />
                    <Content />
                    <Footer />
                </div>
            </Router>
        )
    }
}

export default Home
