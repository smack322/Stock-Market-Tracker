const User = require('../models/auth.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { Oauth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { va } = require('express-validation');
const jwt = require('jsonwebtoken');
//Custom error handler to get useful error from database errors
const {errorHandler} = require('../helpers/dbErrorHandling')
//I will use for send email sendgrid you can use nodemail also
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAIL_KEY)
exports.registerController = (req, res) => {
    // const name = req.body;
    // const email = req.body;
    // const password = req.body;
    const {name, email, password} = req.body;
    console.log(name, email, password);
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        User.findOne({
            email
        }).exec((err, user) => {
            //if the user already exists
            if(user) {
                return res.status(400).json({
                    error: 'Email is taken'
                })
            }
        })
        // Generate Token
        const token = jwt.sign(
            {
                name,
                email,
                password
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: '15m'
            }
        )
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: to,
            subject: 'Account activation link',
            html: `
            <h1>Please click the link to activate </h1>
            <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
            <hr/>
            <p>This email contains sensitive info</p>
            <p>${process.env.CLIENT_URL}</p>`
        }
    }
        sgMail.send(emailData).then(sent => {
            return res.json({
                message: `Email has been sent to ${email}`
            }).catch(err => {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            })
        })
    // res.json({
    //     success: true,
    //     message: 'Register route'
    // })
}