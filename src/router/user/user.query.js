const useractions = require("./user.js");
const checkAuthenticated = require("../../middleware/auth.js");
const get_user_from_session = require("../../middleware/get_user_from_session.js");
const checkUnAuthenticated = require("../../middleware/unauth.js");

module.exports = function(app)
{
    app.post("/register",checkUnAuthenticated, useractions.register);
    app.post("/login",checkUnAuthenticated, useractions.login);
    app.get("/user_info",checkAuthenticated, useractions.user_info);
    app.get("/logout",get_user_from_session, useractions.logout);
};