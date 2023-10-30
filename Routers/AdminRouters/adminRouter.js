const express = require('express')
const router = express.Router()
const AdminController = require('../../Controllers/AdminControllers/admin')

router.post('/Register', AdminController.adminRegister)
router.post('/Login', AdminController.AdminLogin)
router.get('/AdminList', AdminController.AdminList)
router.post('/ForgotPassword', AdminController.forgotPassword)
router.post('/ResetPassword/:id/:token', AdminController.resetPassword)
// router.post('/changePassword/:id', AdminController.changePassword)

module.exports = router