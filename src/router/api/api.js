const get_user_from_token = require("../../middleware/get_user_from_session.js");
const User = require('../../database/models/users')


exports.user_profile_info_api = async (req, res) => {
    if (!req.user || req.user == null) {
        return res.send({ "status": "error", "message": "une erreur est survenue lors de la récupération de vos données", "data": null});
    } else {
        const user_infos = {
            //"name": req.user.firstName,
            //"lastName": req.user.lastName,
            "username": req.user.username,
            "email": req.user.email,
            //"adress": req.user.adress,
            //"phonenumber": req.user.phonenumber
        }
        return res.send({ "status": "success", "message": "données récupérées avec succès", "data": user_infos});
    }
}

exports.navbar_info_api = async (req, res) => {
    if (!req.user || req.user == null) {
        return res.send({ "status": "notloggedin", "message": "vous n'êtes pas connecté", "data": null});
    } else {
        return res.send({ "status": "loggedin", "message": "vous êtes connéctés", "data": {"username": req.user.username}});
    }
}