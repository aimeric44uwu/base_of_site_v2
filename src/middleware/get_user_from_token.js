const User = require('../database/models/users')
const jwt = require('jsonwebtoken');

async function get_user_from_token(req, res, next) {
    try {
        const token = req.cookies.token;
        var decoded = null;
        if (!token || token == "NULL") {
            req.user = null;
            return next();
        }
        try {
            decoded = jwt.verify(token, 'RESTFULAPIs');
        } catch (err) {
            req.user = null;
            return next();
        }
        if (!decoded) {
            req.user = null;
            return next();
        }
        User.findOne({ unique_id: decoded._id }).then(function (user, err) {
            if (user) {
                req.user = user;
                return next();
            } else {
                req.user = null;
                return next();
            }
        }).catch(function (err) {
            console.log(err);
            req.user = null;
            return next();

        });
    } catch (error) {
        console.log(error);
        req.user = null;
        return next();

    }
}

module.exports = get_user_from_token;