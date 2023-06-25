const User = require('../database/models/users')
const jwt = require('jsonwebtoken');

async function get_user_from_session(req, res, next) {
    try {
        const session = req.cookies.session;
        var decoded = null;
        if (!session || session == null || session == undefined || session == "null") {
            req.user = null;
            return next();
        }
        try {
            decoded = jwt.verify(session, 'RESTFULAPIs');
        } catch (err) {
            req.user = null;
            return next();
        }
        if (!decoded) {
            req.user = null;
            return next();
        }
        Session.findOne({ unique_session_id: decoded.session_id }).then(function (session, err) {
            if (session && session != null && session != undefined && session != "null" && session.expire > Date.now()) {
                User.findOne({ link_session_id: session.signed_id }).then(function (user, err) {
                    if (user && session.user_signed_id == user.unique_id) {
                        req.user = user;
                        return next();
                    } else {
                        req.user = null;
                        return next();
                    }
                }).catch(function (err) {
                    console.log("get_user_from_session.js l 33 error occured : " + err);
                    req.user = null;
                    return next();

                });
            } else {
                req.user = null;
                return next();
            }
        }).catch(function (err) {
                console.log("get_user_from_session.js l 43 error occured : " + err);
                return clear_cookies_inservererr(req, res);
    
        });
    } catch (error) {
        console.log("get_user_from_session.js l 48 error occured : " + error);
        req.user = null;
        return next();

    }
}

module.exports = get_user_from_session;