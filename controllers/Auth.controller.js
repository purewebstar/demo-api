'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const refreshToken = async (req, res)=>{
    const refreshToken = req.body.token;
    if(!refreshToken) return res.status(403).json({message: 'Forbidden', status: false});
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY, (err, success)=>{
        if(err) return res.status(500).json({message: err.message});
        else if(success){
            return res.status(200).json({message: 'Authorized',status:true});
        }
    });
}

const renewAccessToken = async (req, res)=>{
    const refreshToken = req.body.refreshToken;
    if(!refreshToken) return res.status(401).json({message: 'Unauthorized', status: false});
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    const result = await User.findById({_id: decoded.payload.user_id}, {new:true});
    const payload = {user_id: result._id};
    const accessToken = jwt.sign({payload}, process.env.SECRET_KEY, {expiresIn: '2m'});
    return res.status(201).json({accessToken: accessToken, status:true});
}

const verifyEmail = async (req, res)=>{
    const refreshToken = req.params.token;
    if(!refreshToken) return res.status(403).json({message: 'Forbidden', status: false});
    var error = null;
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    const user_id = decoded.payload.user_id;
    await User.findOneAndUpdate({_id: user_id},{verify: true},{new:true}, (err,user)=>{
        if(err) return res.status(403).json({msg: "verification expired!"})
        else return res.status(200).json({message: 'User Verified Via Email!', status: true});
    }) 
}


module.exports = {
    refreshToken,
    renewAccessToken,
    verifyEmail,
}