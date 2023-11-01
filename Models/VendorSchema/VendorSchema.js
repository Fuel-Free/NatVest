const mongoose = require('mongoose')

const VendorSchema = new mongoose.Schema({
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

VendorSchema.set('timestamps', true)

module.exports =  mongoose.model('Vendor', VendorSchema)