'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alumno_materia extends Model {
     static associate(models) {}
      };
  alumno_materia.init({
    id_alumno: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'alumno_materia',
  });
  alumno_materia.associate = function(models) {
    alumno_materia.belongsTo(models.alumno,
      {
        as:'alumno-que-cursa',
        foreignKey: 'id_alumno'
      })
    alumno_materia.belongsTo(models.materias,
      {
        as:'materia-cursada',
        foreignKey:'id_materia'
      })
  }

  return alumno_materia;
};