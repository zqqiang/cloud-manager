import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

function onAfterInsertRow(row) {

}

function onAfterDeleteRow(rowKeys) {

}

const selectRowProp = {
    mode: 'checkbox'
};

var products = [{
    id: 1,
    name: "Product1",
    price: 120
}, {
    id: 2,
    name: "Product2",
    price: 80
}];

const options = {
    afterInsertRow: onAfterInsertRow,
    afterDeleteRow: onAfterDeleteRow
};

const cellEditProp = {
    mode: 'dbclick',
    blurToSave: true
};

class Config extends React.Component {
    render() {
        return (
            <BootstrapTable 
                data={ products } 
                insertRow={ true } 
                deleteRow={ true } 
                selectRow={ selectRowProp } 
                options={ options } 
                cellEdit={ cellEditProp }
            >
                <TableHeaderColumn dataField='id' isKey>Product ID</TableHeaderColumn>
                <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
                <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

export default Config
