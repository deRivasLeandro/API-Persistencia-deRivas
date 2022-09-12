'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class materias extends Model {
    static associate(models) {}
  }
  materias.init({
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'materias',
  });
  return materias;
};