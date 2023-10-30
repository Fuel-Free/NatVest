const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    Email : {
        type :String
    },
    City :{
        type :String
    },
    PhoneNo : {
        type : Number
    },
    UserName : {
        type : String
    },
    Password : {
        type : String,
    },
    Token : {
        type : String
    }

})

AdminSchema.set('timestamps', true)

module.exports =  mongoose.model('admin', AdminSchema)