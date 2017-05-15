import React from 'react'
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

import Login from './login.jsx'
import Home from './home.jsx'

class Main extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        if (true) {
            <Redirect to="/"/>
        }
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Login}/>
                    <Route path="/Home" component={Home}/>
                </div>
            </Router>
        )
    }
}

export default Main
