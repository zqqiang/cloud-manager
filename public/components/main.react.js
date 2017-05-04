import React from 'react'
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

import Login from './login.react'
import Home from './home.react'

function Main() {
    return (
        <Router>
            <div>
                <Redirect from="/" to="/Login" />
                <Route path="/Login" component={Login} />
                <Route path="/Home" component={Home} />
            </div>
        </Router>
    );
}

module.exports = Main;
