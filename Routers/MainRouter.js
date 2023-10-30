const express = require('express')
const router = express.Router()
const userRouter = require('./UserRouters/UserRouter')
const adminRouter = require('./AdminRouters/adminRouter')

router.use('/user', userRouter)
router.use('/admin', adminRouter)

module.exports =  router