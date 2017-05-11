import React from 'react';
import {
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

const Auth = {
    isAuthenticated: false,
    authenticate(res) {
        console.log(res)
        if (res.result === 'success') {
            this.isAuthenticated = true
        } else {
            this.isAuthenticated = false
        }
    },
    signout(cb) {
        this.isAuthenticated = false
    }
}

export default Auth
