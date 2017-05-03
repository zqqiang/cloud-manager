import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import Login from './login.react'

var MainSidebar = require('./mainsidebar.react');

function MainRouter() {
    return (
        <Router>
            <div>
                <Route path="/" component={Login} />
            </div>
        </Router>
    );
}

module.exports = MainRouter;
