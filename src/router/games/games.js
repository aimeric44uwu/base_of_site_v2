const TicTacToeroom = require('../../database/models/games/tictactoe');
const crypto = require('crypto');
var hour = 3600000;
const redirect = require("../../middleware/redirect.js");

exports.tictatoe = async (req, res) => {
    const userid = req.user._id;
    TicTacToeroom.findOne({ $or: [{ "player1": userid }, { "player2": userid }] }).then((data, err) => {
        if (data) {
            return res.status(200).redirect('/games/tic-tac-toe/room/' + data.public_session_id);
        } else {
            return res.status(200).render('games/tictactoe/tictactoe_menu.ejs');
        }
    }).catch((err) => {
        console.log(err);
        return res.redirect("/");
    })
}

exports.createtictatoe = async (req, res) => {
    const userid = req.user._id;
    TicTacToeroom.findOne({ $or: [{ "player1": userid }, { "player2": userid }] }).then((data, err) => {
        if (data) {
            return res.status(200).send({ "status": "success", "message": "Vous avez deja une salle, redirection...", "data": data });
        } else {
            const new_unique_id = crypto.randomUUID();
            const public_session_id = crypto.randomInt(10000, 99999);
            const new_room = new TicTacToeroom({
                unique_session_id: new_unique_id,
                public_session_id: public_session_id,
                player1: req.user._id,
                player1name: req.user.firstName,
                player2: null,
                player2name: null,
                playerturn: req.user._id,
                nbplayer: 1,
                expire: Date.now() + hour
            });
            new_room.save().then((data, err) => {
                if (data) {
                    return res.status(200).send({ "status": "success", "message": "Salle Crée", "data": data });
                }
                else {
                    console.log(err);
                    return res.status(500).send({ "status": "internerror", "message": "Une erreur est survenue merci de réesayer plus tard", "data": null });
                }

            }).catch((err) => {
                console.log(err);
                return res.status(500).send({ "status": "internerror", "message": "Une erreur est survenue merci de réesayer plus tard", "data": null });
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({ "status": "internerror", "message": "Une erreur est survenue merci de réesayer plus tard", "data": null });
    })
}

exports.joinroomtictatoe = async (req, res) => {
    const roomid = req.params.Room_Id;
    const userid = req.user._id;
    TicTacToeroom.findOne({ public_session_id: roomid }).then((data, err) => {
        if (data) {
            if (data.player1 == userid) {
                return res.status(200).render('games/tictactoe/tictactoe_room.ejs');
            } else if (data.player1 == null) {
                nb_player_in_room = 0;
                TicTacToeroom.updateOne({ unique_session_id: data.unique_session_id },
                    { $set: { player1: userid, player1name: req.user.firstName, nbplayer: nb_player_in_room, expire: Date.now() + hour } }).then((data2, err) => {
                        if (data2) {
                            return res.status(200).render('games/tictactoe/tictactoe_room.ejs');
                        } else {
                            console.log(err);
                            return res.status(500).redirect('/games/tic-tac-toe');
                        }
                    }).catch((err) => {
                        console.log(err);
                        return res.status(500).redirect('/games/tic-tac-toe');
                    });
            } else if (data.player2 == null && data.player1 != userid && data.player1 != null) {
                TicTacToeroom.updateOne({ unique_session_id: data.unique_session_id },
                    { $set: { player2: userid, player2name: req.user.firstName, nbplayer: 2, expire: Date.now() + hour } }).then((data2, err) => {
                        if (data2) {
                            return res.status(200).render('games/tictactoe/tictactoe_room.ejs');
                        } else {
                            console.log(err);
                            return res.status(500).redirect('/games/tic-tac-toe');
                        }
                    }).catch((err) => {
                        console.log(err);
                        return res.status(500).redirect('/games/tic-tac-toe');
                    });
            } else if (data.player2 == userid) {
                return res.status(200).render('games/tictactoe/tictactoe_room.ejs');
            } else {
                return res.status(500).redirect('/games/tic-tac-toe');
            }
        } else {
            return res.status(500).redirect('/games/tic-tac-toe');
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).redirect('/games/tic-tac-toe');
    });
}

exports.leaveroomtictatoe = async (req, res) => {
    const roomid = req.params.Room_Id;
    const userid = req.user._id;
    TicTacToeroom.findOne({ public_session_id: roomid }).then((data, err) => {
        if (data) {
            TicTacToeroom.findOne({ $or: [{ "player1": userid }, { "player2": userid }] }).then((data2, err) => {
                if (data2) {
                    if (data2.player1 == userid && (data2.player2 != null && data2.player2 != undefined)) {
                        TicTacToeroom.updateOne({ unique_session_id: data2.unique_session_id },
                            { $set: {
                                    player1: data2.player2,
                                    player1name: data2.player2name,
                                    player2: null,
                                    player2name: null,
                                    playerturn: data2.player2,
                                    nbplayer: 1,
                                    expire: Date.now() + hour
                                }
                            }).then((data3, err) => {
                                if (data3) {
                                    return res.status(200).send({ "status": "success", "message": "Vous avez quitté, redirection..." });
                                } else {
                                    console.log(err);
                                    return redirect.error_while_deleting_room(req, res);
                                }
                            }).catch((err) => {
                                console.log(err);
                                return redirect.error_while_deleting_room(req, res);
                            });
                    } else if (data2.player2 == userid) {
                        TicTacToeroom.updateOne({ unique_session_id: data2.unique_session_id },
                            { $set: {
                                    player2: null,
                                    player2name: null,
                                    playerturn: data2.player1,
                                    nbplayer: 1,
                                    expire: Date.now() + hour
                                }
                            }).then((data3, err) => {
                                if (data3) {
                                    return res.status(200).send({ "status": "success", "message": "Vous avez quitter, redirection..." });
                                } else {
                                    console.log(err);
                                    return redirect.error_while_leaving_room(req, res);
                                }
                            }).catch((err) => {
                                console.log(err);
                                return redirect.error_while_leaving_room(req, res);
                            });
                    } else {
                        TicTacToeroom.deleteOne({ unique_session_id: data2.unique_session_id }).then((data3, err) => {
                            if (data3) {
                                return res.status(200).send({ "status": "success", "message": "Salle supprimé, redirection..." });
                            } else {
                                console.log(err);
                                return redirect.error_while_deleting_room(req, res);
                            }
                        }).catch((err) => {
                            console.log(err);
                            return redirect.error_while_deleting_room(req, res);
                        });
                    }
                } else {
                    return redirect.not_your_room(req, res);
                }
            }).catch((err) => {
                console.log(err);
                redirect.not_your_room(req, res);
            })

        } else {
            return redirect.room_not_found(req, res);
        }
    }).catch((err) => {
        console.log(err);
        return redirect.room_not_found(req, res);
    });
}

exports.listroomtictatoe = async (req, res) => {
    let result = "[";
    nbelement = 0;
    TicTacToeroom.find({ player2: null }).then((data, err) => {
        if (data) {
            data.forEach(element => {
                result += '{"creator_name" : "';
                result += element.player1name + '",';
                result += '"room_id" : "';
                result += element.public_session_id + '"}';
                if (nbelement != data.length - 1)
                    result += ",";
                nbelement++;
            });
            result += "]";
            JSON.parse(result);
            return res.status(200).send({ "status": "success", "message": "Salle récupérées avec succès", "data": result });
        } else {
            console.log(err);
            return redirect.error_while_listing_rooms(req, res);
        }
    }).catch((err) => {
        console.log(err);
        return redirect.error_while_listing_rooms(req, res);
    });
}