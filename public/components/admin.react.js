import React from 'react';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

function Header() {
    return (
        <section className="content-header">
            <h1>
                Admin
                <small>Settings</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href="javascript:void(0);"><i className="fa fa-dashboard"></i> Home</a></li>
                <li><a href="javascript:void(0);"> Admin Settings</a></li>
                <li className="active"> Config</li>
            </ol>
        </section>
    );
}

class AdminForm extends React.Component {
    render() {
        return (
            <form className="form-horizontal">
                <div className="box-body">
                    <div className="form-group">
                        <label className="col-sm-3 control-label">New user</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" placeholder="New user" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-3 control-label">Old password</label>
                        <div className="col-sm-9">
                            <input type="password" className="form-control" placeholder="Old password" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-3 control-label">New password</label>
                        <div className="col-sm-9">
                            <input type="password" className="form-control" placeholder="New password" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-3 control-label">Re-enter password</label>
                        <div className="col-sm-9">
                            <input type="password" className="form-control" placeholder="Re-enter password" />
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

function Content() {
    return (
        <section className="content">
            <div className="row">
                <div className="col-md-6">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">Admin System Settings</h3>
                        </div>
                        <AdminForm />
                        <div className="box-footer">
                            <button type="submit" className="btn btn-default">Cancel</button>
                            <button type="submit" className="btn btn-info pull-right" >Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Admin() {
    return (
        <div className="">
            <Header />
            <Content />
        </div>
    );
}

export default Admin