const express = require("express");
const bcryptjs = require("bcryptjs");
const { RESPONSE_CODE } = require("../constants");
const userController = require("../controllers/user.controller");
const { validateEmail } = require("../utils/validation");
const { generateToken } = require("../helpers/jwt.helper");
const { authenticate, authorize } = require("../middlewares/verify-token.middleware");

const userRouter = express.Router();

userRouter.post('/dangKi', async (req, res) => {
    try {
        const { taiKhoan, matKhau, email, hoTen, soDienThoai, maLoaiNguoiDung } = req.body;

        if (!taiKhoan || !matKhau || !hoTen || !email || !soDienThoai || !maLoaiNguoiDung || !taiKhoan.trim() || !matKhau.trim() || !hoTen.trim() || !email.trim() || !soDienThoai.trim() || !maLoaiNguoiDung.trim()) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("Cần đầy đủ thông tin để thực hiện đăng kí")
        }

        const checkUserExist = await userController.getUserByAccount(taiKhoan);
        if (checkUserExist) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("Tài khoản đã tồn tại")
        }

        const checkEmail = validateEmail(email);
        if (!checkEmail) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("Email chưa đúng định dạng")
        }


        const salt = bcryptjs.genSaltSync();
        const hasPassword = bcryptjs.hashSync(matKhau, salt);

        const newUser = { taiKhoan, email, hoTen, soDienThoai, matKhau: hasPassword, maLoaiNguoiDung };
        const user = await userController.createUser(newUser);
        res.status(RESPONSE_CODE.CREATED).send(user)
    } catch (error) {
        res.status(RESPONSE_CODE.BAD_REQUEST).send(error)
    }
})

// Lấy danh sách người dùng
userRouter.get('/LayDanhSachNguoiDung', async (req, res) => {
    try {
        const userData = await userController.getUserList();
        res.status(200).send(userData)
    } catch (error) {
        res.status(500).send(error)
    }
})

userRouter.get('/timKiemNguoiDung/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userController.getUserById(id);
        if (!user) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("ID IS NOT EXIST !")
        }
        else {
            return res.status(RESPONSE_CODE.OK).send(user)
        }
    } catch (error) {
        res.status(RESPONSE_CODE.BAD_REQUEST).send(error)
    }
})

//Cập nhật thông tin người dùng
userRouter.put('/capNhatThongTinNguoiDung/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const dataUpdate = req.body;
        const user = await userController.getUserById(id);
        if (!user) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("ID IS NOT EXIST")
        } else {
            await userController.updateUserById(id, dataUpdate);
            return res.status(RESPONSE_CODE.OK).send(`ID ${id} UPDATED`);
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

userRouter.delete('/:id', authenticate, authorize("ADMIN", "QUANLY"), async (req, res) => {
    try {
        const id = req.params.id;
        await userController.deleteUserById(id);
        res.status(200).send(`DELETED ID ${id}`)
    } catch (error) {
        res.status(500).send(error)
    }
})

userRouter.post('/DangNhap', async (req, res) => {
    try {
        const { taiKhoan, matKhau } = req.body;

        if (!taiKhoan || !matKhau || !taiKhoan.trim() || !matKhau.trim()) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("Account and password are required !")
        }

        const user = await userController.getUserByAccount(taiKhoan);
        if (!user) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("Account is not exist !")
        }

        const isAuth = bcryptjs.compareSync(matKhau, user.matKhau);
        if (!isAuth) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("Password is not match !")
        }

        const token = generateToken(user)
        return res.status(RESPONSE_CODE.OK).send({ user, token })

    } catch (error) {

    }
})





module.exports = {
    userRouter
}