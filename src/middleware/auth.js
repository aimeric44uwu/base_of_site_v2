const User = require('../database/models/users')
const Session = require('../database/models/session')
var jwt = require('jsonwebtoken');
const clear_cookies = require("./redirect.js").clear_cookies;
const clear_cookies_inservererr = require("./redirect.js").clear_cookies_inservererr;

async function checkAuthenticated(req, res, next) {
    try {
        const session_token = req.cookies.session;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var session_decoded = null;
        if (!session_token || session_token == null || session_token == undefined || session_token == "null")
            return clear_cookies(req, res);
        try {
            session_decoded = jwt.verify(session_token, 'RESTFULAPIs');
        } catch (err) {
            return clear_cookies(req, res);
        }
        if (!session_decoded)
            return clear_cookies(req, res);
        Session.findOne({ unique_session_id: session_decoded.session_id }).then(function (session, err) {
            if (session) {
                User.findOne({ link_session_id: session.signed_id }).then(function (user, err) {
                    if (user) {
                        if (session.expire < Date.now() || session.expire == null || session.expire == undefined ||
                            session.signed_id == null || session.signed_id == undefined ||
                            session.signed_id != user.link_session_id || session.connexionIp != ip ||
                            session.user_signed_id != user.unique_id)
                            return clear_cookies(req, res);
                        else
                            return next();
                    } else
                        return clear_cookies(req, res);
                }).catch(function (err) {
                    console.log("auth.js l 35 error occured : " + err);
                    return clear_cookies_inservererr(req, res);
                });
            } else
                return clear_cookies(req, res);
        }).catch(function (err) {
            console.log("auth.js l 41 error occured : " + err);
            return clear_cookies_inservererr(req, res);
        });
    } catch (error) {
        console.log("auth.js l 45 error occured : " + error);
        return clear_cookies_inservererr(req, res);
    }
}

module.exports = checkAuthenticated;