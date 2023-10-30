const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "fuelfreeind@gmail.com",
    pass: "fshcwhxtpbbqvrtx",
  }
});

exports.sendMail = function(to, subject, text) {
  const mailOptions = {
    from: 'fuelfreeind@gmail.com',
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
};
