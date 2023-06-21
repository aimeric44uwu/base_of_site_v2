const User = require('../../database/models/users')
const Session = require('../../database/models/session')
const checkAuthenticated = require("../../middleware/auth.js");
const redirects = require("../../middleware/redirect.js");

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const e = require('express')
const crypto = require('crypto');

var hour = 3600000;
var day = hour * 24;
var month = day * 30;


exports.index = (req, res) => {
}

exports.register = async (req, res) => {
    try {
        const elem = req.body
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (!req.body.email || !req.body.password || !req.body.adress || !req.body.phonenumber || !req.body.firstName || !req.body.lastName) {
            return redirects.missing_infos(req, res);
        }
        User.findOne({ email: req.body.email }).then(function (user, err) {
            if (user) {
                return redirects.email_already_exist(req, res);
            } else {
                const new_unique_id = crypto.randomUUID();
                const newPerson = new User({
                    unique_id: new_unique_id,
                    phonenumber: req.body.phonenumber,
                    email: req.body.email,
                    role: "normal",
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: req.body.password,
                    adress: req.body.adress,
                    creationIp: ip,
                    LastModificationIp: ip,
                });
                newPerson.save().then(function (Person) {
                    const uuid_session_id = crypto.randomUUID()
                    const unique_link_session_id = crypto.randomUUID()
                    const newSession = new Session({
                        unique_session_id: uuid_session_id,
                        signed_id: unique_link_session_id,
                        connexionIp: ip,
                        expire: Date.now() + month,
                    });
                    newSession.save().then(function (Session) {
                        Person.link_session_id = unique_link_session_id
                        Person.updateOne({ link_session_id: unique_link_session_id }).then(function (newuser) {
                            if (Person.link_session_id == Session.signed_id)
                                return res.status(200).cookie('token', jwt.sign({ _id: Person.unique_id }, 'RESTFULAPIs'), {maxAge : month}).cookie('session', jwt.sign({ session_id: uuid_session_id }, 'RESTFULAPIs'), {maxAge : month}).cookie('name', Person.firstName).send({ "status": "success", "message": "Vous vous êtes enregistré avec succès, redirection ..." });
                            else if (Person != null && Person != undefined && Person != 'NULL')
                                return redirects.register_inservererr(req, res);
                        }).catch(function (err) {
                            console.log(" 6 -> " + err);
                            return redirects.register_inservererr(req, res);
                        });
                    }).catch(function (err) {
                        console.log(" 5 -> " + err);
                        return redirects.register_inservererr(req, res);
                    });
                }).catch(function (err) {
                    console.log(" 4 -> " + err);
                    return redirects.register_inservererr(req, res);
                });
            }
        }).catch(function (err) {
            console.log(" 3 -> " + err);
            return redirects.register_inservererr(req, res);
        });
    } catch (error) {
        console.log(" 2 -> " + error);
        return redirects.register_inservererr(req, res);
    }
}

exports.login = async (req, res) => {
    try {
        const elem = req.body
        const email = elem.email
        const password = elem.password
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (!email || !password) {
            return redirects.missing_infos(req, res);
        }
        User.findOne({ email: req.body.email }).then(function (user, err) {
        if (user) {
            const result = req.body.password === user.password;
            if (user.comparePassword(req.body.password)) {
                const uuid_session_id = crypto.randomUUID()
                const unique_link_session_id = crypto.randomUUID()
                const newSession = new Session({
                    unique_session_id: uuid_session_id,
                    signed_id: unique_link_session_id,
                    connexionIp: ip,
                    expire: Date.now() + month,
                });
                newSession.save().then(function (Session) {
                user.link_session_id = unique_link_session_id
                    user.updateOne({ link_session_id: unique_link_session_id }).then(function (newuser) {
                        if (user.link_session_id == Session.signed_id)
                            return res.status(200).cookie('token', jwt.sign({ _id: user.unique_id }, 'RESTFULAPIs'), {maxAge : month}).cookie('session', jwt.sign({ session_id: uuid_session_id }, 'RESTFULAPIs'), {maxAge : month}).cookie('name', user.firstName).send({ "status": "success", "message": "Vous vous êtes connecté avec succès, redirection ..." });
                        else if (newuser != null && newuser != undefined && newuser != 'NULL')
                            return redirects.invalid_session(req, res);
                    }).catch(function (err) {
                        console.log(" 4-> " + err);
                        return redirects.login_inservererr(req, res);
                    });
                }).catch(function (err) {
                    console.log(" 3-> " + err);
                    return redirects.login_inservererr(req, res);
                });
            } else {
                return redirects.incorrect_password(req, res);
            }
        } else {
            return redirects.incorrect_email(req, res);
        }
        }).catch(function (err) {
            console.log(" 2-> " + err);
            return redirects.login_inservererr(req, res);
        });
    } catch (error) {
        console.log(" 1-> " + error);
        redirects.login_inservererr(req, res);
    }
}

exports.user_info = async (req, res) => {
    return res.status(200).send({ "status": "success", "name": req.cookies.name});
}

exports.logout = async (req, res) => {
    if (req.user != 'NULL' && req.user != null && req.user != undefined) {
        Session.deleteOne({ signed_id: req.user.link_session_id }).then(function (session, err) {
            if (session) {
                return redirects.logout_success(req, res);
            } else {
                console.log(err);
                return redirects.logout_error_occured(req, res);
            }
        }).catch(function (err) {
            console.log(err);
        });
    } else {
        return redirects.logout_success(req, res);
    }
}