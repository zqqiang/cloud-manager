import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import Dummy from './dummy.react'

var MainSidebar = require('./mainsidebar.react');

function MainRouter() {
    return (
        <Router history={hashHistory}>
            <Route path="/" component={MainSidebar} >
                <Route path="/*" component={Dummy} />
            </Route>
        </Router>
    );
}

module.exports = MainRouter;
