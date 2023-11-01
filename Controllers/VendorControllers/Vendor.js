const VendorSchema = require("../../Models/VendorSchema/VendorSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailService = require('../../Midlewares/EmailService')

const VendorRegister = async (req, res) => {
  try {
    const { Email, UserName, Password, confirmPassword } = req.body;
    const vendorExistsWithEmail = await VendorSchema.findOne({
      Email: Email.toLowerCase(),
    });
    const vednorExistsWithName = await VendorSchema.findOne({
      UserName: UserName.toLowerCase(),
    });
    if (vendorExistsWithEmail) {
      res.status(409).json({
        success: "Exist",
        message: "Vendor Alredy Exist With Email",
      });
    } else if (vednorExistsWithName) {
      res.status(409).json({
        success: "Exist",
        message: "Vendor Alredy Exist With Name",
      });
    } else {
      if (confirmPassword == Password) {
        const newVendor = new VendorSchema(req.body);
        const salt = await bcrypt.genSalt(10);
        newVendor.Password = await bcrypt.hashSync(req.body.Password, salt);
        newVendor.UserName = UserName.toLowerCase();
        newVendor.Email = Email.toLowerCase();
        const result = await newVendor.save();
        res.status(200).json({
          success: "Success",
          message: result,
        });
      } else {
        res.status(409).json({
          message: "Passwords do not match",
        });
      }
    }
  } catch (error) {
    res.status(401).json({
      success: "Error",
      error: error.message,
    });
  }
};

const VendorLogin = async (req, res) => {
  try {
    const { UserName, Password } = req.body;
    const UserFind = await VendorSchema.findOne({
      UserName: UserName.toLowerCase(),
    });
    if (UserFind) {
      const isMatched = await bcrypt.compareSync(Password, UserFind.Password);
      if (!isMatched) {
        res.status(401).json({
          success: 401,
          message: "Not Match Password",
        });
      } else {
        const token = jwt.sign(
          { _id: UserFind._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        UserFind.Token = token;
       const VendorLogIn =  await UserFind.save();
        res.status(200).json({
          success: "OK",
          token : token,
          data: VendorLogIn
        });
      }
    } else {
      res.status(409).json({
        success: "Not Found",
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(401).json({
      success: "Error",
      error: error.message,
    });
  }
};


const VendorList = async(req, res) => {
    try {
        const VendorList = await VendorSchema.find().sort({ "createdAt": -1 })
        res.status(200).json({
            success : "success",
            messate : "Vendor List",
            Count : VendorList.length,
            List : VendorList
        })
    } catch (error) {
        res.status(409).json({
            success : 'Error',
            message : error.message
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
      const { Email } = req.body;
      const Vendor = await VendorSchema.findOne({ Email: Email.toLowerCase() });
      if (Vendor) {
        const secret = Vendor._id + process.env.SECRET_KEY;
        const token = jwt.sign({ userID: Vendor._id }, secret, { expiresIn: "5m" });
        const link = `http://localhost:1919/Vendor/reset-password/${Vendor._id}/${token}`;
        await mailService.sendMail(Email,   'Reset Password',
        `Click Here And Change Password ${link}`)
  
        res.status(200).send({
          status: "success",
          message: "Password Reset Email sent..plzz /check your email",
          link: link,
          id : Vendor._id,
          token : token
        })
      } else {
        res.status(401).send({
          status: "failed",
          message: "Vendor not found",
        })
      }
    } catch (error) {
      res.status(400).json({
        success: "Error",
        error: error.message,
      });
    }
  };
  
  const resetPassword = async (req, res) => {
    const { Password, confirmPassword } = req.body;
    const { id, token } = req.params;
    const Vendor = await VendorSchema.findById(id);
    const new_secret = Vendor._id + process.env.SECRET_KEY;
    try {
      jwt.verify(token, new_secret);
      if ((Password, confirmPassword)) {
        if (Password !== confirmPassword) {
          res.status(401).json({
            STATUS: "FAILED",
            message: "verify Password",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const new_Password = await bcrypt.hash(Password, salt);
          const createPassword = await VendorSchema.findByIdAndUpdate(Vendor.id, {
            $set: { Password: new_Password },
          })
          res.status(200).json({
            status: " success",
            message: "Password reset successful",
          });
        }
  
      } else {
        res.status(400).send({
          status: "failed",
          message: "Password and confirmPassword are required",
        });
      }
    } catch (error) {
      res.status(400).json({
        success: "Error",
        error: error.message,
      })
    }
  }
  
  
  
  const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { id } = req.params;
    const Vendor = await VendorSchema.findById(id);
    try {
      const isMatch = await bcrypt.compare(oldPassword, Vendor.Password);
      if (isMatch) {
        if(oldPassword !== newPassword) {
          if (newPassword !== confirmPassword) {
            res.status(401).json({
              STATUS: "FAILED",
              message: "Your Passowrd Does Not Match. Enter New Password Again Here.",
            });
          } else {
            const salt = await bcrypt.genSalt(10);
            const new_Password = await bcrypt.hash(newPassword, salt);
            const createPassword = await VendorSchema.findByIdAndUpdate(Vendor.id, {
              $set: { Password: new_Password },
            })
            res.status(200).json({
              status: " success",
              message: "Password Change successful",
            });
          }
        } else {
          res.status(400).send({
            status: "failed",
            message: "New Password Must Be Different From Current Password",
          })
        }
      } else {
        res.status(400).send({
          status: "failed",
          error: "Your Old Password Was Entered Incorrectly. Please Enter It Again."
        })
      }
    } catch (error) {
      res.status(400).json({
        success: "Error",
        error: error.message,
      })
    }
  }

  
  const ProfileUpdate = async (req, res) => {
    try {
      
        const ProfileUpdates = await VendorSchema.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );
        await ProfileUpdates.save();
      res.status(200).json({
        success: "success",
        message: "Profile Successful",
        Update: ProfileUpdates,
      });
    } catch (error) {
      res.status(400).json({
        success: "error",
        error: error.message,
      });
    }
  };

module.exports = { VendorRegister , VendorLogin , forgotPassword , resetPassword , changePassword , VendorList , ProfileUpdate };
