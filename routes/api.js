'use strict'
/*
 importing modules
*/
const express = require('express');
const passport = require('passport');
const {signUp, login, updateName, updateProfile ,readProfile, resetPassword} = require('../controllers/User.controller.js');
const {refreshToken, renewAccessToken, verifyEmail} = require('../controllers/Auth.controller.js');

const router = express();

router.post('/login', login);
router.post('/signup', signUp);
router.patch('/update-name', passport.authenticate('jwt', {session:false}) ,updateName);
router.patch('/update-profile', passport.authenticate('jwt', {session:false}) ,updateProfile);
router.get('/read-profile', passport.authenticate('jwt', {session:false}), readProfile);
router.patch('/reset-password', passport.authenticate('jwt', {session:false}),resetPassword);


router.post('/auth/verify-email/:token', verifyEmail);
router.post('/auth/refresh-token', refreshToken);
router.put('/auth/renew-access-token', renewAccessToken);


module.exports = router;