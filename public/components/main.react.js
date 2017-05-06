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

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = { isLoggedIn: false }
    }
    onHandleClick() {
        if (!this.state.isLoggedIn) {
            this.setState({ isLoggedIn: true })
        }
    }
    render() {
        const isLoggedIn = this.state.isLoggedIn
        let page = null
        if (isLoggedIn) {
            page = <Home />
        } else {
            page = <Login onClick={this.onHandleClick.bind(this)} />
        }
        return (
            <Router>
                {page}
            </Router>
        )
    }
}

export default Main
