import Fetch from './net'

class Auth {
    constructor() {
        this.token = ''
        this.expire = 0
    }
    reset() {
        this.expire = 0
    }
    tick() {
        this.expire++
    }
    active() {
        return (this.expire < 4)
    }
    isAuthed() {
        return this.token !== ''
    }
    getToken() {
        return this.token
    }
    authenticate({ username, password, token }) {
        this.token = token
        keepAlive(username, password)
    }
    signOut() {
        this.token = ''
    }
}

const AuthInstance = new Auth()

setInterval(function() {
    AuthInstance.tick()
}, 60 * 1000)

function keepAlive(username, password) {
    setTimeout(function() {
        if (AuthInstance.active()) {
            return Fetch({
                method: 'POST',
                url: '/Login',
                body: {
                    'username': username,
                    'password': password,
                },
                cb: (json) => {
                    AuthInstance.authenticate({
                        username: username,
                        password: password,
                        token: json.token
                    })
                }
            })
        }
    }, 300 * 1000)
}

export default AuthInstance
