const express = require('express')
const router = express.Router()
const VendorController = require('../../Controllers/VendorControllers/Vendor')
const { upload } = require('../../Midlewares/imageStorage')

router.post('/Register',VendorController.VendorRegister )
router.post('/Login',VendorController.VendorLogin )
router.patch('/ProfileUpdate/:id',VendorController.ProfileUpdate )
router.get('/vendorList',VendorController.VendorList )
router.post('/ForgotPassword',VendorController.forgotPassword )
router.post('/ResetPassword/:id/:token',VendorController.resetPassword )
router.post('/changePassword/:id',VendorController.changePassword )

module.exports = router
