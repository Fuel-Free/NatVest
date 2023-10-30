const UserSchema = require('../../Models/UserSchema/userSchema')
const bcrypt = require('bcrypt')

const loginWithOtp = async(req, res) => {
    const { MobileNo } = req.body
    try {
        const userExists = await UserSchema.findOne({MobileNo : MobileNo})
        if(userExists){
            res.status(409).json({
                success : 'Exist',
                message : "User Alredy Exist This Number",
            })
        } else {
            const userData = new UserSchema(req.body)
                var NewOtp = await Math.floor(100000 + Math.random() * 9000).toString();
                userData.Otp = NewOtp
            const result = await userData.save()
            res.status(200).json({
                success : 'Success',
                message : result
            })
        }
    } catch (error) {
        res.status(401).json({
            success : "Error",
            message : error.message
        })
    }
}

module.exports = { loginWithOtp }