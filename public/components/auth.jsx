class Auth {
    constructor() {
        this.token = ''
    }
    isAuthed() {
        return this.token !== ''
    }
    getToken() {
        return this.token
    }
    authenticate(token) {
        this.token = token
    }
    signOut() {
        this.token = ''
    }
}

const AuthInstance = new Auth()

export default AuthInstance