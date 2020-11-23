const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        require: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        require: true
    },
    hashed_password: {
        type: String,
        trim: true,
        require: true
    },
    salt: String,
    role: {
        type: String,
        default: "Normal",
        //We have more type (normal, admin .....)
    },
    resetPasswordLink: {
        data: String,
        default: ''
    }
},
    { timeStamp: true})

    //Virtual password
    userSchema.virtual('password')
        .set(function (password) {
            //set password note you must use normal function not an arrow function
            this.password = password
            this.salt = this.makeSalt()
            this.hashed_password = this.encryptPassword(password)
        })
        .get(function () {
            return this._password
        })

        //methods
        userSchema.methods = {
            //Generate salt
            makeSalt: function() {
                return Math.round(new Date().valueOf() * Math.random()) + ''
            },
            encryptPassword: function(password) {
                if(!password) return ''
                try {
                    return crypto.createHmac('sha1', this.salt)
                    .update(password)
                    .digest('hex')
                } catch (err) {
                    return ''

                }
            },
            //Compare password between plain get from user and hashed
            authenticate: function(plainPassword) {
                return this.encryptPassword(plainPassword) === this.hashed_password
            }
        }

        module.exports = mongoose.model('User', userSchema);

