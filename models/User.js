const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: {
        type: Array,
        required: true,
    },
    following: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profileDP: {
        type: String
    },
    notifications: {
        type: Array,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);