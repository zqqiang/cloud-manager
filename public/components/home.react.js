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
import Rule from './rule.react'
import Sidebar from './sidebar.react'
var Footer = require('./footer.react');

const routes = [{
    path: '/Home/System',
    main: () => <SystemSettings />
}, {
    path: '/Home/Rule',
    main: () => <Rule />
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
