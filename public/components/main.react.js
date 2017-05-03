import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import Login from './login.react'

function Main() {
    return (
        <Router>
            <div>
                <Route path="/" component={Login} />
            </div>
        </Router>
    );
}

module.exports = Main;
