const User = require('../database/models/users')
const Session = require('../database/models/session')
var jwt = require('jsonwebtoken');
const clear_cookies = require("./redirect.js").clear_cookies;
const clear_cookies_inservererr = require("./redirect.js").clear_cookies_inservererr;

async function checkAuthenticated(req, res, next) {
    try {
        const token = req.cookies.token;
        const session_token = req.cookies.session;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var token_decoded = null;
        var session_decoded = null;
        if (!token || token == "NULL" || !session_token || session_token == "NULL") {
            return clear_cookies(req, res);
        }
        try {
            token_decoded = jwt.verify(token, 'RESTFULAPIs');
            session_decoded = jwt.verify(session_token, 'RESTFULAPIs');
        } catch (err) {
            return clear_cookies(req, res);(req, res);
        }
        if (!token_decoded || !session_decoded)
            return clear_cookies(req, res);
        User.findOne({ unique_id: token_decoded._id }).then(function (user, err) {
            if (user) {
                Session.findOne({ unique_session_id: session_decoded.session_id }).then(function (session, err) {
                    if (session) {
                        if (session.expire < Date.now()) {
                            return clear_cookies(req, res);
                        } else {
                            if (session.signed_id == "NULL" || session.signed_id == null || session.signed_id == undefined) {
                                return clear_cookies(req, res);
                            } else {
                                if (session.signed_id != user.link_session_id || session.connexionIp != ip) {
                                    return clear_cookies(req, res);
                                } else {
                                    return next();
                                }
                            }
        
                        }
                    } else {
                        return clear_cookies(req, res);
                    }
                }).catch(function (err) {
                    console.log(err);
                    return clear_cookies_inservererr(req, res);
        
                });
            } else {
                return clear_cookies(req, res);
            }
        }).catch(function (err) {
            console.log(err);
            return clear_cookies_inservererr(req, res);

        });
    } catch (error) {
        console.log(error);
        return clear_cookies_inservererr(req, res);
    }
}

module.exports = checkAuthenticated;