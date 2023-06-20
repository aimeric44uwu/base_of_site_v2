async function checkUnAuthenticated(req, res, next) {
    try {
        const token = req.cookies.token;
        if (token && token != "NULL") {
            return res.status(401).redirect("back");
        } else {
            return next();
        }
    } catch (error) {
        console.log(error);
        return res.status(401).send({"msg": "Internal server error"});       
    }
}

module.exports = checkUnAuthenticated;