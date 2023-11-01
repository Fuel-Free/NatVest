const express = require('express')
const router = express.Router()
const VendorController = require('../../Controllers/VendorControllers/AddProduct')
const { upload } = require('../../Midlewares/imageStorage')

router.post('/create/:id', upload.fields([{ name: 'ProductImage', maxCount: 10 }]), VendorController.AddProduct)
router.get('/list',  VendorController.ProductList)
router.patch('/update/:id',  VendorController.ProductUpdate)

module.exports = router