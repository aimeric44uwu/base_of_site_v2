const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ten_min = 600000;
const five_min = 300000;
const datenow = Date.now;


tictactoeroomSchema = new Schema( {
	unique_session_id: {
        type: String,
        unique: true,
        trim: true
    },
    public_session_id: {
        type: String,
        unique: true,
        required: true,
    },
    player1: {
        type: String,
    },
    player1name : {
        type: String,
    },
    player2: {
        type: String,
    },
    player2name : {
        type: String,
    },
    playerturn : {
        type: String,
    },
    nbplayer : {
        type: Number,
    },
    moves : {
        type: Array,
        default: {
            11: [
                {
                    played : false,
                    player : "",
                    sign: "",
                }
            ],
            12: [
                {
                    played : false,
                    player : "",
                    sign: "",
                }
            ],
            13: [
                {
                    played : false,
                    player : "",
                    sign: "",
                }
            ],
            21: [
                {
                    played : false,
                    player : "",
                    sign: "",
                }
            ],
            22: [
                {
                    played : false,
                    player : "",
                    sign: "",
                }
            ],
            23: [
                {
                    played : false,
                    player : "",
                    sign: "",
                }
            ],
            31: [
                {
                    played : false,
                    player : "",
                    sign: "",
                }
            ],
            32: [
                {
                    played : false,
                    player : "",
                    sign: "",
                }
            ],
            33: [
                {
                    played : false,
                    player : "",
                    sign: "",
                }
            ]

        }
    },
    ispublic : {
        type: Boolean,
    },
    isfinished : {
        type: Boolean,
        default: false,
    },
    winnerid : {
        type: String,
    },
    roompassword : {
        type: String,
    },
    timeout : {
        type: Date,
        default: datenow + five_min
    },
    expire: {
		type: Date,
		default: datenow + ten_min
    },
	createdAt: {
		type: Date,
		default: datenow
	}
}),

TicTacToeroom = mongoose.model('tictactoeroom', tictactoeroomSchema);

module.exports = TicTacToeroom;