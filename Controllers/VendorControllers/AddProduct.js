const ProductSchema = require("../../Models/VendorSchema/AddProductSchema");

const AddProduct = async (req, res) => {
  try {
    const vendorID = req.params.id;
    console.log(vendorID);
    const productData = new ProductSchema(req.body);
    const { ProductImage } = req.files;
    if (ProductImage) {
      const filepath = ProductImage.map(
        ({ filename }) => `/uploads/${filename}`
      );
      productData.ProductImage = filepath;
    }
    productData.VendorID = vendorID;
    const productResult = await productData.save();
    res.status(200).json({
      success: "Success",
      message: "Successfully added the product",
      Product: productResult,
    });
  } catch (error) {
    res.status(500).json({
      success: "error",
      message: error.message,
    });
  }
};

const ProductList = async (req, res) => {
  try {
    const result = await ProductSchema.find().sort({createdAt : -1})
    res.status(200).json({
      success : "Success",
      message :"Product List", 
      Count : result.length,
      List :result
    })
  } catch (error) {
    res.status(400).json({
      success :"error",
      message : error.message
    })
  }
};


const ProductUpdate = async(req, res) => {
  try {
    const UpdateData = await ProductSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new : true,
        runValidators:true
      }
    )
    const UpdateResult = await UpdateData.save()
    res.status(200).json({
      success : "success",
      message : "Update Product Successful",
      Update : UpdateResult
    })
  } catch (error) {
    res.status(400).json({
      success :"error",
      message : error.message
    })
  }
}

module.exports = { AddProduct , ProductList , ProductUpdate };
