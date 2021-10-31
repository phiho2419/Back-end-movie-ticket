'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Movie.init({
    tenPhim: DataTypes.STRING,
    danhGia: DataTypes.INTEGER,
    biDanh: DataTypes.STRING,
    trailer: DataTypes.STRING,
    hinhAnh: DataTypes.STRING,
    moTa: DataTypes.STRING,
    ngayKhoiChieu: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};