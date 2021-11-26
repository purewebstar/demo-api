'use strict'
/*
importing modules
*/

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendMail = require('../config/initMailer.js');
const jwt = require('jsonwebtoken');

const signUp = async (req, res)=>{
    const {email, password, name} = req.body;
    if(name==='' || name===null){
        return res.status(400).json({message: 'Input required!' ,status: false})
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.findOne({email: email}, {returnOriginal: true});
    if(!result){
        const newUser = new User({
            name: name,
            email: email,
            email: email,
            password: hashedPassword
        });
        await newUser.save({new:true}, async(err,success)=>{
            if(err) return res.status(400).json({message: err.message})
            else if(success){
                // if success fully user registered
                const payload = {
                    user_id: success._id,
                    email: email
                }
                const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '7d'})

                const from= `${process.env.SECRET_SITE_EMAIL}`,
                    to = email,
                    subject= 'Verify your Account',
                    text= '',
                    html = `<a href='${process.env.SITE_HOST}/api/auth/verify-email/${token}' target='_blank' '>Verify Your Account</a>`
                
                // sending verification to user email
                sendMail(from, to,subject, text, html)      
                return res.status(201).json({message: "verify your email!"})
            }
        })
    }
    else if(result) return res.status(401).json({message: 'User exist!', status:false});
}

const login = async (req, res)=>{
    const {email, password} = req.body;

    const result = await User.findOne({email: email}, {returnOriginal: false});
    if(result){
     const isMatch = await bcrypt.compare(password, result.password);
      if(isMatch){
          const user_id = result._id;
          const payload = {user_id: user_id};
          const accessToken = jwt.sign({payload}, process.env.SECRET_KEY, {expiresIn: '2m'});
          const refreshToken = jwt.sign({payload}, process.env.SECRET_KEY, {expiresIn: '3d'});
          return res.status(200).json({accessToken: accessToken, refreshToken: refreshToken, status:true});
      }
      else return res.status(404).json({message: "password incorrect!", status:false})
    }
    else if(!result){
       return res.status(404).json({message: 'User not found!', status:false})
    }
}

const updateName = async(req, res)=>{
    const user_id = req.user.payload.user_id;
    const {name} = req.body;
    await User.findOneAndUpdate({_id: user_id}, {name: name}, (err, user)=>{
        if(err) return res.status(400).json({message: err.message, status:false})
        else if(!user) return res.status(404).json({message: "Not Found!", status:false})
        else return res.status(200).json({message: 'Name updated!',status:true})
    });
}

const updateProfile = async(req, res)=>{
    const {birthday, gender} = req.body;
    const user_id = req.user.payload.user_id;
    await User.findByIdAndUpdate({_id: user_id}, {
        birthday: birthday,
        gender: gender
    }, (err, user)=>{
        if(err) return res.status(400).json({message: err.message, status:false})
        else if(!user) return res.status(404).json({message: "Not Found!", status:false})
        else return res.status(200).json({message: 'Profile Updated!',status:true})
    });
}

const readProfile = async(req, res)=>{
    const user_id = req.user.payload.user_id;
    await User.findOne({_id: user_id},function(err, user){
        if(err) return res.status(400).json({message: err.message, status:false})
        else if(!user) return res.status(404).json({message: "Not Found!", status:false})
        else {
            const profile = {};
            profile.name = user.name;
            profile.birthday = user.birthday;
            profile.gender = user.gender;
            profile.email = user.email;
            profile.verify = user.verify;
            return res.status(200).json({profile: profile,status:true})
        }
    })
}

const resetPassword = async(req, res)=>{
    const newPassword = req.body.newPassword;
    const user_id = req.user.payload.user_id;
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    await User.findOneAndUpdate({_id: user_id}, {
        password: encryptedPassword
        }, {new:true}, (err, user) =>{
        if(err) return res.status(400).json({message: err.message})
        else if(user){
        return res.status(201).json({message: 'success'})
        }
        else return res.status(401).json({message: 'unable to change password!'})
    })
}

module.exports = {
    signUp, login,
    updateName,
    updateProfile,
    readProfile,
    resetPassword,
}