const express = require('express');
const { registerUser, loginUser, getMe, getUsers, getSingleUser, addFollowing, getFollowingDetails, getFollowersDeatils, unFollowUser } = require('../controllers/userController');
const { protect }  = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getMe);

router.get('/', protect, getUsers);

router.get('/user/:userName', getSingleUser);

router.patch('/me/unfollow', protect, unFollowUser);

router.patch('/me/following', protect, addFollowing);

router.get('/me/following', protect, getFollowingDetails);

router.get('/me/followers', protect, getFollowersDeatils);



module.exports = router;