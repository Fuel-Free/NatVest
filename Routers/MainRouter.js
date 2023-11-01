const express = require('express')
const router = express.Router()
const userRouter = require('./UserRouters/UserRouter')
const adminRouter = require('./AdminRouters/adminRouter')
const vendorRouter = require('./VendorRouters/vendorManRouter')

router.use('/user', userRouter)
router.use('/admin', adminRouter)
router.use('/vendor', vendorRouter)

module.exports =  router