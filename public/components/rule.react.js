import React from 'react'
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

function TableHeader() {
    return (
        <section className="content-header">
            <h1>
                Rule Tables
                <small>preview of rule tables</small>
            </h1>
            <ol className="breadcrumb">
                <li><Link to="/Home"><i className="fa fa-dashboard"></i> Home</Link></li>
                <li><Link to="/Home/Rule"> Rules</Link></li>
                <li className="active"> Config</li>
            </ol>
        </section>
    )
}

function BoxHeader() {
    return (
        <div className="box-header with-border">
            <h3 className="box-title">Rule Table</h3>
            <div className="box-tools">
                <button type="button" className="btn btn-block btn-primary">
                    <i className="fa fa-plus" aria-hidden="true"></i> Create New
                </button>
            </div>
        </div>
    )
}

function RuleTableHeader() {
    return (
        <tr>
            <th style={{width: '10px'}}>#</th>
            <th>FortiGate SN/IP</th>
            <th>FortiManager SN</th>
            <th>FortiManager IP</th>
            <th style={{width: '40px'}}></th>
            <th style={{width: '40px'}}></th>
        </tr>
    )
}

function RuleTableTr({ row }) {
    return (
        <tr>
            <td>{row.id}</td>
            <td>{row.fgt}</td>
            <td>{row.fmgsn}</td>
            <td>{row.fmgip}</td>
            <td>
                <i className="fa fa-pencil fa-lg" aria-hidden="true"></i>
            </td>
            <td>
                <i className="fa fa-trash fa-lg" aria-hidden="true"></i>
            </td>
        </tr>
    )
}

function RuleTable({ data }) {
    let rows = [];
    data.forEach((row) => {
        rows.push(<RuleTableTr row={row} key={row.id}/>)
    })
    return (
        <table className="table table-bordered">
            <tbody>
                <RuleTableHeader />
                {rows}
            </tbody>
        </table>
    )
}

let data = [{
    id: 1,
    fgt: '192.168.0.2',
    fmgsn: 'FMG-VM0A11000137',
    fmgip: '172.16.95.58',
}, {
    id: 2,
    fgt: 'FGT60D4615007833',
    fmgsn: 'FMG-VM0A11000138',
    fmgip: '172.16.95.59',
}]

function BoxBody() {
    return (
        <div className="box-body">
            <RuleTable data={data}/>
        </div>
    )
}

function BoxFooter() {
    return (
        <div className="box-footer clearfix">
            <ul className="pagination pagination-sm no-margin pull-right">
                <li><a href="#">«</a></li>
                <li><a href="#">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">»</a></li>
            </ul>
        </div>
    )
}

function TableContent() {
    return (
        <section className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="box">
                        <BoxHeader />
                        <BoxBody />
                        <BoxFooter />
                    </div>
                </div>
            </div>
        </section>
    )
}

function Rule() {
    return (
        <div>
            <TableHeader />
            <TableContent />
        </div>
    )
}

export default Rule
