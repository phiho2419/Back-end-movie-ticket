const jwt = require("jsonwebtoken");
const { RESPONSE_CODE, SECRETKEY_TOKEN } = require("../constants");
const { getTimeStampSecond } = require("../utils/date");


const authenticate = (req, res, next) => {
    try {
        const token = req.header("token");

        const decode = jwt.verify(token, SECRETKEY_TOKEN);
        if (decode.exp < getTimeStampSecond) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("Token is expired")
        }

        const { id, taiKhoan, maLoaiNguoiDung } = decode;

        req.user = { id, taiKhoan, maLoaiNguoiDung };

        next()

    } catch (error) {
        res.status(RESPONSE_CODE.BAD_REQUEST).send("Invalid token")
    }
}

const authorize = (...arrRole) => (req, res, next) => {
    const role = req.user.maLoaiNguoiDung;

    const index = arrRole.findIndex(_role => _role === role)
    if (index === -1) {
        return res.status(RESPONSE_CODE.FORBIDDEN).send("FORBIDDEN")
    }
    else {
        next()
    }
}

module.exports = {
    authenticate,
    authorize
}