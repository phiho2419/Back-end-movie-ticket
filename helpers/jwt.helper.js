const jwt = require("jsonwebtoken");
const { SECRETKEY_TOKEN } = require("../constants");




const generateToken = (user) => {
  const payload = {
    id: user.id,
    taiKhoan: user.taiKhoan,
    maLoaiNguoiDung: user.maLoaiNguoiDung,
  };


  const token = jwt.sign(payload, SECRETKEY_TOKEN, {
    expiresIn: "24h", // 1 ngay co 86400s
  });

  return token;
};



module.exports = {
  generateToken,
};
