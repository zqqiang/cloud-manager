import React from 'react';
import {
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

var Header = require('./header.jsx');
var SystemSettings = require('./system.jsx');
var Footer = require('./footer.jsx');

import Fetch from '../modules/net'
import { Rule, RuleForm } from './rule.jsx'
import Sidebar from './sidebar.jsx'
import Admin from './admin.jsx'
import Backup from './backup.jsx'
import Log from './log.jsx'
import AuthInstance from '../modules/auth'

class Invoice extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expire: ''
        }
    }
    componentDidMount() {
        Fetch({
            method: 'GET',
            url: 'api/Expire',
            cb: (json) => {
                if (json.code === 0) {
                    console.log(json)
                    this.setState({
                        expire: json.expireDate
                    })
                } else {
                    console.log(json.message)
                }
            }
        })
    }
    render() {
        return (
            <div className="pad margin no-print">
                <div className="callout callout-info" style={{marginBottom: "0!important"}}>
                    <h4><i className="fa fa-info"></i> Note:</h4>
                    {this.state.expire}
                </div>
            </div>
        )
    }
}

function Dashboard() {
    return (
        <div>
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
            <Invoice />
        </div>
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
}, {
    path: '/Home/Log',
    exact: true,
    main: () => <Log />
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
    componentDidMount() {
        $('body').mousemove(function(event) {
            AuthInstance.reset()
        })
    }
    render() {
        if (AuthInstance.isAuthed()) {
            return (
                <div className="wrapper">
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
