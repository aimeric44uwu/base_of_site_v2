const User = require('../../database/models/users')
const checkAuthenticated = require("../../middleware/auth.js");
const cookieParser = require('cookie-parser')
const e = require('express')
const jwt = require('jsonwebtoken')
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
            return res.status(400).cookie('token', "NULL").cookie('name', 'NULL').send({ "status": "error", "message": "Identifiants invalides" });
        }
        User.findOne({ email: req.body.email }).then(function (user, err) {
            if (user) {
                return res.status(400).cookie('token', "NULL").cookie('name', 'NULL').send({ "status": "error", "message": "l'adresse mail utilisé correspond déjà à un compte" });
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
                    return res.status(200).cookie('token', jwt.sign({ _id: Person.unique_id }, 'RESTFULAPIs'), {maxAge : month}).cookie('name', Person.firstName).send({ "status": "success", "message": "Vous vous êtes connecté avec succès, redirection ..." });
                }).catch(function (err) {
                    console.log(err);
                    res.status(400).cookie('token', "NULL").cookie('name', 'NULL').send({ "status": "error", "message": "informations manquantes" });

                });
            }
        }).catch(function (err) {
            res.status(500).send({ "status": "Internalerror", "message": "Erreur, merci de réessayer plus tard" });
            console.log(error);
        });
    } catch (error) {
        res.status(500).send({ "status": "Internalerror", "message": "Erreur, merci de réessayer plus tard" });
        console.log(error);
    }
}

exports.login = async (req, res) => {
    try {
        const elem = req.body
        const email = elem.email
        const password = elem.password

        if (!email || !password) {
            return res.status(400).cookie('token', "NULL").cookie('name', 'NULL').send({ "status": "error", "message": "Identifiants invalides" });
        }
        User.findOne({ email: req.body.email }).then(function (user, err) {
        if (user) {
            const result = req.body.password === user.password;
            if (user.comparePassword(req.body.password)) {
                return res.status(200).cookie('token', jwt.sign({ _id: user.unique_id }, 'RESTFULAPIs'), {maxAge : month}).cookie('name', user.firstName).send({ "status": "success", "message": "Vous vous êtes connecté avec succès, redirection ..." });
            } else {
                return res.status(400).send({ "status": "error", "message": "Mot de passe incorrect" });
            }
        } else {
            return res.status(400).send({ "status": "error", "message": "l'utilisateur n'existe pas" });
        }
        }).catch(function (err) {
            res.status(500).send({ "status": "Internalerror", "message": "Erreur, merci de réessayer plus tard" });
            console.log(err);
        });
    } catch (error) {
        res.status(500).send({ "status": "Internalerror", "message": "Erreur, merci de réessayer plus tard" });
        console.log(error);
    }
}

exports.user_info = async (req, res) => {
    return res.status(200).send({ "status": "success", "name": req.cookies.name});
}

exports.logout = async (req, res) => {
    return res.status(200).cookie('token', "NULL").cookie('name', 'NULL').redirect('/');
}