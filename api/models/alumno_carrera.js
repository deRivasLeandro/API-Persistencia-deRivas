'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alumno_carreras extends Model {
     static associate(models) {}
      };
  alumno_carreras.init({
    id_alumno: DataTypes.INTEGER,
    id_carrera: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'alumno_carreras',
  });
  alumno_carreras.associate = function(models) {
    alumno_carreras.belongsTo(models.alumno,
      {
        as:'alumno-que-cursa',
        foreignKey: 'id_alumno'
      })
    alumno_carreras.belongsTo(models.carrera,
      {
        as:'carrera-cursada',
        foreignKey:'id_carrera'
      })
  }

  return alumno_carreras;
};