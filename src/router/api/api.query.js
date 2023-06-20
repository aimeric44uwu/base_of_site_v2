const api_interactions = require("./api.js");
const checkAuthenticated = require("../../middleware/auth.js");
const get_user_from_token = require("../../middleware/get_user_from_token.js");

module.exports = function(app)
{
    app.get("/user_profile_info_api",checkAuthenticated, get_user_from_token, api_interactions.user_profile_info_api);
    app.get("/navbar_info_api", get_user_from_token, api_interactions.navbar_info_api);

};