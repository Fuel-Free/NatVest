const AdminSchema = require("../../Models/AdminSchema/adminSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailService = require('../../Midlewares/EmailService')

const adminRegister = async (req, res) => {
  try {
    const { Email, UserName, Password, confirmPassword } = req.body;
    const adminExistsWithEmail = await AdminSchema.findOne({
      Email: Email.toLowerCase(),
    });
    const adminExistsWithName = await AdminSchema.findOne({
      UserName: UserName.toLowerCase(),
    });
    if (adminExistsWithEmail) {
      res.status(409).json({
        success: "Exist",
        message: "Admin Alredy Exist With Email",
      });
    } else if (adminExistsWithName) {
      res.status(409).json({
        success: "Exist",
        message: "Admin Alredy Exist With Name",
      });
    } else {
      if (confirmPassword == Password) {
        const newAdmin = new AdminSchema(req.body);
        const salt = await bcrypt.genSalt(10);
        newAdmin.Password = await bcrypt.hashSync(req.body.Password, salt);
        newAdmin.UserName = UserName.toLowerCase();
        newAdmin.Email = Email.toLowerCase();
        const result = await newAdmin.save();
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

const AdminLogin = async (req, res) => {
  try {
    const { UserName, Password } = req.body;
    const UserFind = await AdminSchema.findOne({
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
       const AdminLogIn =  await UserFind.save();
        res.status(200).json({
          success: "OK",
          token : token,
          data: AdminLogIn
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


const AdminList = async(req, res) => {
    try {
        const adminList = await AdminSchema.find().sort({ "createdAt": -1 })
        res.status(200).json({
            success : "success",
            messate : "Admin List",
            Count : adminList.length,
            List : adminList
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
      const Admin = await AdminSchema.findOne({ Email: Email.toLowerCase() });
      if (Admin) {
        const secret = Admin._id + process.env.SECRET_KEY;
        const token = jwt.sign({ userID: Admin._id }, secret, { expiresIn: "5m" });
        const link = `http://localhost:1919/admin/reset-password/${Admin._id}/${token}`;
        await mailService.sendMail(Email,   'Reset PIN',
        `Click Here And Change PIN ${link}`)
  
        res.status(200).send({
          status: "success",
          message: "PIN Reset Email sent..plzz /check your email",
          link: link,
          id : Admin._id,
          token : token
        })
      } else {
        res.status(401).send({
          status: "failed",
          message: "Admin not found",
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
    const Admin = await AdminSchema.findById(id);
    const new_secret = Admin._id + process.env.SECRET_KEY;
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
          const createPassword = await AdminSchema.findByIdAndUpdate(Admin.id, {
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
    const Admin = await AdminSchema.findById(id);
    try {
      const isMatch = await bcrypt.compare(oldPassword, Admin.Password);
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
            const createPassword = await AdminSchema.findByIdAndUpdate(Admin.id, {
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

  
module.exports = { adminRegister , AdminLogin , forgotPassword , resetPassword , changePassword , AdminList };
