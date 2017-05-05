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
                </ul>
            </section>
        </aside>
    )
}

export default Sidebar