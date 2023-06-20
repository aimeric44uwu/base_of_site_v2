const User = require('../database/models/users')
var jwt = require('jsonwebtoken');

async function checkAuthenticated(req, res, next) {
    try {
        const token = req.cookies.token;
        var decoded = null;
        if (!token || token == "NULL") {
            return res.status(401).cookie("token", "NULL").cookie('name', 'NULL').redirect("/login");
        }
        try {
            decoded = jwt.verify(token, 'RESTFULAPIs');
        } catch (err) {
            return res.status(401).cookie("token", "NULL").cookie('name', 'NULL').redirect("/login");
        }
        if (!decoded)
            return res.status(401).cookieParser("token", "NULL").redirect("/login");
        User.findOne({ unique_id: decoded._id }).then(function (user, err) {
            if (user) {
                return next();
            } else {
                return res.status(400).redirect("/login");
            }
        }).catch(function (err) {
            console.log(err);
            return res.status(500).cookie("token", "NULL").cookie('name', 'NULL').redirect("/login");

        });
    } catch (error) {
        console.log(error);
        return res.status(401).send({ "status": "Internalerror", "message": "Une erreur est survenue merci de réésayer plus tard" });  
    }
}

module.exports = checkAuthenticated;