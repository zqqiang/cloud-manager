import React from 'react'
import ReactDOM from 'react-dom'
import MainWithRouter from './components/main.jsx'

global.$ = require('jquery')
require('blueimp-file-upload')

ReactDOM.render(
    <MainWithRouter />,
    document.getElementById('main')
)
