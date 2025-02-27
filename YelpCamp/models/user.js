const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passLocalMongo = require('passport-local-mongoose');

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passLocalMongo);

module.exports = mongoose.model('User', userSchema)