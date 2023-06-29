const TicTacToeroom = require('../../database/models/games/tictactoe');
const crypto = require('crypto');
const ten_min = 600000;
const five_min = 300000;
const one_min = 60000;
const redirect = require("../../middleware/redirect.js");

const default_moves = {11: [{played : false,player : "",sign: "",}],12: [{played : false,player : "",sign: "",}],13: [{played : false,player : "",sign: "",}],21: [{played : false,player : "",sign: "",}],22: [{played : false,player : "",sign: "",}],23: [{played : false,player : "",sign: "",}],31: [{played : false,player : "",sign: "",}],32: [{played : false,player : "",sign: "",}],33: [{played : false,player : "",sign: "",}]}

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
                player1name: req.user.username,
                player2: null,
                player2name: null,
                playerturn: req.user._id,
                nbplayer: 1,
                expire: Date.now() + ten_min,
                timeout: Date.now() + five_min
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
                    { $set: { player1: userid, player1name: req.user.firstName, nbplayer: nb_player_in_room, moves: default_moves, expire: Date.now() + hour } }).then((data2, err) => {
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
                    { $set: {
                        player2: userid,
                        player2name: req.user.username,
                        nbplayer: 2,
                        moves: default_moves,
                        expire: Date.now() + ten_min,
                        timeout: Date.now() + five_min
                    }
                }).then((data2, err) => {
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
                                    moves: default_moves,
                                    expire: Date.now() + ten_min,
                                    timeout: Date.now() + five_min
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
                                    moves: default_moves,
                                    expire: Date.now() + ten_min,
                                    timeout: Date.now() + five_min
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

function checkifwin(new_pos)
{
    if ((new_pos[0][11][0].sign == new_pos[0][12][0].sign && new_pos[0][12][0].sign == new_pos[0][13][0].sign && new_pos[0][11][0].sign != "")
    || (new_pos[0][21][0].sign == new_pos[0][22][0].sign && new_pos[0][22][0].sign == new_pos[0][23][0].sign && new_pos[0][21][0].sign != "")
    || (new_pos[0][31][0].sign == new_pos[0][32][0].sign && new_pos[0][32][0].sign == new_pos[0][33][0].sign && new_pos[0][31][0].sign != "")
    || (new_pos[0][11][0].sign == new_pos[0][21][0].sign && new_pos[0][21][0].sign == new_pos[0][31][0].sign && new_pos[0][11][0].sign != "")
    || (new_pos[0][12][0].sign == new_pos[0][22][0].sign && new_pos[0][22][0].sign == new_pos[0][32][0].sign && new_pos[0][12][0].sign != "")
    || (new_pos[0][13][0].sign == new_pos[0][23][0].sign && new_pos[0][23][0].sign == new_pos[0][33][0].sign && new_pos[0][13][0].sign != "")
    || (new_pos[0][11][0].sign == new_pos[0][22][0].sign && new_pos[0][22][0].sign == new_pos[0][33][0].sign && new_pos[0][11][0].sign != "")
    || (new_pos[0][13][0].sign == new_pos[0][22][0].sign && new_pos[0][22][0].sign == new_pos[0][31][0].sign && new_pos[0][13][0].sign != ""))
        return true;
    return false;
}

function checkdraw(new_pos)
{
    if (new_pos[0][11][0].played == true && new_pos[0][12][0].played == true && new_pos[0][13][0].played == true &&
        new_pos[0][21][0].played == true && new_pos[0][22][0].played == true && new_pos[0][23][0].played == true &&
        new_pos[0][31][0].played == true && new_pos[0][32][0].played == true && new_pos[0][33][0].played == true && checkifwin(new_pos) == false)
        return true;
    return false;
}


exports.placetictatoe = async (req, res) => {
    pos = req.body.pos;
    const roomid = req.params.Room_Id;
    const userid = req.user._id;
    TicTacToeroom.findOne({ public_session_id: roomid }).then((data, err) => {
        if (data) {
            TicTacToeroom.findOne({ $or: [{ "player1": userid }, { "player2": userid }] }).then((data2, err) => {
                if (data2) {
                    if (data2.player2 != null && data2.player2 != undefined && data2.player2 != "null" &&
                        data2.player1 != null && data2.player1 != undefined && data2.player1 != "null" ) {
                            if (data2.playerturn == userid && data2.playerturn != null && data2.playerturn != undefined && data2.playerturn != "null" && data2.isfinished == false) {
                                if (data2.moves[0][pos][0].played == false) {
                                    new_pos = data2.moves;
                                    new_pos[0][pos][0].played = true;
                                    new_pos[0][pos][0].player = userid;
                                    if (data2.player1 == userid)
                                        new_pos[0][pos][0].sign = "cross";
                                    else
                                        new_pos[0][pos][0].sign = "circle";
                                    TicTacToeroom.updateOne({ unique_session_id: data2.unique_session_id },
                                        { $set: {
                                                moves: new_pos,
                                                playerturn: data2.playerturn == data2.player1 ? data2.player2 : data2.player1,
                                            }
                                        }).then((data3, err) => {
                                            if (data3) {
                                                if (checkifwin(new_pos) == true && checkdraw(new_pos) == false) {
                                                    TicTacToeroom.updateOne({ unique_session_id: data2.unique_session_id },
                                                        { $set: {
                                                                isfinished: true,
                                                                winnerid: userid,
                                                                timeout: Date.now() + one_min,
                                                                expire: Date.now() + one_min
                                                            }
                                                        }).then((data4, err) => {
                                                            if (data4) {
                                                                return res.status(200).send({ "status": "win", "message": `Vous avez gagné`, "data": new_pos})
                                                            }
                                                        }).catch((err) => {
                                                            console.log(err);
                                                        });
                                                } else if (checkdraw(new_pos) == true) {
                                                    TicTacToeroom.updateOne({ unique_session_id: data2.unique_session_id },
                                                        { $set: {
                                                                isfinished: true,
                                                                winnerid: "draw",
                                                                timeout: Date.now() + one_min,
                                                                expire: Date.now() + one_min
                                                            }
                                                        }).then((data4, err) => {
                                                            if (data4) {
                                                                return res.status(200).send({ "status": "draw", "message": `partie terminé`, "data": new_pos})
                                                            }
                                                        }).catch((err) => {
                                                            console.log(err);
                                                        });
                                                } else {
                                                    return res.status(200).send({ "status": "success", "message": `Vous avez joué en ${pos}`, "data": new_pos})
                                                }
                                            } else {
                                                console.log(err);
                                                return res.status(500).send({ "status": "error", "message": "une erreur est survenue "})
                                            }
                                        }).catch((err) => {
                                            console.log(err);
                                        });
                                } else {
                                    return res.status(401).send({ "status": "already_played", "message": "position déjà joué" });

                                }
                            } else {
                                return res.status(401).send({ "status": "not_your_turn", "message": "ce n'est pas votre tour" });
                            }
                    } else {
                        return res.status(401).send({ "status": "missing_player", "message": "il manque un joueur" });
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

exports.getplayedpos = async (req, res) => {
    const roomid = req.params.Room_Id;
    const userid = req.user._id;
    if (!userid)
        return res.status(401).redirect("/login");
    TicTacToeroom.findOne({ public_session_id: roomid }).then((data, err) => {
        if (data) {
            TicTacToeroom.findOne({ $or: [{ "player1": userid }, { "player2": userid }] }).then((data2, err) => {
                if (data2) {
                    let is_timeout = false;
                    if (data2.timeout > Date.now())
                        is_timeout = true;
                    let turn = ""
                    let winner = ""
                    if (data2.playerturn == userid) {
                        turn = "your_turn";
                    } else {
                        turn = "not_your_turn";
                    }
                        
                    if (data2.isfinished == true && data2.winnerid == userid) {
                        winner = "you";
                    } else if (data2.isfinished == true && data2.winnerid != userid && data2.winnerid != null && data2.winnerid != undefined && data2.winnerid != "null" && data2.winnerid != "draw") {
                        winner = "enemy";
                    } else if (data2.isfinished == true && data2.winnerid != userid && data2.winnerid != null && data2.winnerid != undefined && data2.winnerid != "null" && data2.winnerid == "draw") {
                        winner = "draw";
                    }
                    return res.status(200).send({ "status": "success", "message": "positions récupérées avec succès", "data": data2.moves, "turn": turn, "isfinished": data2.isfinished, "winner": winner,"timeremaining": ((data2.timeout - Date.now()) | 0) ,"timeout": is_timeout });
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