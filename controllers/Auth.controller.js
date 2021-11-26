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
    const refreshToken = req.body.token;
    if(!refreshToken) return res.status(401).json({message: 'Unauthorized', status: false});
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    const result = await User.findById({_id: decoded.payload.user_id}, {new:true});
    const payload = {user_id: result._id};
    const accessToken = jwt.sign({payload}, process.env.SECRET_KEY, {expiresIn: '2m'});
    return res.status(201).json({accessToken: accessToken, status:true});
}

const verifyEmail = async (req, res)=>{

    const token = req.params.token
    // verifying user token
    jwt.verify(token, process.env.SECRET_KEY, async function(err, tokenPayload){
       if(err) return res.status(403).json({msg: "token expired"})
          if(err) return res.sendStatus(403)
          // update user
          try{
             await User.findOneAndUpdate({_id: tokenPayload.User_id},{verify: true},{new:true}, (err,user)=>{
             if(err) return res.status(403).json({msg: "verification expired!"})
             // next
              req.user_id = user._id
              return res.status(200).json({message: 'User Verified Via Email!', status: true});
             })     
          }catch(err){
             return res.status(400).json({message: err.message, status:false});
       }         
    })
}


module.exports = {
    refreshToken,
    renewAccessToken,
    verifyEmail,
}