const Tweet = require('../models/Tweet');
const mongoose = require('mongoose');


const getTweets = async (req, res) => {

    const tweets = await Tweet.find({}).sort({createdAt: -1});
    res.status(200).json(tweets);
}


const getFollowingTweet = async (req, res) => {
    console.log(req.user.following);
    const page = parseInt(req.body.page);
    const limit = parseInt(req.body.limit);

    const tweets = await Tweet.find({'user': {$in: [...req.user.following, req.user._id]}}).limit(limit).skip((page - 1) * limit).sort({createdAt: -1});
    res.status(200).json(tweets);
}


const getTweet = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: 'No Such Tweet'});
    }

    const tweet = await Tweet.findById(id);

    if(!tweet) {
        return res.status(400).json({message: "No Such Tweet"});
    }

    res.status(200).json(tweet);

}



const createTweet = async (req, res) => {
    const {paragraph, likes, hashtags} = req.body;
    console.log(req.body.id);
  
    try {
        const tweet = await Tweet.create({
            paragraph,
            likes,
            hashtags,
            user: req.user._id,
            userId: req.user.userName,
            userName: req.user.name
        });
        res.status(200).json(tweet);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}


const deleteTweet = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: 'No Such Tweet Exist'});
    }

    const tweet = await Tweet.findOneAndDelete({_id: id});
    
    if(!tweet) {
        return res.status(400).json({message: 'No Such Tweet'});
    }

    res.status(200).json({message: "Deleted Successfully"});

}



const updateTweet = async (req, res) => {
    const { id } = req.params;
    const { paragraph, likes, hashtags } = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: 'No Such Tweet'});
    }

    const tweet = await Tweet.findByIdAndUpdate({_id: id}, {
        paragraph, likes, hashtags
    })

    if(!tweet) {
        res.status(400).json({message: 'No Such Tweet'});
    }

    res.status(200).json(tweet);

}

const getSingleUserTweets = async (req, res) => {
    const { userName } = req.params;
    console.log(userName);
    const tweets = await Tweet.find({userId: userName}).sort({createdAt: -1});
    res.status(200).json(tweets);
}

module.exports = {
    createTweet,
    getTweets,
    getTweet,
    deleteTweet,
    updateTweet,
    getFollowingTweet,
    getSingleUserTweets
}