var React = require('react');
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

var Header = require('./header.react');
var Form = require('./form.react');
var Footer = require('./footer.react');

const routes = [{
    path: '/Home/bubblegum',
    sidebar: () => <div>bubblegum!</div>,
    main: () => <h2>Bubblegum</h2>
}, {
    path: '/Home/shoelaces',
    sidebar: () => <div>shoelaces!</div>,
    main: () => <h2>Shoelaces</h2>
}]

class Home extends React.Component {
    render() {
        return (
            <Router>
                <div>
                <Header />
                <div style={{ display: 'flex' }}>
                  <div style={{
                    padding: '10px',
                    width: '230px',
                    background: '#f0f0f0'
                  }}>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      <li><Link to="/Home/bubblegum">Bubblegum</Link></li>
                      <li><Link to="/Home/shoelaces">Shoelaces</Link></li>
                    </ul>
                  </div>

                  <div style={{ flex: 1, padding: '10px' }}>
                    {routes.map((route, index) => (
                      <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        component={route.main}
                      />
                    ))}
                  </div>
                </div>
                <Footer />
                </div>
            </Router>
        )
    }
}

export default Home
