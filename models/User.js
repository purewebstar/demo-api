'use strict'
/**
 * importing modules
 */
const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
   name: String,
   email: {
       type: String,
       require: true
   },
   password: {
       type: String,
       require: true
   },
   country: String,
   city: String,
   birthday: String,
   gender: String,
   verify: {
       type: Boolean,
       default: false
   },

},{
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema);
