var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
    res.json({
        result: 'success'
    });
});

module.exports = router;
