const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    MobileNo : {
        type :Number
    },
    Otp : {
        type : Number,
    }
})

UserSchema.set('timestamps')
module.exports =  mongoose.model('user',UserSchema)