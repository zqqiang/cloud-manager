var React = require('react');

function Header() {
    return (
        <section className="content-header">
            <h1>
                Server
                <small>Config</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href="javascript:void(0);"><i className="fa fa-dashboard"></i> Home</a></li>
                <li><a href="javascript:void(0);"> Settings</a></li>
                <li className="active"> Config</li>
            </ol>
        </section>
    );
}

function Content() {
    return (
        <section className="content">
            <div className="row">
                <div className="col-md-6">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">Server Config</h3>
                        </div>
                        <div className="box-body">
                            <div className="form-group">
                                <label>IP Address</label>
                                <input 
                                    type="text"
                                    className="form-control" 
                                    id="ip" 
                                    placeholder="Enter IP" 
                                />
                            </div>
                            <div className="form-group">
                                <label>External FortiManager Server IP Address (Default FortiManager)</label>
                                <input 
                                    type="text"
                                    className="form-control" 
                                    id="extip" 
                                    placeholder="Enter IP" 
                                />
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>FortiManager IP Address base on SN</label>
                                    <input 
                                        type="text"
                                        className="form-control" 
                                        id="snip" 
                                        placeholder="Enter IP" 
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>FortiGate SN</label>
                                    <input 
                                        type="text"
                                        className="form-control" 
                                        id="sn" 
                                        placeholder="Enter SN" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="box-footer">
                            <button type="submit" className="btn btn-primary" >Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Form() {
    return (
        <div className="content-wrapper">
            <Header />
            <Content />
        </div>
    );
}

module.exports = Form;
