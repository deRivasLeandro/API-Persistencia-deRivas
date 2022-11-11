'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alumno extends Model {
     static associate(models) {
      this.hasMany(models.alumno_carrera
      ,{
        as : 'carreras-que-cursa',
        foreignKey: 'dni_alumno'
      })
      this.hasMany(models.alumno_materia
      ,{
        as : 'materias-cursando', 
        foreignKey: 'dni_alumno'
      })
    }
  }
  alumno.init({
    dni: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'alumno',
  });
  return alumno;
};