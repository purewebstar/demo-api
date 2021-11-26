'use strict'
/**
 *  Module Dependencies
 */
const nodemailer = require('nodemailer');


const sendMail = async function (from, to, subject, text, html){
    
    // Creating default SMTP transport method
    let transporter = nodemailer.createTransport({

        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: `${process.env.SECRET_SITE_EMAIL}`,
            pass: `${process.env.SECRET_SITE_EMAIL_PASSWORD}`
        }
    });
    //console.log(process.env.SECRET_SITE_EMAIL)
    // sending mail
    let info = await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html,
    });
}
 
module.exports = sendMail;