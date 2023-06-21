const useractions = require("./user.js");
const checkAuthenticated = require("../../middleware/auth.js");
const get_user_from_token = require("../../middleware/get_user_from_token.js");

module.exports = function(app)
{
    app.post("/register", useractions.register);
    app.post("/login", useractions.login);
    app.get("/user_info",checkAuthenticated, useractions.user_info);
    app.get("/logout",get_user_from_token, useractions.logout);
};