const jwt = require("jsonwebtoken");
const user = require("../Models/UserSchema/userSchema");

const checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await user.findById(userID).select("-Otp");
      next();
    } catch (err) {
      res.status(400).json({
        success: "failure",
        message: "Unautorized user",
        error: err.message,
      });
    }
  }
  if (!token) {
    res.status(500).json({
      success: "failure",
      message: "Unauthorized user No token",
    });
  }
};

module.exports = { checkUserAuth };
