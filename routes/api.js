'use strict'
/*
 importing modules
*/
const express = require('express');
const passport = require('passport');
const {signUp, login, updateName, updateProfile} = require('../controllers/User.controller.js');
const {refreshToken, renewAccessToken, verifyEmail} = require('../controllers/Auth.controller.js');

const router = express();

router.post('/login', login);
router.post('/signup', signUp);
router.post('/auth/verify-email', verifyEmail);
router.patch('/update-name', passport.authenticate('jwt', {session:false}) ,updateName);
router.patch('/update-profile', passport.authenticate('jwt', {session:false}) ,updateProfile);

router.post('/auth/refresh-token', refreshToken);
router.put('/auth/renew-access-token', renewAccessToken);


module.exports = router;