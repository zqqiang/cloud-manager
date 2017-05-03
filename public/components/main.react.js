var React = require('react');

var MainHeader = require('./mainheader.react');
var MainRouter = require('./mainrouter.react');
var MainFooter = require('./mainfooter.react');

function Main() {
    return (
        <div>
            <MainHeader />
            <MainFooter />
        </div>
    );
}

module.exports = Main;
