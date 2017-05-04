import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

const selectRowProp = {
    mode: 'checkbox'
};

var products = [{
    id: 1,
    'fgt-ip-sn': 'FGT60D4615006818',
    'fmg-sn': 'FMG-VM0A11000137',
    'fmg-ip': '172.16.95.58',
}, {
    id: 2,
    'fgt-ip-sn': '192.168.0.2',
    'fmg-sn': 'FMG-VM0A11000138',
    'fmg-ip': '172.16.95.59',
}];

function handleInsertButtonClick(history) {
    history.push('/Home/New');
}

const insertBtn = withRouter(({ history }) => {
    return (
        <InsertButton
            btnText='New'
            btnContextual='btn-primary'
            btnGlyphicon='glyphicon-edit'
            onClick={ () => handleInsertButtonClick(history) }/>
    );
})

function onAfterDeleteRow(rowKeys) {

}

const options = {
    afterDeleteRow: onAfterDeleteRow,
    insertBtn: insertBtn
};

class Config extends React.Component {
    render() {
        return (
            <BootstrapTable 
                data={ products } 
                deleteRow={ true } 
                selectRow={ selectRowProp } 
                options={ options } 
                insertRow 
                pagination>
                <TableHeaderColumn dataField='id' isKey>ID</TableHeaderColumn>
                <TableHeaderColumn dataField='fgt-ip-sn' filter={ { type: 'TextFilter', delay: 100 } }>FortiGate</TableHeaderColumn>
                <TableHeaderColumn dataField='fmg-sn'>FortiManager SN</TableHeaderColumn>
                <TableHeaderColumn dataField='fmg-ip'>FortiManager IP</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

export default Config
