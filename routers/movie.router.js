const express = require("express");
const bcryptjs = require("bcryptjs");
const { RESPONSE_CODE, DOMAIN } = require("../constants");
const { validateEmail } = require("../utils/validation");
const { generateToken } = require("../helpers/jwt.helper");
const { authenticate, authorize } = require("../middlewares/verify-token.middleware");
const { uploadMovieImageMiddleware } = require("../middlewares/upload-image.middleware");
const { removeAccents } = require("../utils/handleString");
const movieController = require("../controllers/movie.controller");
const fs = require('fs')
const movieRouter = express.Router();


// Thêm phim
movieRouter.post('/themPhim', uploadMovieImageMiddleware(), async (req, res) => {
    try {
        const hinhAnhUrl = DOMAIN + req.file.path;
        const { tenPhim, danhGia, trailer, moTa, ngayKhoiChieu } = req.body;
        const biDanh = removeAccents(tenPhim.replace(/ /g, "-").toLowerCase());
        const newMovie = { tenPhim, danhGia, trailer, moTa, ngayKhoiChieu, hinhAnh: hinhAnhUrl, biDanh }
        await movieController.uploadMovie(newMovie)
        res.status(RESPONSE_CODE.OK).send("UPLOAD MOVIE SUCCESS!")
    } catch (error) {
        res.status(RESPONSE_CODE.BAD_REQUEST).send(error)
    }
})

movieRouter.get("/LayDanhSachPhim", async (req, res) => {
    try {
        await fs.unlinkSync('/public/images/poster/1633678169414_321515.jpg')
        const movieList = await movieController.getMovieList();
        res.status(RESPONSE_CODE.OK).send(movieList);
    } catch (error) {
        res.status(RESPONSE_CODE.BAD_REQUEST).send(error)
    }
})

movieRouter.get("/LayThongTinPhimTheoId/:id", async (req, res) => {
    try {
        const movie = await movieController.getMovieById(req.params.id);
        if (!movie) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("ID IS NOT EXIST")
        }
        res.status(RESPONSE_CODE.OK).send(movie);
    } catch (error) {
        res.status(RESPONSE_CODE.BAD_REQUEST).send(error)
    }
})

movieRouter.delete("/xoaPhim/:id", async (req, res) => {
    try {
        const { id } = req.params

        const movie = await movieController.getMovieById(id);
        if (!movie) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("ID IS NOT EXIST")
        }
        await movieController.deleteMovieById(id);
        res.status(RESPONSE_CODE.OK).send(`ID ${id} DELETED`);
    } catch (error) {
        res.status(RESPONSE_CODE.BAD_REQUEST).send(error)
    }
})

movieRouter.post("/capNhatPhim/:id", uploadMovieImageMiddleware(), async (req, res) => {
    try {
        const { id } = req.params

        const movie = await movieController.getMovieById(id);
        if (!movie) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).send("ID IS NOT EXIST")
        }
        const hinhAnhUrl = DOMAIN + req.file.path;
        const { tenPhim, danhGia, trailer, moTa, ngayKhoiChieu } = req.body;
        const biDanh = removeAccents(tenPhim.replace(/ /g, "-").toLowerCase());

        const dataUpdate = { tenPhim, danhGia, trailer, moTa, ngayKhoiChieu, hinhAnh: hinhAnhUrl, biDanh }
        await movieController.updateMovieById(id, dataUpdate);
        res.status(RESPONSE_CODE.OK).send(`ID ${id} UPDATED`);
    } catch (error) {
        res.status(RESPONSE_CODE.BAD_REQUEST).send(error)
    }
})








module.exports = {
    movieRouter
}