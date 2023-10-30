const express = require('express')
const router = express.Router()
const UserController = require('../../Controllers/UserControllers/UserController')

router.post('/', UserController.loginWithOtp)

module.exports = router