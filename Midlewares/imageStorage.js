const multer = require("multer");
const path = require("path");

const imageConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "..", "/uploads"));
  },
  filename: (req, file, callback) => {
    var ext = file.originalname.substring(file.originalname.indexOf("."));
    // callback(null, `image_${Date.now()}.${file.originalname}`);
    callback(null, `image_${Date.now()}.${file.originalname}`);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image") || file.mimetype === 'application/pdf') {
    callback(null, true);
  } else {
    callback(new Error("Only images and PDF are allowed"));
  }
};

// const isPDF = function (req, file, cb) {
//   if (file.mimetype === 'application/pdf') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only PDF files are allowed.'), false);
//   }
// };

const upload = multer({
  storage: imageConfig,
  fileFilter: isImage,
});

module.exports = { upload };