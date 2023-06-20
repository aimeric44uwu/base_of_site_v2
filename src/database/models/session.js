const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var hour = 3600000;
var day = hour * 24;
var month = day * 30;


sessionSchema = new Schema( {
	unique_session_id: {
        type: String,
        unique: true,
        trim: true
    },
    signed_id: {
        type: String,
        unique: true,
        lowercase: true,
    },
    connexionIp: {
        type: String,
        unique: false,
    },
    expire: {
		type: Date,
		default: Date.now + month
    },
	createdAt: {
		type: Date,
		default: Date.now
	}
}),

sessionSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

Session = mongoose.model('session', sessionSchema);

module.exports = Session;