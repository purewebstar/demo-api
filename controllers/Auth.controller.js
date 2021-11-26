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
    const refreshToken= req.body.refreshToken;
    if(!refreshToken) return res.status(401).json({message: 'Unauthorized', status: false});
    jwt.verify(refreshToken, process.env.SECRET_KEY, (err, success)=>{
        if(err) return res.status(500).json({message: err.message});
        else if(success){
            const payload = {user_id: success.payload.user_id};
            const accessToken = jwt.sign({payload}, process.env.SECRET_KEY, {expiresIn: '30m'});
            return res.status(201).json({accessToken: accessToken, status:true});
        }
    });
   
}

const verifyUser = async (req, res)=>{
    const user_id = req.params.id;
    await User.findByIdAndUpdate({_id: user_id},{$set:{
        verify: true
    }},{new:true}, (err,user)=>{
        if(err) return res.status(403).json({message: "verification expired!"})
        else if(user)  return res.status(200).json({ message: 'success',status:true});
    }) 
}

module.exports = {
    refreshToken,
    renewAccessToken,
    verifyUser,
}