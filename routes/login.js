var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
    console.log(req.body)

    const body = req.body;

    if (body.client_id === 'admin') {
        res.json({
            result: 'success'
        });
    } else {
        res.json({
            result: 'failed'
        });
    }
});

module.exports = router;
