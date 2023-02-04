const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    paragraph: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    hashtags: {
        type: Array,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Tweet', tweetSchema);