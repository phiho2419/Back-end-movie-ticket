const multer = require("multer");
const { getTimeStampMilliSecond } = require("../utils/date");

const uploadMovieImageMiddleware = () => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          // google storage, aws s3
          cb(null, "./public/images/poster");
        },
        filename: (req, file, cb) => {
          cb(null, `${getTimeStampMilliSecond()}_${file.originalname}`);
        },
      });
    
      const upload = multer({ storage });
      return upload.single("poster");
}

module.exports = { 
    uploadMovieImageMiddleware
}