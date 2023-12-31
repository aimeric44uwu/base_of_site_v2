const games_interation = require("./games.js");
const checkAuthenticated = require("../../middleware/auth.js");
const get_user_from_session = require("../../middleware/get_user_from_session.js");

module.exports = function(app)
{
    app.get("/games/tic-tac-toe",checkAuthenticated, get_user_from_session, games_interation.tictatoe);
    app.post("/games/tic-tac-toe/create_room",checkAuthenticated, get_user_from_session, games_interation.createtictatoe);
    app.get("/games/tic-tac-toe/list_room",checkAuthenticated, get_user_from_session, games_interation.listroomtictatoe);
    app.get("/games/tic-tac-toe/room/:Room_Id",checkAuthenticated, get_user_from_session, games_interation.joinroomtictatoe);
    app.delete("/games/tic-tac-toe/room/:Room_Id",checkAuthenticated, get_user_from_session, games_interation.leaveroomtictatoe);
    app.put("/games/tic-tac-toe/room/:Room_Id",checkAuthenticated, get_user_from_session, games_interation.placetictatoe);
    app.get("/games/tic-tac-toe/room/:Room_Id/playedpos",checkAuthenticated, get_user_from_session, games_interation.getplayedpos);

};