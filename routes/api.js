'use strict'
/*
 importing modules
*/
const express = require('express');
const passport = require('passport');
const {signUp, login, updateProfile ,readProfile, resetPassword} = require('../controllers/User.controller.js');
const {refreshToken, renewAccessToken, verifyUser} = require('../controllers/Auth.controller.js');

const router = express();

router.post('/login', login);
router.post('/signup', signUp);
router.post('/update-profile', passport.authenticate('jwt', {session:false}) ,updateProfile);
router.get('/read-profile', passport.authenticate('jwt', {session:false}), readProfile);
router.patch('/reset-password', passport.authenticate('jwt', {session:false}),resetPassword);


router.post('/users/confirm/:id', verifyUser);
router.post('/auth/refresh-token', refreshToken);
router.post('/auth/renew-access-token', renewAccessToken);


module.exports = router;