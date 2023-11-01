const mongoose = require('mongoose');

const AddProductSchema = new mongoose.Schema({
  ProductName: {
    type: String,
  },

  ProductImage: {
    type: [String],
  },

  Price: {
    type: Number,
  },

  Description: {
    type: String,
  },

  City : {
    type : String
  },

  Category: {
    type: String,
  },
  VendorID : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  }
})

AddProductSchema.set("timestamps", true)

module.exports = mongoose.model('Product', AddProductSchema)

