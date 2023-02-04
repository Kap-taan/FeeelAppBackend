// const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mongoose = require('mongoose');

const registerUser = async (req, res) => {
    const { userName, password, name } = req.body;
    
    if(!userName || !password || !name) {
        return res.status(400).json({error: "Some Field is missing"});
    }
 
    const userExist = await User.findOne({userName});
    if(userExist) {
        return res.status(400).json({error: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        userName,
        name,
        password: hashedPassword,
        following: [],
        followers: [],
        notifications: [],
        profileDP: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
    });

    if(user) {
        res.status(200).json(user);
    } else {
        res.status(400).json({error: "Something went wrong"});
    }

}


const loginUser = async (req, res) => {
    const { userName, password } = req.body;
   
    const user = await User.findOne({userName});
    
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            id: user._id, 
            userName: user.userName, 
            name: user.name,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({error: "Invalid Credentials"});
    }
}

// @desc 
// @route 
// @access 

const getMe = (req, res) => {
    res.json(req.user);
}


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}


const getUsers = async (req,res) => {
    const currentUser = await User.findById(req.user._id);
    const users = await User.find({'_id': { $nin: [...currentUser.following, currentUser._id]}}, ['userName', 'name', 'profileDP']).limit(5);
    if(users) {
        return res.status(200).json(users);
    }
    res.status(400).json({error: "No Users Found"});
}

const getSingleUser = async (req, res) => {
    const { userName } = req.params;
    const user = await User.findOne({userName}, ['name', 'userName', 'profileDP', 'followers', 'following']);
    if(user) {
        return res.status(200).json(user);
    }
    return res.status(400).json({error: "No Such User Found"});
}


const addFollowing = async (req, res) => {
    const { userId } = req.body;
    console.log(req.user._id);
    if(!mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(400).json({message: 'No Such User'});
    }
    console.log(userId);

    const currentUser = await User.findById(req.user._id);
    const user1 = await User.findByIdAndUpdate({_id: req.user._id}, {
        following: [...currentUser.following, userId],
        
    })
    const followingUser = await User.findById(userId);
    const followingUser1 = await User.findByIdAndUpdate({_id: userId}, {
        followers: [...followingUser.followers, req.user._id.toString()],
        notifications: [...followingUser.notifications, {message: `${currentUser.userName} starts following you`, created_at: new Date()}]
    })

    res.status(200).json('New Following added successfully');

}

const getFollowingDetails = async (req, res) => {
    const followings = req.user.following;
    const following = await User.find({'_id': {$in: followings}}, ['name', 'userName', 'profileDP']);
    if(following) {
        return res.status(200).json(following);
    }
    res.status(200).json([]);
}


const getFollowersDeatils = async (req, res) => {
    const followers = req.user.followers;
    const follower = await User.find({'_id': {$in: followers}}, ['name', 'userName', 'profileDP']);
    if(follower) {
        return res.status(200).json(follower);
    }
    res.status(200).json([]);
}

const unFollowUser = async (req, res) => {
    const { _id } = req.user;
    const { followingId } = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(followingId)) {
        return res.status(400).json({message: 'No Such User'});
    }

    const currentUser = await User.findById(_id);
    const temp = [...currentUser.following];
    const index = temp.indexOf(followingId);
    if(index > -1) {
        temp.splice(index, 1);
    } else {
        
        return res.status(400).json({error: "Something went wrong"});
    }
    const user1 = await User.findByIdAndUpdate({_id}, {
        following: [...temp]
    })

    const followingUser = await User.findById(followingId);
    const temp1 = [...followingUser.followers];
    const index1 = temp1.indexOf(_id.toString());
    if(index1 > -1) {
        temp1.splice(index1, 1);
    } else {
        return res.status(400).json({error: "Something went wrong"});
    }
    const followingUser1 = await User.findByIdAndUpdate({_id: followingId}, {
        followers: [...temp1]
    })

    res.status(200).json({message: `You Unfollowed ${followingUser.userName} successfully`});

}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getUsers,
    getSingleUser,
    addFollowing,
    getFollowingDetails,
    getFollowersDeatils,
    unFollowUser
}