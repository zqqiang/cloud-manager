const jwt = require('jsonwebtoken');
var db = require('../db');

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).end();
    }
    const token = req.headers.authorization.split(' ')[1];
    return jwt.verify(token, 'secret', { expiresIn: '1h' }, (err, decode) => {
        if (err) {
            return res.status(401).end();
        }
        const userId = decode.sub;
        return db.users.findById(userId, function(err, user) {
            if (err || !user) {
                return res.status(401).end();
            }
            return next();
        });
    })
}
