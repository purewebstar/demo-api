'use strict'
/*
importing modules
*/

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const geo = async()=>{
    return(
        await axios.get('https://geolocation-db.com/json').then(res=>{
       return{
           country: res.data.country_name,
           city: res.data.city
       }
    }).catch(err=>{
        console.log(err.message)
    })
    )
}

const signUp = async (req, res)=>{
    const {email, password, name} = req.body;

    if(name==='' || name===null){
        return res.status(400).json({message: 'Input required!' ,status: false})
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.findOne({email: email}, {returnOriginal: true});
    if(!result){
        let g = await geo();
        const country = g.country;
        const city = g.city;
        const newUser = new User({
            name: name,
            email: email,
            email: email,
            country: country,
            city: city,
            password: hashedPassword
        });
        await newUser.save({new:true}, async(err,success)=>{
            if(err) return res.status(400).json({message: err.message})
            else if(success){
                return res.status(201).json({ userID: success._id, status:true});
            }
        })
    }
    else if(result) return res.status(409).json({message: 'User exist!', status:false});
}

const login = async (req, res)=>{
    const {email, password} = req.body;

    const result = await User.findOne({email: email}, {returnOriginal: false});
    if(result){
     const isMatch = await bcrypt.compare(password, result.password);
      if(isMatch){
          const user_id = result._id;
          const payload = {user_id: user_id};
          const accessToken = jwt.sign({payload}, process.env.SECRET_KEY, {expiresIn: '30m'});
          const refreshToken = jwt.sign({payload}, process.env.SECRET_KEY, {expiresIn: '3d'});
          const profile = {};
          profile.name = result.name;
          profile.country= result.country;
          profile.city = result.city;
          profile.email = result.email;
          profile.verify = result.verify;
          return res.status(200).json({profile: profile, accessToken: accessToken, refreshToken: refreshToken, status:true});
      }
      else return res.status(404).json({message: "password incorrect!", status:false})
    }
    else if(!result){
       return res.status(404).json({message: 'User not found!', status:false})
    }
}

const updateProfile = async(req, res)=>{
    const {name, email} = req.body;   
    const user_id = req.user.payload.user_id;
    await User.findByIdAndUpdate({_id: user_id}, {
        name: name,
        email: email
    },{new:true}, (err, user)=>{
        if(err) return res.status(400).json({message: err.message, status:false})
        else if(!user) return res.status(404).json({message: "Not Found!", status:false})
        else {
            const profile = {};
            profile.name = user.name;
            profile.email = user.email;
            profile.verify = user.verify;
            return res.status(200).json({profile: profile,message: 'Profile Updated!',status:true})
        }
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
            profile.country = user.country;
            profile.city = user.city;
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
    updateProfile,
    readProfile,
    resetPassword,
}