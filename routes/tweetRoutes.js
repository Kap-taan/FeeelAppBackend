const express = require('express');
const { createTweet, getTweets, getTweet, updateTweet, deleteTweet, getFollowingTweet, getSingleUserTweets } = require('../controllers/tweetController');
const {protect} = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/', protect, getTweets)

router.get('/following', protect, getFollowingTweet);


router.get('/:id', protect, getTweet)


router.post('/', protect, createTweet)


router.delete('/:id', protect, deleteTweet) 


router.patch('/:id', protect, updateTweet)

router.get('/user/:userName', protect, getSingleUserTweets);

module.exports = router;