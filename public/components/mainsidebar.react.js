var React = require('react');
var SidebarMenu = require('./sidebarmenu.react');

class MainSidebar extends React.Component {
    render() {
        return (
            <div className="main-content">
            <aside className="main-sidebar">
                <section className="sidebar">
                    <SidebarMenu />
                </section>
            </aside>
            {/* other router */}
            {this.props.children}
        </div>
        );
    }
}

module.exports = MainSidebar;
