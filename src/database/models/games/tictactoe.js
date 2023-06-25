const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var hour = 3600000;


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
    },
    ispublic : {
        type: Boolean,
    },
    roompassword : {
        type: String,
    },
    expire: {
		type: Date,
		default: Date.now + hour
    },
	createdAt: {
		type: Date,
		default: Date.now
	}
}),

TicTacToeroom = mongoose.model('tictactoeroom', tictactoeroomSchema);

module.exports = TicTacToeroom;