var express = require('express');
var passport = require('../auth/auth');

var router = express.Router();

router.post('/', passport.authenticate('local'), function(req, res) {
    res.json({
        result: 'success',
        token: passport.auth[req.body.username]
    });
});

module.exports = router;
