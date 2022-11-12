'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alumno_materia extends Model {
    static associate(models)  {
      this.belongsTo(models.alumno
      ,{
        as : 'alumno-en-materia',
        foreignKey: 'id_alumno',
      });
      this.belongsTo(models.materias
      ,{
        as : 'materia-cursada',
        foreignKey: 'id_materia',
      });
    }
  }
  alumno_materia.init({
    id_alumno: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'alumno_materia',
  });
  return alumno_materia;
};