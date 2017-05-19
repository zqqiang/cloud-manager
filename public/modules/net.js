import AuthInstance from '../modules/auth'

const Fetch = function _fetch({ method, url, type, body, history, cb }) {
    let acceptType = 'application/json'
    let contentType = 'application/json'

    if (type === 'text' && method === 'GET') {
        acceptType = 'text/plain'
    } else if (type === 'text' && method === 'POST') {
        contentType = 'text/plain'
    }

    let options = {
        method: method,
        headers: {
            'Accept': acceptType,
            'Content-Type': contentType,
            'Origin': '',
            'Host': 'localhost',
            'Authorization': 'Bearer ' + AuthInstance.getToken()
        }
    }

    if (body && (method === 'POST' || method === 'PUT')) {
        if (type === 'text') {
            options['body'] = body
        } else {
            options['body'] = JSON.stringify(body)
        }
    }

    return fetch(url, options)
        .then((response) => {
            if (response.status !== 200) {
                var error = new Error(response.statusText)
                error.response = response
                throw error
            }
            return response
        })
        .then(response => {
            if (type === 'text' && method === 'GET') {
                return response.blob()
            } else {
                return response.json()
            }
        })
        .then(jsonOrBlob => {
            if (type !== 'text') console.log(jsonOrBlob)
            if (cb) {
                cb(jsonOrBlob)
            }
        })
        .catch((error) => {
            let status = error.response.status
            if (status === 401) {
                alert('User Unauthorized!')
                AuthInstance.signOut()
                history.push('/')
            } else {
                console.log(error)
            }
        })
}

export default Fetch
