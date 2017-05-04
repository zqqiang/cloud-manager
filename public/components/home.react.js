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
import Config from './config.react'
var Footer = require('./footer.react');

const routes = [{
    path: '/Home/System',
    main: () => <SystemSettings />
}, {
    path: '/Home/Config',
    main: () => <Config />
}]

class Home extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Header />
                    <div className="home-container">
                        <div className="home-sidebar">
                            <li className="treeview">
                                <Link to="/Home/System">
                                    <i className="fa fa-dashboard"></i> <span>System Settings</span>
                                </Link>
                            </li>
                            <li className="treeview">
                                <Link to="/Home/Config">
                                    <i className="fa fa-dashboard"></i> <span>IP&SN Config</span>
                                </Link>
                            </li>
                        </div>
                        <div className="home-content">
                            {routes.map((route, index) => (
                                <Route
                                    key={index}
                                    path={route.path}
                                    exact={route.exact}
                                    component={route.main}
                                />
                            ))}
                        </div>
                    </div>
                    <Footer />
                </div>
            </Router>
        )
    }
}

export default Home
