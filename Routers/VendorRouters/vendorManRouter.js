const express = require('express')
const router = express.Router()
const ProductRouter = require('./VendorAddProduct')
const VendorRouter = require('./vendorRouter')

router.use('/', VendorRouter)
router.use('/product', ProductRouter)

module.exports = router