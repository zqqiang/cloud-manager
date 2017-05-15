var express = require('express');
var router = express.Router();

router.put('/', function(req, res) {

    res.json({
        result: 'success'
    });

});

module.exports = router;
