var $ = require('jquery');
var React = require('react');

var Header = require('./header.react');
var Form = require('./form.react');
var Footer = require('./footer.react');

class Home extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <Form />
                <Footer />
            </div>
        )
    }
}

export default Home
