'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alumno extends Model {
     static associate(models) {}
  }
  alumno.init({
    dni: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'alumno',
  });
  alumno.associate = function(models) {
    alumno.hasMany(models.alumno_carreras
      ,{
        as : 'carreras-que-cursa',
        foreignKey: 'id_alumno'
      })
    alumno.hasMany(models.alumno_materia
      ,{
        as : 'materias-cursando', 
        foreignKey: 'id_alumno'
      })
  }
  return alumno;
};