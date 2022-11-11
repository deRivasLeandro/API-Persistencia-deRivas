'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alumno_carrera extends Model {
     static associate(models) {
      this.belongsTo(models.alumno
      ,{
        as : 'alumnos',
        foreignKey: 'dni_alumno',
      });
      this.belongsTo(models.carrera
      ,{
        as : 'carreras',
        foreignKey: 'id_carrera',
      });
    }
  }
  alumno_carrera.init({
    dni_alumno: DataTypes.INTEGER,
    id_carrera: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'alumno_carrera',
  });
  return alumno_carrera;
};