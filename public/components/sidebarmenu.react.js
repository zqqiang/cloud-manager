var React = require('react');
import { Link } from 'react-router'

class TreeViewNode extends React.Component {
    render() {
        return (
            <li>
                <Link href="javascript:void(0);" to={'/' + this.props.to} activeStyle={{color: '#3C8DBC'}} >
                    <i className={"fa fa-" + this.props.icon}></i>{' ' + this.props.label}
                </Link>
            </li>
        );
    }
}

class TreeView extends React.Component {
    getInitialState() {
        return { opened: false };
    }
    handleClick(event) {
        this.setState({ opened: !this.state.opened });
    }
    render() {
        var treeviewClass = 'treeview' + (this.state.opened ? ' active' : '');
        var treeviewMenuClass = 'treeview-menu' + (this.state.opened ? ' menu-open' : '');

        var items = [];
        this.props.nodes.forEach((item, index) =>
            items.push(<TreeViewNode to={item.to} icon={item.icon} label={item.label} key={index} />)
        );

        return (
            <li className={treeviewClass}>
            <a href="javascript:void(0);" onClick={this.handleClick}>
                <i className={"fa fa-" + this.props.icon}></i>
                    <span>{this.props.leaf}</span>
                <i className="fa fa-angle-left pull-right"></i>
            </a>
            <ul className={treeviewMenuClass}>
                {items}
            </ul>
        </li>
        );
    }
}

var graphNodes = [
    { to: 'LogTable', icon: 'table', label: 'Log Table' },
    { to: 'LogGraph', icon: 'area-chart', label: 'Log Graph' },
    { to: 'LogDiagram', icon: 'area-chart', label: 'Log Diagram' },
    { to: 'LogAnalysis', icon: 'eye', label: 'Log Analysis' },
];

var settingsNodes = [
    { to: 'LogConfig', icon: 'cogs', label: 'Log Config' },
];

function SidebarMenu() {
    return (
        <ul className="sidebar-menu">
            <TreeView leaf='Log Graph' icon='line-chart' nodes={graphNodes} />
            <TreeView leaf='Log Settings' icon='cog' nodes={settingsNodes} />
        </ul>
    );
}

module.exports = SidebarMenu;
