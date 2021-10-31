const express = require("express");
const { movieRouter } = require("./movie.router");
const { userRouter } = require("./user.router");
const rootRouter = express.Router();

rootRouter.use("/quanLyNguoiDung", userRouter);
rootRouter.use("/quanLyPhim", movieRouter);

module.exports = {
    rootRouter,
}
