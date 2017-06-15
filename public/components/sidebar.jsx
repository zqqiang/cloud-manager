import React from 'react';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

function Sidebar() {
    return (
        <aside className="main-sidebar">
            <section className="sidebar">
                <ul className="sidebar-menu">
                    <li className="treeview">
                        <Link to="/Home/System">
                            <i className="fa fa-cog"></i>
                            <span>System Settings</span>
                        </Link>
                    </li>
                    <li className="treeview">
                        <Link to="/Home/Rule">
                            <i className="fa fa-table"></i>
                            <span>Rules Config</span>
                        </Link>
                    </li>
                    <li className="treeview">
                        <Link to="/Home/Backup">
                            <i className="fa fa-undo" aria-hidden="true"></i>
                            <span>Import & Export</span>
                        </Link>
                    </li>
                    <li className="treeview">
                        <Link to="/Home/Log">
                            <i className="fa fa-bar-chart" aria-hidden="true"></i>
                            <span>Logs</span>
                        </Link>
                    </li>
                </ul>
            </section>
        </aside>
    )
}

export default Sidebar
