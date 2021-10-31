const { Movie } = require("../models")

const uploadMovie = (newMovie) => {
    return Movie.create(newMovie);
}

const getMovieList = () => {
    return Movie.findAll();
}

const getMovieById = (id) => {
    return Movie.findOne({
        where: { id }
    });
}

const deleteMovieById = (id) => {
    return Movie.destroy({
        where: { id }
    });
}

const updateMovieById = (id,dataUpdate) => {
    return Movie.update(dataUpdate,{
        where: { id }
    });
}


module.exports = {
    uploadMovie,
    getMovieList,
    getMovieById,
    deleteMovieById,
    updateMovieById
}